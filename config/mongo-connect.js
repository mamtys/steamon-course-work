const mongoose = require('mongoose');
const keys = require('./keys');


mongoose.connect(keys.mongodb.dbURI, { 
	useNewUrlParser: true ,
	useCreateIndex: true,
	useFindAndModify: false  })
	.then(()=>console.log('Mongo connected'))
	.catch((err)=>console.error('Mongo connection err',err));