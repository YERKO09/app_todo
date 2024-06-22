import { pool } from "../database/connection.js";

const findOneEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

const create = async ({ username, email, password }) => {
  const query =
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";
  const { rows } = await pool.query(query, [username, email, password]);
  return rows[0];
};

export const userModel = {
  findOneEmail,
  create,
};
