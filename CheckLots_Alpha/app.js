/* eslint-disable no-console */



const express = require('express');
const path = require('path');
const https = require('https');

const routes = require('./routes/index');
const users = require('./routes/user');
const keys = require('./keys/keys');
const Item=require('./models/item-model');
const User=require('./models/user-model');
const Trace=require('./models/trace-model');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';


// app.use(favicon(__dirname + '/public/img/favicon.ico'));

app.use('/', routes);
app.use('/users', users);

const mongoose = require('mongoose');
mongoose.connect(keys.mongodb.dbURI, { useNewUrlParser: true , useCreateIndex: true })
	.then(()=>console.log('Mongo connected'))
	.catch(()=>console.log('Mongo connection err'));

let Url={
	counter:0,
	url:keys.url,
	count:function(){
		this.counter++;	
		console.log(this.counter);
	},
	init:function(currency,nameid){
		this.count();
		this.url=keys.url+'&currency='+currency+'&item_nameid='+nameid;
	},
	getData:function(callback){
		https.get(this.url, (res) => {
		// console.log('statusCode:', res.statusCode);
		//console.log('headers:', res.headers);
			let data='';
			res.on('data', (d) => {
				data+=d;
			});
			res.on('error',(e)=>{
				console.error(e);
			});
			res.on('end',()=>{
				if (res.complete)
					callback(data);
				else console.error('The connection was terminated while the message was still being sent');
			});
		}).on('error', (e) => {
			console.error(e);
		});
	},
	getItems:function(maxNumb,callback){
		Item.find({}).limit(maxNumb).exec((err,items)=>{
			if(err) console.error(err);
			else callback(items);
		});}
};

Url.getItems(10,(items)=>{
	let intervalObj = setTimeout(function run(){
		items.forEach((e)=>{
			Url.init(5,e._id);
			Url.getData((info)=>{
				try{
					let data=JSON.parse(info);
					let highestBuy=data.highest_buy_order;
					let lowestSell=data.lowest_sell_order;//todo

					e.highestBuyOrder=highestBuy;
					e.save()
						.catch((err)=>{console.error(err);});
				}catch(er){
					console.error(er);
					console.error(info);
					//clearTimeout(intervalObj);
					intervalObj=null;
				}
			});
		});
		if(intervalObj===null)intervalObj=setTimeout(run,300000);
		else intervalObj=setTimeout(run,10000);
	}, 10000);
});

let timeObj = setTimeout(function run(){
	Trace.find({}).then((traces)=>{
		traces.forEach((trace)=>{
			var counter=0;
			var len=trace.lots.length;
			trace.lots.forEach((lot)=>{
				Item.findById(lot._id)
					.then((it)=>{
						if(parseInt(it.highestBuyOrder)/100-parseInt(lot.value)>=0){
							let message='You was outbitted\n'
								+'item: '+it.itemName+'\n'
								+'your bet: ' + lot.value+'\n'
								+'current bet: ' + it.highestBuyOrder+'\n'
								+'url: '+it.url+'\n';
							message=encodeURIComponent(message);
							let path=keys.telegram.path+'?chat_id='
								+trace.telegram+'&text='+message;
							httpPost(keys.telegram.host,keys.telegram.path+'?chat_id='+trace.telegram+'&text='
								+message,(data)=>{
								console.log(data);
							});
							//console.log(it,"more")
							trace.lots.remove(lot._id);
							counter++;
							if(counter === len) {
								trace.save().catch((err)=>console.error(err));
							}
						}
					})
					.catch((err)=>console.error(err));
			});
		});
	}).catch((err)=>console.error(err));
	timeObj=setTimeout(run,10000);
},10000);

function httpPost(host,path,callback){
	
	const options = {
	  hostname: host,
	  port: 443,
	  path: path,
	  method: 'POST'
	};

	const req = https.request(options, (res) => {
	  //console.log('statusCode:', res.statusCode);
	 // console.log('headers:', res.headers);
		let data='';
		res.on('data', (d) => {
			data+=d;
		});
		res.on('end',()=>{
			if(callback) callback(data);
		});
	});

	req.on('error', (e) => {
	  console.error(e);
	});
	req.end();
}
/// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});


module.exports = app;
