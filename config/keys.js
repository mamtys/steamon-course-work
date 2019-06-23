
module.exports = {
	mongodb:{
		//dbURI:'mongodb+srv://admin:0216admin@cluster0-bhki0.mongodb.net/test?retryWrites=true'
		dbURI:'mongodb+srv://stud:NIll7NM5jzz78e6G@cluster0-bhki0.mongodb.net/test?retryWrites=true'
	},
	session:{
		cookieKey:'somecookiekeymbencr'
	},
	steamAuth:{
		realm:'http://localhost:3000/',
		returnURL:'http://localhost:3000/auth/steam/return',
		apiKey:'0E85BB8884ECE2534C417A4F4A6A7CF8'
	},	
	steam:{
		search:'https://steamcommunity.com/market/search/render?norender=1',
		listings:'https://steamcommunity.com/market/listings/',
		img:'https://steamcommunity-a.akamaihd.net/economy/image/'
	},
	item: {
		DataUpdateFrequency:10000
	}
};