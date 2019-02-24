const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

/**
 * Samskipti við gagnagrunn
 * @param {function} q
 * @param {*} values
 */
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

/**
 * Bætir við umsókn í gagnagrunn
 * @param {object} data gögn umsóknar sem bætt er við
 */
async function insertAppl(data) {
  const q = `
INSERT INTO applications
(name, email, phone, text, job)
VALUES
($1, $2, $3, $4, $5)`;
  const values = [data.name, data.email, data.phone, data.text, data.job];
  return query(q, values);
}

/**
 * Velur allar umsóknir í gagngrunni
 */
async function selectAppl() {
  const result = await query('SELECT * FROM applications ORDER BY id');

  return result.rows;
}

/**
 * Uppfærir óunna umsókn í unna
 * @param {string} id auðkenni umsóknar
 */
async function updateAppl(id) {
  const q = `
UPDATE applications
SET processed = true, updated = current_timestamp
WHERE id = $1`;

  return query(q, [id]);
}

/**
 * Eyðir umsókn úr gagnagrunni
 *  @param {string} id auðkenni umsóknar
 */
async function deleteRow(id) {
  const q = 'DELETE FROM applications WHERE id = $1';

  return query(q, [id]);
}

/**
 * Býr til nýjan notanda í gagnagrunni
 * @param {object} data gögn nýskráðs notanda
 */
async function insertUsr(data) {
  const q = `
INSERT INTO users
(name, email, username, password)
VALUES
($1, $2, $3, $4)`;
  const values = [data.name, data.email, data.username, data.hash];

  return query(q, values);
}

/**
 * Velur alla notanda sem til eru í gagangunninum
 */
async function selectUsr() {
  const result = await query('SELECT * FROM users ORDER BY id');

  return result.rows;
}

/**
 * Uppfærir notanda í admin
 * @param {*} id auðkenni notanda
 */
async function updateUsr(id) {
  const q = `
UPDATE users
SET admin = true
WHERE id = $1`;

  return query(q, id);
}

/**
 * Uppfærir admin notanda í ekki-admin
 */
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
