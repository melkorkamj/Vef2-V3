const express = require('express');

const { selectAppl, updateAppl, deleteRow } = require('./db');
const { catchErrors } = require('./utils');

const router = express.Router();

/**
 * Ósamstilltur route handler fyrir umsóknarlista.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function applications(req, res) {
  const list = await selectAppl();

  const data = {
    title: 'Umsóknir',
    list,
  };

  return res.render('applications', data);
}

/**
 * Ósamstilltur route handler sem vinnur úr umsókn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/applications`
 */
async function processApplication(req, res) {
  const { id } = req.body;

  await updateAppl(id);

  return res.redirect('/applications');
}

/**
 * Ósamstilltur route handler sem hendir umsókn.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns Redirect á `/applications`
 */
async function deleteApplication(req, res) {
  const { id } = req.body;

  await deleteRow(id);

  return res.redirect('/applications');
}

router.get('/', catchErrors(applications));
router.post('/process', catchErrors(processApplication));
router.post('/delete', catchErrors(deleteApplication));

module.exports = router;