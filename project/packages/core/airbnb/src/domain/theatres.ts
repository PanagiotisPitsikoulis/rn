/**
 * Theatres domain — theaters, shows, showtimes, seats, and reservations.
 * Matches the full-stack starter sample shape so a native client can browse
 * venues, view showtimes, pick seats, and book.
 */

import { homes as seedHomes } from "./homes-dataset";

export type Theatre = {
  id: string;
  name: string;
  city: string;
  country: string;
  location: string;
  description: string;
  image: string;
  lat: number;
  lng: number;
  capacity: number;
};

export type Show = {
  id: string;
  theatreId: string;
  title: string;
  description: string;
  durationMinutes: number;
  ageRating: string;
  genre: string;
  image: string;
};

export type SeatCategory = "standard" | "premium" | "vip";

export type SeatCategoryInfo = {
  id: SeatCategory;
  label: string;
  priceCents: number;
};

export const SEAT_CATEGORIES: SeatCategoryInfo[] = [
  { id: "standard", label: "Standard", priceCents: 1800 },
  { id: "premium", label: "Premium", priceCents: 3200 },
  { id: "vip", label: "VIP", priceCents: 5400 },
];

export type Showtime = {
  id: string;
  showId: string;
  theatreId: string;
  /** ISO 8601 datetime. */
  startsAt: string;
  hall: string;
  totalSeats: number;
};

export type Seat = {
  id: string;
  showtimeId: string;
  row: string;
  number: number;
  category: SeatCategory;
};

export type TheatreReservation = {
  id: string;
  userId: string | null;
  showtimeId: string;
  seatIds: string[];
  totalCents: number;
  currency: string;
  status: "confirmed" | "cancelled";
  createdAt: string;
};

/** Stable seed catalog so the mobile client always sees data. */
function commonsImage(file: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`;
}

const baseTheatres: Theatre[] = [
  {
    id: "th-pallas-athens",
    name: "Pallas Theatre",
    city: "Athens",
    country: "Greece",
    location: "Voukourestiou 5, Athens",
    description:
      "Historic theatre in the Kolonaki arcade hosting drama, musicals, and stand-up comedy.",
    image: commonsImage("Hall of the Pallas Theatre.jpg"),
    lat: 37.978,
    lng: 23.7375,
    capacity: 980,
  },
  {
    id: "th-thessaloniki-kratiko",
    name: "Kratiko Theatre",
    city: "Thessaloniki",
    country: "Greece",
    location: "Eth. Aminis 2, Thessaloniki",
    description: "State Theatre of Northern Greece — classical and contemporary stagings.",
    image: commonsImage("Thessaloniki night building.jpg"),
    lat: 40.6261,
    lng: 22.9486,
    capacity: 720,
  },
  {
    id: "th-old-vic-london",
    name: "The Old Vic",
    city: "London",
    country: "United Kingdom",
    location: "The Cut, London SE1 8NB",
    description: "200-year-old London playhouse with new commissions and revivals.",
    image: commonsImage("Old Vic Theatre, Waterloo Exterior 1.jpg"),
    lat: 51.5022,
    lng: -0.1093,
    capacity: 1067,
  },
  {
    id: "th-broadway-shubert",
    name: "Shubert Theatre",
    city: "New York",
    country: "United States",
    location: "225 W 44th St, New York, NY",
    description: "Broadway flagship with long-running musicals.",
    image: commonsImage("Shubert Theatre, Manhattan, New York (7237737320).jpg"),
    lat: 40.7589,
    lng: -73.9854,
    capacity: 1460,
  },
];

const baseShows: Show[] = [
  {
    id: "show-antigone",
    theatreId: "th-pallas-athens",
    title: "Antigone",
    description: "Sophocles' tragedy in a modern translation.",
    durationMinutes: 110,
    ageRating: "12+",
    genre: "Tragedy",
    image: commonsImage("Hall of the Pallas Theatre.jpg"),
  },
  {
    id: "show-mamma-mia",
    theatreId: "th-pallas-athens",
    title: "Mamma Mia!",
    description: "The ABBA jukebox musical, Greek touring production.",
    durationMinutes: 140,
    ageRating: "All",
    genre: "Musical",
    image: commonsImage("London Coliseum Stage and Orchestra Pit 2018-09-23.jpg"),
  },
  {
    id: "show-three-sisters",
    theatreId: "th-thessaloniki-kratiko",
    title: "Three Sisters",
    description: "Chekhov, in a contemporary staging.",
    durationMinutes: 165,
    ageRating: "12+",
    genre: "Drama",
    image: commonsImage("Thessaloniki night building.jpg"),
  },
  {
    id: "show-medea",
    theatreId: "th-thessaloniki-kratiko",
    title: "Medea",
    description: "Euripides reimagined in a black-box treatment.",
    durationMinutes: 95,
    ageRating: "15+",
    genre: "Tragedy",
    image: commonsImage("View of Orpheum Theater auditorium from stage.jpg"),
  },
  {
    id: "show-hamlet",
    theatreId: "th-old-vic-london",
    title: "Hamlet",
    description: "Shakespeare's tragedy with a contemporary cast.",
    durationMinutes: 180,
    ageRating: "12+",
    genre: "Tragedy",
    image: commonsImage("Opening Curtain The Old Vic - 2017-04-09.jpg"),
  },
  {
    id: "show-cabaret",
    theatreId: "th-old-vic-london",
    title: "Cabaret",
    description: "The Kit Kat Club returns to the West End.",
    durationMinutes: 155,
    ageRating: "15+",
    genre: "Musical",
    image: commonsImage("Old Vic Theatre, Waterloo Exterior Stage Door 1.jpg"),
  },
  {
    id: "show-hadestown",
    theatreId: "th-broadway-shubert",
    title: "Hadestown",
    description: "Tony-winning folk-jazz musical.",
    durationMinutes: 150,
    ageRating: "12+",
    genre: "Musical",
    image: commonsImage("Shubert Theatre NYC from Shubert Alley.jpg"),
  },
  {
    id: "show-othello",
    theatreId: "th-broadway-shubert",
    title: "Othello",
    description: "Shakespeare's tragedy in a fresh New York staging.",
    durationMinutes: 175,
    ageRating: "12+",
    genre: "Tragedy",
    image: commonsImage(
      "Auditorium, Riviera Theatre, Racine Avenue and Broadway, Uptown, Chicago, IL (52523398125).jpg",
    ),
  },
];

type CitySeed = {
  city: string;
  country: string;
  lat: number;
  lng: number;
};

const theatreImages = [
  commonsImage("Hall of the Pallas Theatre.jpg"),
  commonsImage("View of Orpheum Theater auditorium from stage.jpg"),
  commonsImage(
    "Auditorium, Riviera Theatre, Racine Avenue and Broadway, Uptown, Chicago, IL (52523398125).jpg",
  ),
  commonsImage("London Coliseum auditorium 001.jpg"),
  commonsImage("London Coliseum auditorium 002.jpg"),
  commonsImage("London Coliseum Auditorium 2018-09-23 1.jpg"),
  commonsImage("London Coliseum Stage and Orchestra Pit 2018-09-23.jpg"),
  commonsImage("Interior view of stage, The Florida Theatre, Jacksonville.jpg"),
  commonsImage("Florida Theater.JPG"),
  commonsImage("London Queen's Theatre auditorium.jpg"),
  commonsImage("Old Vic Theatre, Waterloo Exterior 1.jpg"),
  commonsImage("Opening Curtain The Old Vic - 2017-04-09.jpg"),
  commonsImage("Shubert Theatre, Manhattan, New York (7237737320).jpg"),
  commonsImage("Shubert Theatre NYC from Shubert Alley.jpg"),
  commonsImage("2007 Greece Athens Theatre of Dionysus Eleuthereus.jpg"),
  commonsImage("Theatre of Dionysus-Athens.jpg"),
];

const generatedVenueTemplates = [
  {
    capacity: 620,
    id: "playhouse",
    name: "City Playhouse",
    offset: [-0.014, 0.012] as const,
  },
  {
    capacity: 940,
    id: "arts-centre",
    name: "Grand Arts Centre",
    offset: [0.016, -0.011] as const,
  },
];

const generatedShowTemplates = [
  {
    ageRating: "12+",
    description: "A contemporary staging of a classic story with a local ensemble.",
    durationMinutes: 115,
    genre: "Drama",
    id: "glass-city",
    title: "The Glass City",
  },
  {
    ageRating: "All",
    description: "A bright touring musical built around big choruses and quick comedy.",
    durationMinutes: 140,
    genre: "Musical",
    id: "bright-lights",
    title: "Bright Lights",
  },
  {
    ageRating: "15+",
    description: "A tense chamber thriller about family secrets and one impossible night.",
    durationMinutes: 100,
    genre: "Thriller",
    id: "after-midnight",
    title: "After Midnight",
  },
  {
    ageRating: "12+",
    description: "A sharp new comedy about travel, ambition, and coming home.",
    durationMinutes: 95,
    genre: "Comedy",
    id: "return-ticket",
    title: "Return Ticket",
  },
];

function slug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function theatreCitySeeds(): CitySeed[] {
  const byCity = new Map<string, { count: number; country: string; lat: number; lng: number }>();
  for (const home of seedHomes) {
    const key = `${home.city}::${home.country}`;
    const current = byCity.get(key) ?? {
      count: 0,
      country: home.country,
      lat: 0,
      lng: 0,
    };
    current.count += 1;
    current.lat += home.lat;
    current.lng += home.lng;
    byCity.set(key, current);
  }
  return [...byCity.entries()].map(([key, value]) => {
    const [city = "", country = value.country] = key.split("::");
    return {
      city,
      country,
      lat: Number((value.lat / value.count).toFixed(6)),
      lng: Number((value.lng / value.count).toFixed(6)),
    };
  });
}

function buildGeneratedTheatreCatalog(): { shows: Show[]; theatres: Theatre[] } {
  const generatedTheatres: Theatre[] = [];
  const generatedShows: Show[] = [];

  theatreCitySeeds().forEach((seed, seedIndex) => {
    const citySlug = slug(seed.city);
    generatedVenueTemplates.forEach((venue, venueIndex) => {
      const theatreId = `th-${citySlug}-${venue.id}`;
      const image =
        theatreImages[(seedIndex + venueIndex) % theatreImages.length] ?? theatreImages[0];
      generatedTheatres.push({
        capacity: venue.capacity + ((seedIndex + venueIndex) % 5) * 80,
        city: seed.city,
        country: seed.country,
        description: `${seed.city} venue with rotating theatre, music, comedy, and touring productions.`,
        id: theatreId,
        image,
        lat: Number((seed.lat + venue.offset[0]).toFixed(6)),
        lng: Number((seed.lng + venue.offset[1]).toFixed(6)),
        location: `${venue.name}, ${seed.city}`,
        name: `${seed.city} ${venue.name}`,
      });

      generatedShowTemplates.forEach((show, showIndex) => {
        generatedShows.push({
          ageRating: show.ageRating,
          description: show.description,
          durationMinutes: show.durationMinutes + ((seedIndex + showIndex) % 3) * 5,
          genre: show.genre,
          id: `show-${citySlug}-${venue.id}-${show.id}`,
          image:
            theatreImages[(seedIndex + venueIndex + showIndex) % theatreImages.length] ?? image,
          theatreId,
          title: `${seed.city} ${show.title}`,
        });
      });
    });
  });

  return { shows: generatedShows, theatres: generatedTheatres };
}

const generatedTheatreCatalog = buildGeneratedTheatreCatalog();

export const theatres: Theatre[] = [...baseTheatres, ...generatedTheatreCatalog.theatres];
export const shows: Show[] = [...baseShows, ...generatedTheatreCatalog.shows];

function nextDateISO(daysFromNow: number, hour: number, minute = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

// Slot definitions for each show: [dayOffsetFromNow, hour]. IDs are derived from
// the slot index so they stay stable across calls; `startsAt` is recomputed each
// call relative to the current moment so a long-running dev server never serves
// past dates.
const SHOWTIME_SLOTS: ReadonlyArray<readonly [number, number]> = [
  [1, 19],
  [2, 21],
  [4, 19],
  [6, 17],
  [7, 21],
];

function buildShowtimes(): Showtime[] {
  const list: Showtime[] = [];
  for (const show of shows) {
    for (const [i, [day, hour]] of SHOWTIME_SLOTS.entries()) {
      list.push({
        id: `st-${show.id}-${i}`,
        showId: show.id,
        theatreId: show.theatreId,
        startsAt: nextDateISO(day, hour),
        hall: i % 2 === 0 ? "Main Stage" : "Studio Hall",
        totalSeats: 60,
      });
    }
  }
  return list;
}

// Live accessor. Always returns showtimes anchored to "now", so a server that
// has been running for days still hands back future dates.
export function getShowtimes(): Showtime[] {
  return buildShowtimes();
}

// Stable snapshot used only for ID-keyed lookups that don't care about dates
// (seat catalog). Never read `.startsAt` from this — it freezes at module init.
const showtimesSnapshot: Showtime[] = buildShowtimes();

function buildSeats(showtime: Showtime): Seat[] {
  const rows = ["A", "B", "C", "D", "E", "F"];
  const perRow = 10;
  const seats: Seat[] = [];
  for (const row of rows) {
    for (let n = 1; n <= perRow; n += 1) {
      const category: SeatCategory =
        row === "A" || row === "B" ? "vip" : row === "C" ? "premium" : "standard";
      seats.push({
        id: `seat-${showtime.id}-${row}${n}`,
        showtimeId: showtime.id,
        row,
        number: n,
        category,
      });
    }
  }
  return seats;
}

export const seatsByShowtime: Record<string, Seat[]> = Object.fromEntries(
  showtimesSnapshot.map((st) => [st.id, buildSeats(st)] as const),
);

export function theatreById(id: string): Theatre | undefined {
  return theatres.find((t) => t.id === id);
}

export function showById(id: string): Show | undefined {
  return shows.find((s) => s.id === id);
}

export function showtimeById(id: string): Showtime | undefined {
  return getShowtimes().find((s) => s.id === id);
}

export function showsByTheatre(theatreId: string): Show[] {
  return shows.filter((s) => s.theatreId === theatreId);
}

export function showtimesByShow(showId: string): Showtime[] {
  return getShowtimes().filter((s) => s.showId === showId);
}

export function seatPriceCents(category: SeatCategory): number {
  return SEAT_CATEGORIES.find((c) => c.id === category)?.priceCents ?? 0;
}

export function searchTheatres(query: string): Theatre[] {
  const q = query.trim().toLowerCase();
  if (!q) return theatres;
  return theatres.filter(
    (t) =>
      t.name.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.country.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q),
  );
}

export function searchShows(query: string): Show[] {
  const q = query.trim().toLowerCase();
  if (!q) return shows;
  return shows.filter(
    (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
  );
}
