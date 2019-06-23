const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const User = require('../models/user-model');
const keys = require('./keys');


passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id,(err,user)=>{
	//	console.log("deserialize:>>"+id);
		if(err) done(err);
		else done(null,user);
	});
});

passport.use(new SteamStrategy({
	returnURL: keys.steamAuth.returnURL,
	realm: keys.steamAuth.realm,
	apiKey: keys.steamAuth.apiKey
},(identifier, profile, done)=>{
	//console.log(profile);
	User.findById(profile.id)
		.then((curUser)=>{
			//console.log(curUser);
			if(curUser){
				console.log('authorised '+curUser);
				done(null,curUser);
			}
			else{
				const user=new User({
					_id:profile.id,
					displayName:profile.displayName,
					smallAvatar:profile.photos[0].value,
					sets:null
				});
				user.save((err, userObj)=>{
					if (err) {
						console.error(err);
					}
					let date=new Date();
					console.log(userObj,' registred ',date.toUTCString());
				});
				done(null,user);
			}
		})
		.catch((err)=>{
			console.error(err);
		});
}));



