var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
	var products = Product.find((err, documents) => {
		res.render('index', { title: 'SVD Web Shop', products: documents });
	});
});

router.get('/add-to-cart/:id', function(req, res) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if(err) {
			console.log(err);
			//error page
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		res.redirect('/');
	});
});

router.get('/shopping-cart', function(req, res, next) {
	if(!req.session.cart) {
		return res.render('shopping-cart', {products:null});
	}
	var cart = new Cart(req.session.cart);
	res.render('shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req, res, next) {
	if(!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);
	res.render('checkout', {total: cart.totalPrice});
});

router.post('/checkout', function(req, res, next) {
	if(!req.session.cart) {
		return res.redirect('/shopping-cart');
	}
	var cart = new Cart(req.session.cart);

	var stripe = require("stripe")(
  		"sk_test_bxWVXGv2yLR2OROG68zSWpbA"
	);

	stripe.charges.create({
	  amount: card.totalPrice * 100,
	  currency: "usd",
	  source: req.body.stripeToken, // obtained with Stripe.js
	  description: "Test Charge"
	}, function(err, charge) {
	  // asynchronously called
	  	if(err) {
	  		req.flash('error', err.message);
	  		return res.redirect('/checkout');
	  	}
	  	req.flash('success', 'Your order has been successfully submitted!');
	  	req.cart = null;
	  	res.redirect('/');
	});
});

module.exports = router;
