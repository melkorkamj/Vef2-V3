const bcrypt = require('bcrypt');
const { selectUsr } = require('./db');

/**
 * Ósamstillt fall sem finnur notanda eftir notandanafni hans
 * @param {string} username notandanafn
 */
async function findByUsername(username) {
  const db = await selectUsr();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < db.length; i++) {
    // eslint-disable-next-line no-undef
    if (username === db[i].username) {
      return db[i];
    }
  }
  return 0;
}

/**
 * Ósamstillt fall sem finnur notanda eftir auðkenni hans
 * @param {int} id auðkenning notanda
 */
async function findById(id) {
  const db = await selectUsr();
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < db[i].id; i++) {
    if (id === db[i].id) {
      return db[i];
    }
  }
  return 0;
}

/**
 * Ósamstillt fall sem ber saman lykilorðin tvö sem slegin
 * eru inn
 * @param {string} password lykilorð notanda
 * @param {object} user hlutur sem inniheldur upplýsingar notanda
 */
async function comparePasswords(password, user) {
  const ok = await bcrypt.compare(password, user.password);
  if (ok) {
    return user;
  }
  return false;
}

module.exports = {
  findByUsername,
  findById,
  comparePasswords,
};
