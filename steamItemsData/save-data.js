const Item=require('../models/item-model');
const keys = require('../config/keys');
const https = require('https');
var fs = require('fs');
	
const marketUrl=( count=10, start=0 ,name='', url=keys.steam.search)=>{
	return url+'&query='+name+'&start='+start+'&count='+count;
};

setInterval(()=>
	httpsGet(marketUrl(10,0),(info)=>{
		try{
			//console.log(info);
			info=JSON.parse(info);
			let res=info.results;
			updateData(...getData(res));
		} catch(err){
			console.error(err);
		}
	}),600000);



function getData(res){
	let imgList=[];
	let nameList=[];
	let gameNameList=[];
	let urlList=[];
	for(let i=0;i<res.length;i++){
		imgList[i]=keys.steam.img+res[i].asset_description.icon_url+'/62fx62f'; //ссылки на изображение
		nameList[i]=res[i].hash_name; //название предмета
		gameNameList[i]=res[i].app_name; //название игры
		urlList[i]=keys.steam.listings  //ссылка на предмет
			+res[i].asset_description.appid
			+'/'
			+encodeURI(res[i].hash_name);
	}
	return [nameList,gameNameList,imgList,urlList];
}

function updateData(nameList,gameList,imgList,urlList){
	let counter=1;
	for(let i=0;i<nameList.length;i++){
		Item.findOne({itemName:nameList[i]})
			.then((curItem)=>{
				if(curItem){
					console.log('already has '+curItem.itemName);
				}
				else{
					setTimeout(()=>httpsGet(urlList[i],(data)=>{
						if(data.length<5000) {
							download(urlList[i],'./public/components/'+nameList[i]+'ban.html');
						}
						let nameId =data.match(/\ \d{5,}\ /);
						if(nameId) nameId+='';
						else{ 
							console.log('trashed data'+i,nameList[i]+' '+urlList[i]);
							//add alt regex later
							download(urlList[i],'./public/components/'+nameList[i]+'name.html');
							return;
						}
						nameId =nameId.slice(1,-1);
						console.log('nameId '+nameId);
						const item=new Item({
							_id:nameId,
							itemName:nameList[i],
							gameName:gameList[i],
							smallPhoto:imgList[i],
							url:urlList[i]
						});
						item.save((err, itemObj)=>{
							if (err) {
								console.error(err);
							}
							console.log('got new item '+itemObj.itemName);
						});
						/*setTimeout(()=>download(imgList[i],'./public/img/'+hashCode(nameList[i])+'.png',()=>{
							console.log('img done');
						}),1000);*/
					}),counter*1000+1000);
					counter++;
				}
			})
			.catch((err)=>console.error(err));
	}
}

function download(url, path, onFinish){
	https.get(url, (res)=>{
		res.on('error',(e)=>{
			console.error(e);
		});
		res.pipe(fs.createWriteStream(path)).on('finish',()=>{onFinish;});
	}).on('error',(e)=>{
		console.error(e);
	});
}

function httpsGet(url,callback){
	https.get(url, (res) => {
		// console.log('statusCode:', res.statusCode);
		// console.log('headers:', res.headers);
		let data='';
		res.on('data', (d) => {
			data+=d;
			//process.stdout.write(d);
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
}

const hashCode = function(s){
	return s.split('').reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a;},0);              
};