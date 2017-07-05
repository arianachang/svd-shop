//cart constructor object
module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {}; //object where key is productID
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	//add new item to cart
	this.add = function(item, id) {
		var storedItem = this.items[id];
		if(!storedItem) {
			//if no item exists already, create new one
			storedItem = this.items[id] = {item: item, qty: 0, price: 0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	//return a list of product groups as array
	this.generateArray = function() {
		var arr = [];
		for(var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};