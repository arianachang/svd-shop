//cart constructor object
module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {}; //object where key is productID
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	//add new item to cart
	this.add = function(item, id) {
		let storedItem = this.items[id];
		if(!storedItem) {
			//if no item exists already, create new one
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	//reduce quantity of product by 1
	this.reduceByOne = function(id) {
		this.items[id].qty--;
		this.items[id].price -= this.items[id].item.price;
		this.totalQty--;
		this.totalPrice -= this.items[id].item.price;

		if(this.items[id].qty <= 0) {
			//no items remain, remove from cart
			delete this.items[id];
		}
	}

	//remove all quantity of a product
	this.removeItem = function(id) {
		this.totalQty -= this.items[id].qty;
		this.totalPrice -= this.items[id].price;
		delete this.items[id];
	}

	//return a list of product groups as array
	this.generateArray = function() {
		let arr = [];
		for(let id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};