var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Matcha', created_by: 'Roman Malyavchik', logged_user: false });
});

module.exports = router;
