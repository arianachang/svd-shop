var express = require('express');
var router = express.Router();
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
	var products = Product.find((err, documents) => {
		res.render('index', { title: 'SVD Web Shop', products: documents });
	});
});

module.exports = router;
