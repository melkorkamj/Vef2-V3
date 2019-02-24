const express = require('express');

const { selectUsr, updateUsr, clearAdminUsr } = require('./db');
const { catchErrors } = require('./utils');

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

/**
 * Ósamstilltur route handler sem vinnur úr umsókn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/admin`
 */
async function updateUser(req, res) {
  await clearAdminUsr();
  const { id } = req.body;
  if (id) {
    await id.forEach((userID) => {
      updateUsr([userID]);
    });
  }
  return res.redirect('/admin');
}

router.get('/', catchErrors(users));
router.post('/update', catchErrors(updateUser));

module.exports = router;
