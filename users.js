const bcrypt = require('bcrypt');
const { selectUsr } = require('./db');

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
