const Pool = require('pg').Pool
require('dotenv').config();

const pool = new Pool({
  user: process.env.BD_PG_USER,
  host:  process.env.BD_PG_HOST,
  database:  process.env.BD_PG_DATABASE,
  password:  process.env.BD_PG_PASSWORD,
  port:  process.env.BD_PG_PORT,
})

module.exports = pool