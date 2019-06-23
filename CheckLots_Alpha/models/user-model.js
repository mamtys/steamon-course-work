const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	_id:String,
	displayName:String,
	smallAvatar:String,
	sets:{
		telegram:{ type: String, unique: true },
		currency:String
	}
	
},{ versionKey: false });

const User = mongoose.model('user',userSchema);

module.exports = User;