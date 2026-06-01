import { randomUUID } from "node:crypto";
import { RESERVATION_STATUS } from "@expo-starter/shared";

function seedData() {
  const theatres = [
    {
      theatre_id: "theatre-1",
      name: "Apollo Theatre",
      location: "Athens",
      description: "Historic city theatre for classic and modern productions."
    },
    {
      theatre_id: "theatre-2",
      name: "Piraeus Stage",
      location: "Piraeus",
      description: "Compact venue with evening comedy and drama shows."
    }
  ];

  const shows = [
    {
      show_id: "show-1",
      theatre_id: "theatre-1",
      title: "Antigone",
      description: "A contemporary staging of Sophocles' tragedy.",
      duration: 95,
      age_rating: "12+"
    },
    {
      show_id: "show-2",
      theatre_id: "theatre-2",
      title: "The Comedy Night",
      description: "A fast-paced theatre comedy in two acts.",
      duration: 80,
      age_rating: "All"
    }
  ];

  const showtimes = [
    {
      showtime_id: "showtime-1",
      show_id: "show-1",
      starts_at: "2026-06-05T20:30:00.000Z",
      hall: "Main Hall",
      base_price: 18
    },
    {
      showtime_id: "showtime-2",
      show_id: "show-2",
      starts_at: "2026-06-06T19:00:00.000Z",
      hall: "Stage B",
      base_price: 14
    }
  ];

  const seats = showtimes.flatMap((showtime) =>
    ["A", "B", "C"].flatMap((row) =>
      Array.from({ length: 6 }, (_, index) => ({
        seat_id: `${showtime.showtime_id}-${row}${index + 1}`,
        showtime_id: showtime.showtime_id,
        seat_code: `${row}${index + 1}`,
        row_label: row,
        category: row === "A" ? "premium" : "standard",
        price: row === "A" ? showtime.base_price + 6 : showtime.base_price
      }))
    )
  );

  return {
    users: [],
    theatres,
    shows,
    showtimes,
    seats,
    reservations: [],
    reservationSeats: []
  };
}

export function createMemoryStore() {
  const db = seedData();

  return {
    mode: "memory",

    async createUser({ name, email, password_hash }) {
      if (db.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        const error = new Error("Email already registered");
        error.status = 409;
        throw error;
      }

      const user = {
        user_id: randomUUID(),
        name,
        email,
        password_hash,
        external_id: null
      };
      db.users.push(user);
      return user;
    },

    async findUserByEmail(email) {
      return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
    },

    async listTheatres() {
      return db.theatres;
    },

    async listShows(filters = {}) {
      return db.shows
        .filter((show) => {
          const theatre = db.theatres.find((item) => item.theatre_id === show.theatre_id);
          const q = filters.q?.toLowerCase();
          const matchesQ =
            !q ||
            show.title.toLowerCase().includes(q) ||
            theatre?.name.toLowerCase().includes(q) ||
            theatre?.location.toLowerCase().includes(q);
          const matchesTitle = !filters.title || show.title.toLowerCase().includes(filters.title.toLowerCase());
          const matchesTheatre = !filters.theatreId || show.theatre_id === filters.theatreId;
          const matchesLocation =
            !filters.location || theatre?.location.toLowerCase().includes(filters.location.toLowerCase());
          const matchesDate =
            !filters.date ||
            db.showtimes.some(
              (showtime) => showtime.show_id === show.show_id && showtime.starts_at.startsWith(filters.date)
            );
          return matchesQ && matchesTitle && matchesTheatre && matchesLocation && matchesDate;
        })
        .map((show) => ({
          ...show,
          theatre: db.theatres.find((theatre) => theatre.theatre_id === show.theatre_id)
        }));
    },

    async listShowtimes(showId) {
      return db.showtimes
        .filter((showtime) => !showId || showtime.show_id === showId)
        .map((showtime) => ({
          ...showtime,
          theatre_id: db.shows.find((show) => show.show_id === showtime.show_id)?.theatre_id,
          total_seats: db.seats.filter((seat) => seat.showtime_id === showtime.showtime_id).length,
          show: db.shows.find((show) => show.show_id === showtime.show_id)
        }));
    },

    async listSeats(showtimeId) {
      const reservedSeatIds = new Set(
        db.reservationSeats
          .filter((item) => {
            const reservation = db.reservations.find((entry) => entry.reservation_id === item.reservation_id);
            return reservation?.showtime_id === showtimeId && reservation.status === RESERVATION_STATUS.confirmed;
          })
          .map((item) => item.seat_id)
      );

      return db.seats
        .filter((seat) => seat.showtime_id === showtimeId)
        .map((seat) => ({
          ...seat,
          available: !reservedSeatIds.has(seat.seat_id)
        }));
    },

    async createReservation({ userId, showtimeId, seatIds }) {
      const seats = await this.listSeats(showtimeId);
      const selected = seats.filter((seat) => seatIds.includes(seat.seat_id));

      if (selected.length !== seatIds.length) {
        const error = new Error("One or more seats do not exist for this showtime");
        error.status = 400;
        throw error;
      }

      const unavailable = selected.filter((seat) => !seat.available);
      if (unavailable.length > 0) {
        const error = new Error("One or more seats are no longer available");
        error.status = 409;
        throw error;
      }

      const reservation = {
        reservation_id: randomUUID(),
        user_id: userId,
        showtime_id: showtimeId,
        status: RESERVATION_STATUS.confirmed,
        total_cost: selected.reduce((sum, seat) => sum + Number(seat.price), 0),
        created_at: new Date().toISOString()
      };

      db.reservations.push(reservation);
      db.reservationSeats.push(...selected.map((seat) => ({ reservation_id: reservation.reservation_id, seat_id: seat.seat_id })));

      return this.getReservation(userId, reservation.reservation_id);
    },

    async getReservation(userId, reservationId) {
      const reservation = db.reservations.find(
        (item) => item.reservation_id === reservationId && item.user_id === userId
      );
      if (!reservation) return null;

      const showtime = db.showtimes.find((item) => item.showtime_id === reservation.showtime_id);
      const show = db.shows.find((item) => item.show_id === showtime?.show_id);
      const theatre = db.theatres.find((item) => item.theatre_id === show?.theatre_id);
      const seatIds = db.reservationSeats
        .filter((item) => item.reservation_id === reservation.reservation_id)
        .map((item) => item.seat_id);
      const seats = db.seats.filter((seat) => seatIds.includes(seat.seat_id));

      return { ...reservation, showtime, show, theatre, seats };
    },

    async listUserReservations(userId) {
      const reservations = db.reservations.filter((reservation) => reservation.user_id === userId);
      return Promise.all(reservations.map((reservation) => this.getReservation(userId, reservation.reservation_id)));
    },

    async updateReservation(userId, reservationId, { seatIds }) {
      const reservation = db.reservations.find(
        (item) => item.reservation_id === reservationId && item.user_id === userId
      );
      if (!reservation) return null;

      db.reservationSeats = db.reservationSeats.filter((item) => item.reservation_id !== reservationId);
      reservation.status = RESERVATION_STATUS.cancelled;
      const replacement = await this.createReservation({ userId, showtimeId: reservation.showtime_id, seatIds });
      return replacement;
    },

    async cancelReservation(userId, reservationId) {
      const reservation = db.reservations.find(
        (item) => item.reservation_id === reservationId && item.user_id === userId
      );
      if (!reservation) return null;
      reservation.status = RESERVATION_STATUS.cancelled;
      return this.getReservation(userId, reservationId);
    }
  };
}
