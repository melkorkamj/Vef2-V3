const express = require('express');

const { selectUsr, updateUsr } = require('./db');
const { catchErrors } = require('./utils');
const bcrypt = require('bcrypt');
const router = express.Router();

/**
 * Ósamstilltur route handler fyrir umsóknarlista.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function users(req, res) {
  const list = await selectUsr();

  const data = {
    title: 'Notendur',
    list,
  };

  return res.render('admin', data);
}

async function findByUsername(username) {
  const db = await selectUsr();
  console.log("db" + db);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i <db.length; i++) {
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
  console.log(password);
  console.log(user.password);
  if (ok) {
    return user;
    console.log("sama passw");
  }
  return false;
}

/**
 * Ósamstilltur route handler sem vinnur úr umsókn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/admin`
 */
async function updateUser(req, res) {
  const { id } = req.body;

  await updateUsr(id);

  return res.redirect('/admin');
}

router.get('/', catchErrors(users));
router.post('/update', catchErrors(updateUser));

module.exports = {
    findByUsername,
    findById,
    comparePasswords,
};