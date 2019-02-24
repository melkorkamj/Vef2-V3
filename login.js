const express = require('express');

const router = express.Router();

/**
 * Route handler fyrir form umsóknar.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Formi fyrir umsókn
 */
function form(req, res) {
  const data = {
    title: 'Innskráning',
    username: '',
    password: '',
    errors: [],
    page: 'login',
  };
  res.render('login', data);
}

/**
 * Fall sem redirectar á /admin
 * @param {*} req Request hlutur
 * @param {*} res REsponse hlutur
 */
function admin(req, res) {
  return res.render('admin');
}

router.get('/', form);
router.get('/admin', admin);

module.exports = router;
