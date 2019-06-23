const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
	_id: { type: String, ref: 'User' },
	telegram:String,
	lots: [{
		_id: {
			type:  String,
			index: true,
			required: true,
		},
		value: Number,
		item: Object
	}]
},{ versionKey: false });

const Trace = mongoose.model('trace',userSchema);

module.exports = Trace;