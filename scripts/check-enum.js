const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT enum_range(NULL::\"Role\")");
    console.log("Role Enum Values in DB:");
    console.log(res.rows[0].enum_range);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
