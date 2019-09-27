const router = require('express').Router();
const Item=require('../models/item-model');

router.get('/', (req, res) => { 
	let number=req.query.number || 10;
	serchItems(req.query.q,number,(item)=>{
		console.log(item);
		res.render('search', {
			user: req.user,
			items:item
		});
	});
});

function serchItems(str,maxNumb,callback){
	Item.find({$text:{$search:str}}).limit(maxNumb)
		.then((item)=>{
			callback(item);
		})
		.catch((err)=>console.error(err));
}

module.exports = router;