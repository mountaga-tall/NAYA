import { Client } from "pg";
import { execFileSync } from "node:child_process";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is required for production migrations.");
}

const client = new Client({ connectionString: DATABASE_URL });

try {
  await client.connect();

  const tables = await client.query(`
    SELECT
      to_regclass('public."User"') IS NOT NULL AS user_exists,
      to_regclass('public._prisma_migrations') IS NOT NULL AS migrations_table_exists
  `);

  const { user_exists: userExists, migrations_table_exists: migrationsTableExists } = tables.rows[0];
  let migrationCount = 0;

  if (migrationsTableExists) {
    const result = await client.query(
      'SELECT COUNT(*)::int AS count FROM "_prisma_migrations"'
    );
    migrationCount = result.rows[0].count;
  }

  if (userExists && (!migrationsTableExists || migrationCount === 0)) {
    console.log("Existing NAYA schema detected; marking baseline migration as applied.");
    execFileSync(
      process.platform === "win32" ? "npx.cmd" : "npx",
      ["prisma", "migrate", "resolve", "--applied", "20260929000000_baseline"],
      { stdio: "inherit", env: process.env }
    );
  } else {
    console.log("No baseline resolution needed.");
  }
} finally {
  await client.end().catch(() => {});
}
