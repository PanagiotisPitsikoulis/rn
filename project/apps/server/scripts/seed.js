import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "../../..");

dotenv.config({ path: resolve(projectRoot, ".env") });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

function connectionConfig(urlString) {
  const url = new URL(urlString);
  return {
    database: decodeURIComponent(url.pathname.replace(/^\//, "")),
    host: url.hostname,
    multipleStatements: true,
    password: decodeURIComponent(url.password),
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
  };
}

async function seedDemoUser(connection) {
  const passwordHash = await bcrypt.hash("password123", 10);
  await connection.execute(
    `INSERT IGNORE INTO users (user_id, name, email, password_hash, external_id)
     VALUES (?, ?, ?, ?, ?)`,
    ["seed-user-native-main", "Native Demo", "native@test.com", passwordHash, null],
  );
  await connection.execute(
    `INSERT IGNORE INTO users (user_id, name, email, password_hash, external_id)
     VALUES (?, ?, ?, ?, ?)`,
    ["seed-user-student-main", "Student Demo", "student@test.com", passwordHash, null],
  );
}

async function main() {
  if (!databaseUrl) {
    console.log("DATABASE_URL is not set. The RN server will use its seeded in-memory store.");
    return;
  }

  const schemaSql = readFileSync(resolve(projectRoot, "db/schema.sql"), "utf8");
  const connection = await mysql.createConnection(connectionConfig(databaseUrl));

  try {
    await connection.query(schemaSql);
    await seedDemoUser(connection);
    console.log("RN database seeded.");
    console.log("Demo users: native@test.com / password123, student@test.com / password123");
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
