var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Matcha', created_by: 'Rmalyavc', logged_user: false });
});
router.get('login/', function(req, res, next) {
  res.render('index', { title: 'Matcha', created_by: 'Rmalyavc' });
});

module.exports = router;
