const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	_id:String,
	itemName:String,
	gameName:String,
	smallPhoto:String,
	url:String,
	highestBuyOrder:String
},{ versionKey: false });

userSchema.index({itemName:'text' , gameName:'text'});

const Item = mongoose.model('item',userSchema);

module.exports = Item;