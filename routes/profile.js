const router = require('express').Router();
const User = require('../models/user-model');


const checkAuth=(req, res, next)=>{
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/');
};

router.get('/', checkAuth, function(req, res){
	res.render('profile', { user: req.user });
});

router.get('/settings', function(req, res){
	res.render('profile', { user: req.user });
});

router.post('/', checkAuth, function(req, res){
	User.findById(req.user.id)
		.then((curUser)=>{
			console.log('duplicate'+curUser);
			curUser.sets.telegram=req.body.tel;
			curUser.sets.currency=req.body.cur;
			curUser.save().catch((err)=>{
				console.error(err);
			});
		})
		.catch((err)=>console.error(err));
	res.redirect('/profile');
});


module.exports = router;
