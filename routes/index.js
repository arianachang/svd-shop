var express = require('express');
var router = express.Router();

var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');

//email config
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'arianachang1@gmail.com',
		pass: 'ac042319'
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
	var successMsg = req.flash('success')[0];
	var errorMsg = req.flash('error')[0];
	var products = Product.find((err, documents) => {
		res.render('index', { title: 'SVD Web Shop', products: documents, successMsg: successMsg, noMessages: !successMsg, errorMsg: errorMsg, noError: !errorMsg });
	});
});

router.get('/add-to-cart/:id', function(req, res) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product) {
		if(err) {
			console.log(err);
			req.flash('error', err);
			return res.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/');
	});
});

router.get('/reduce/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect('/shopping-cart');
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
	var errMsg = req.flash('error')[0];
	res.render('checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
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
	  amount: cart.totalPrice * 100,
	  currency: "usd",
	  source: req.body.stripeToken, // obtained with Stripe.js
	  description: "Test Charge"
	}, function(err, charge) {
			if(err) {
				req.flash('error', err.message);
				return res.redirect('/checkout');
			}

			//create new order & save to db
			var order = new Order({
				cart: cart,
				address: req.body.address,
				name: req.body.name,
				email: req.body.email,
				paymentId: charge.id
			});
			order.save(function(error, result) {
				//TODO: ERROR CHECKING

				//send confirmation email
				var mailOptions = {
					from: 'arianachang1@gmail.com',
					to: req.body.email,
			 		subject: 'Your order from Singer Vehicle Design has been received',
					html: 'Thank you for purchasing from the Singer Vehicle Design Web Shop! Your order # is <strong>' + charge.id + '</strong>. A summary of your order is below. <br> <h2>Total: $' + order.cart.totalPrice + '</h2><br>'
				};
				transporter.sendMail(mailOptions, function(error, info) {
					if(error) {
						req.flash('error', error.message);
						console.log(error);
						return res.redirect('/checkout');
					}
					else {
						console.log('Email sent: ' + info.response);
						req.flash('success', 'Your order has been successfully submitted! A confirmation email has been sent to ' + req.body.email);
						req.session.cart = null;
						res.redirect('/');
					}
				});

				//req.flash('success', 'Your order has been successfully submitted! A confirmation email has been sent to ' + req.body.email);
				//req.session.cart = null;
				//res.redirect('/');
			});
	});
});

module.exports = router;
