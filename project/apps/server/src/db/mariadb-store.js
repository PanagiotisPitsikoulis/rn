import mysql from "mysql2/promise";
import { randomUUID } from "node:crypto";
import { RESERVATION_STATUS } from "@expo-starter/shared";

export function createMariaDbStore(databaseUrl) {
  const pool = mysql.createPool(databaseUrl);

  return {
    mode: "mariadb",

    async createUser({ name, email, password_hash }) {
      const userId = randomUUID();
      try {
        await pool.execute(
          "INSERT INTO users (user_id, name, email, password_hash) VALUES (?, ?, ?, ?)",
          [userId, name, email, password_hash]
        );
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          error.status = 409;
          error.message = "Email already registered";
        }
        throw error;
      }
      return { user_id: userId, name, email, password_hash };
    },

    async findUserByEmail(email) {
      const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
      return rows[0] || null;
    },

    async listTheatres() {
      const [rows] = await pool.execute("SELECT * FROM theatres ORDER BY name");
      return rows;
    },

    async listShows(filters = {}) {
      const values = [];
      const where = [];

      if (filters.theatreId) {
        where.push("s.theatre_id = ?");
        values.push(filters.theatreId);
      }
      if (filters.title) {
        where.push("s.title LIKE ?");
        values.push(`%${filters.title}%`);
      }
      if (filters.q) {
        where.push("(s.title LIKE ? OR t.name LIKE ? OR t.location LIKE ?)");
        values.push(`%${filters.q}%`, `%${filters.q}%`, `%${filters.q}%`);
      }
      if (filters.location) {
        where.push("t.location LIKE ?");
        values.push(`%${filters.location}%`);
      }
      if (filters.date) {
        where.push("EXISTS (SELECT 1 FROM showtimes st WHERE st.show_id = s.show_id AND DATE(st.starts_at) = ?)");
        values.push(filters.date);
      }

      const [rows] = await pool.execute(
        `SELECT s.*, t.name AS theatre_name, t.location AS theatre_location, t.description AS theatre_description
         FROM shows s
         JOIN theatres t ON t.theatre_id = s.theatre_id
         ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
         ORDER BY s.title`,
        values
      );

      return rows.map((row) => ({
        show_id: row.show_id,
        theatre_id: row.theatre_id,
        title: row.title,
        description: row.description,
        duration: row.duration,
        age_rating: row.age_rating,
        theatre: {
          theatre_id: row.theatre_id,
          name: row.theatre_name,
          location: row.theatre_location,
          description: row.theatre_description
        }
      }));
    },

    async listShowtimes(showId) {
      const params = [];
      const where = showId ? "WHERE st.show_id = ?" : "";
      if (showId) params.push(showId);

      const [rows] = await pool.execute(
        `SELECT st.*, s.theatre_id, s.title, s.duration, s.age_rating, COUNT(se.seat_id) AS total_seats
         FROM showtimes st
         JOIN shows s ON s.show_id = st.show_id
         LEFT JOIN seats se ON se.showtime_id = st.showtime_id
         ${where}
         GROUP BY st.showtime_id, st.show_id, st.starts_at, st.hall, st.base_price, s.theatre_id, s.title, s.duration, s.age_rating
         ORDER BY st.starts_at`,
        params
      );

      return rows.map((row) => ({
        showtime_id: row.showtime_id,
        show_id: row.show_id,
        theatre_id: row.theatre_id,
        starts_at: row.starts_at,
        hall: row.hall,
        base_price: row.base_price,
        total_seats: row.total_seats,
        show: {
          show_id: row.show_id,
          theatre_id: row.theatre_id,
          title: row.title,
          duration: row.duration,
          age_rating: row.age_rating
        }
      }));
    },

    async listSeats(showtimeId) {
      const [rows] = await pool.execute(
        `SELECT
           s.*,
           CASE WHEN r.reservation_id IS NULL THEN TRUE ELSE FALSE END AS available
         FROM seats s
         LEFT JOIN reservation_seats rs ON rs.seat_id = s.seat_id
         LEFT JOIN reservations r
           ON r.reservation_id = rs.reservation_id
          AND r.showtime_id = s.showtime_id
          AND r.status = 'confirmed'
         WHERE s.showtime_id = ?
         ORDER BY s.row_label, s.seat_code`,
        [showtimeId]
      );
      return rows.map((row) => ({ ...row, available: Boolean(row.available) }));
    },

    async createReservation({ userId, showtimeId, seatIds }) {
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const [availableRows] = await connection.query(
          `SELECT s.*
           FROM seats s
           LEFT JOIN reservation_seats rs ON rs.seat_id = s.seat_id
           LEFT JOIN reservations r
             ON r.reservation_id = rs.reservation_id
            AND r.showtime_id = s.showtime_id
            AND r.status = 'confirmed'
           WHERE s.showtime_id = ?
             AND s.seat_id IN (?)
             AND r.reservation_id IS NULL
           FOR UPDATE`,
          [showtimeId, seatIds]
        );

        if (availableRows.length !== seatIds.length) {
          const error = new Error("One or more seats are no longer available");
          error.status = 409;
          throw error;
        }

        const reservationId = randomUUID();
        const total = availableRows.reduce((sum, seat) => sum + Number(seat.price), 0);

        await connection.execute(
          `INSERT INTO reservations (reservation_id, user_id, showtime_id, status, total_cost)
           VALUES (?, ?, ?, ?, ?)`,
          [reservationId, userId, showtimeId, RESERVATION_STATUS.confirmed, total]
        );

        for (const seatId of seatIds) {
          await connection.execute(
            "INSERT INTO reservation_seats (reservation_id, seat_id) VALUES (?, ?)",
            [reservationId, seatId]
          );
        }

        await connection.commit();
        return this.getReservation(userId, reservationId);
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    },

    async getReservation(userId, reservationId) {
      const [rows] = await pool.execute(
        `SELECT r.*, st.starts_at, st.hall, sh.title, th.name AS theatre_name
         FROM reservations r
         JOIN showtimes st ON st.showtime_id = r.showtime_id
         JOIN shows sh ON sh.show_id = st.show_id
         JOIN theatres th ON th.theatre_id = sh.theatre_id
         WHERE r.reservation_id = ? AND r.user_id = ?`,
        [reservationId, userId]
      );
      const reservation = rows[0];
      if (!reservation) return null;

      const [seats] = await pool.execute(
        `SELECT s.*
         FROM reservation_seats rs
         JOIN seats s ON s.seat_id = rs.seat_id
         WHERE rs.reservation_id = ?
         ORDER BY s.row_label, s.seat_code`,
        [reservationId]
      );

      return {
        reservation_id: reservation.reservation_id,
        user_id: reservation.user_id,
        showtime_id: reservation.showtime_id,
        status: reservation.status,
        total_cost: reservation.total_cost,
        created_at: reservation.created_at,
        showtime: { showtime_id: reservation.showtime_id, starts_at: reservation.starts_at, hall: reservation.hall },
        show: { title: reservation.title },
        theatre: { name: reservation.theatre_name },
        seats
      };
    },

    async listUserReservations(userId) {
      const [rows] = await pool.execute(
        "SELECT reservation_id FROM reservations WHERE user_id = ? ORDER BY created_at DESC",
        [userId]
      );
      return Promise.all(rows.map((row) => this.getReservation(userId, row.reservation_id)));
    },

    async updateReservation(userId, reservationId, { seatIds }) {
      const existing = await this.getReservation(userId, reservationId);
      if (!existing) return null;
      await this.cancelReservation(userId, reservationId);
      return this.createReservation({ userId, showtimeId: existing.showtime_id, seatIds });
    },

    async cancelReservation(userId, reservationId) {
      const [result] = await pool.execute(
        "UPDATE reservations SET status = 'cancelled' WHERE reservation_id = ? AND user_id = ?",
        [reservationId, userId]
      );
      if (result.affectedRows === 0) return null;
      return this.getReservation(userId, reservationId);
    }
  };
}
