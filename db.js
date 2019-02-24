const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function query(q, values = []) {
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(q, values);

    return result;
  } catch (err) {
    throw err;
  } finally {
    await client.end();
  }
}

async function insertAppl(data) {
  const q = `
INSERT INTO applications
(name, email, phone, text, job)
VALUES
($1, $2, $3, $4, $5)`;
  const values = [data.name, data.email, data.phone, data.text, data.job];

  return query(q, values);
}

async function selectAppl() {
  const result = await query('SELECT * FROM applications ORDER BY id');

  return result.rows;
}

async function updateAppl(id) {
  const q = `
UPDATE applications
SET processed = true, updated = current_timestamp
WHERE id = $1`;

  return query(q, [id]);
}

async function deleteRow(id) {
  const q = 'DELETE FROM applications WHERE id = $1';

  return query(q, [id]);
}

async function insertUsr(data) {
  const q = `
INSERT INTO users
(name, email, username, password)
VALUES
($1, $2, $3, $4)`;
  const values = [data.name, data.email, data.username, data.hash];

  return query(q, values);
}

async function selectUsr() {
  const result = await query('SELECT * FROM users ORDER BY id');

  return result.rows;
}

async function updateUsr(id) {
  const q = `
UPDATE users
SET admin = true
WHERE id = $1`;

  return query(q, id);
}

async function clearAdminUsr() {
  const q = `
UPDATE users
SET admin = false`;

  return query(q, []);
}

module.exports = {
  query,
  insertAppl,
  selectAppl,
  updateAppl,
  deleteRow,
  insertUsr,
  selectUsr,
  updateUsr,
  clearAdminUsr,
};
