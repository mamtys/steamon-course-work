const express = require('express');
const router = express.Router();
const Item=require('../models/item-model');



router.get('/', (req, res) => { 
	res.render('index');
	/*
	let number = parseInt(req.query.number) || 10;
	getItems('-nameItem',number,(items)=>{
		res.render('index', {
			user: req.user,
			items:items
		});
	});*/
});

router.get('/items', (req, res) => { 
	let number = parseInt(req.query.number) || 10;
	getItems('-nameItem',number,(items)=>{
		res.send({items,sets:req.user.sets});
	});
});


router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

function getItems(sortpar,maxNumb,callback){
	Item.find({}).sort(sortpar).limit(maxNumb).exec((err,items)=>{
		if(err) console.error(err);
		else callback(items);
	});
}

module.exports = router;

