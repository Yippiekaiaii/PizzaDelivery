
//Cart Constructor
module.exports = function Cart(oldCart) {

    this.items = oldCart.items || {}; //on these 3 lines - if the old cart is undefined then use the value on the right of the ||
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
    this.add = function(item, id,qty) {
        //the cart checks if the item type already exists, if it does it adds another one, if not it adds the item as a fresh item       
        let storedItem = this.items[id]; 
        if (!storedItem){ //check if the item exists in the cart already, if it doesnt add it
            storedItem = this.items[id] = {item: item, qty: 0, price: 0};            
        }

        //after the above check increase the quantity of the items that have been added and increase the price 
        let newqty = parseFloat(qty);       
        storedItem.qty = storedItem.qty + newqty;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty = this.totalQty + newqty;
        this.totalPrice += (storedItem.item.price * newqty);       
    }

        //function to remove an item from the cart
    this.reduceByOne = function(id){
        this.items[id].qty = this.items[id].qty -1;
        this.items[id].price = this.items[id].price - this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price; 
        
        if (this.items[id].qty <=0){
            delete this.items[id];
        }
    };

    this.increaseByOne = function(id){     
        this.items[id].qty = this.items[id].qty +1;        
        this.items[id].price = this.items[id].price + this.items[id].item.price;        
        this.totalQty++;
        this.totalPrice += this.items[id].item.price; 
       
    };

    this.generateArray = function() {
        //this function puts the above into array so that we can output into a list      
        let arr = [];
        for (let id in this.items) {
            arr.push(this.items[id]); 
        }
        return arr;
    };

    this.deleteItem = function(id){
        this.totalQty-= this.items[id].qty;
        this.totalPrice -= this.items[id].price; 
        delete this.items[id];
    };


};