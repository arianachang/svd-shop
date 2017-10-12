//product-seeder.js

const mongoose = require('mongoose');
mongoose.connect('localhost:27017/svdshop');

const Product = require('./models/product');

const products = [
	new Product({
		imagePath: 'images/hat-front.png',
		title: 'Singer Baseball Cap',
		description: 'Gildan brand baseball cap embroided with Singer logo. Adjustable strap. One size fits all. Comes in black, white, or grey. 100% cotton. Limit one color per order.',
		price: 25,
		colors: ['Black', 'Grey', 'White']
	}),
	new Product({
		imagePath: 'images/shirt-front.png',
		title: 'Singer T-Shirt',
		description: 'American Apparel t-shirt printed with Singer logo. Colors: Navy, Black, White, Grey. Sizes: S, M, L, XL. 100% cotton.',
		price: 20,
		colors: ['Black', 'Grey', 'White', 'Navy'],
		sizes: ['Small', 'Medium', 'Large', 'Extra Large']
	}),
	new Product({
		imagePath: 'images/book.jpg',
		title: 'One More Than 10: Singer and the Porsche 911',
		description: 'By Michael Harley & Rob Dickinson. Foreword by Chad McQueen. <br> Finessed and agonised over just like the cars, this large format, hardback, 276 page, full color, Singer Vehicle Design book tells the full story behind Restored, Reimagined, Reborn for the first time.',
		price: 95
	})
];

let done = 0;

for(let i=0; i<products.length; i++) {
	products[i].save((err, result) => {
		done++;
		if(done === products.length) {
			mongoose.disconnect();
		}
	});
}