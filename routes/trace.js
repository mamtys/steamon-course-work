const router = require('express').Router();
const Trace = require('../models/trace-model');
const Item = require('../models/item-model');



router.get('/items', (req, res) => { 
	getTracedItems(req.user.id, items=>{
		if(items)
			res.send({items: items.lots});
		else 
			res.status(404).send('Not found');
	});
});

router.post('/', (req, res) => { 
	Item.findById(req.query.id)
		.then((item)=>{
			let queryParams={_id:req.query.id, value: req.query.value, item};
			if(item) updateTrace(
				req.user.id,
				req.user.sets.telegram,
				queryParams)
				.then((success)=>{
					if(success)
						res.send('OK');
					else
						res.status(500).send('Internal Server Error');
				});
			else res.status(404).send('Not found');
		})
		.catch((err)=>{
			console.error(err);
			res.status(500).send('Internal Server Error');
		});
});
router.post('/remove', (req, res) => { 
	Trace.findById(req.user.id)
		.then((el)=>{
			if(el){
				el.lots.remove({_id:req.query.id});
				el.save()
					.then(()=>{
						res.send('OK');
					});
			}
			else res.status(404).end();
		})
		.catch(()=>res.status(500).end());
});

function updateTrace(id,tel,{_id,value,item}){
	let bool=true;
	return Trace.findById(id)
		.then((curTrace)=>{
			if(curTrace) {
				let duplicate=curTrace.lots.find(el=>el._id == _id);
				if(duplicate){
					console.log('update',duplicate);
					duplicate.value=value;
				} else
					curTrace.lots.push({_id,value,item});

				curTrace.save().catch((err)=>{
					console.error(err);
					bool=false;	 
				});
			} else {
				const tr=new Trace({
					_id: id,
					telegram: tel,
					lots:{_id, value, item}
				});
				tr.save().catch((err)=>{
					console.error(err);
					bool=false;	 
				});
			}
			return bool;
		})
		.catch((err)=>{
			console.error(err);
			bool=false;	 
		});
	
}

function getTracedItems(id,callback){
	Trace.findById(id)
		.then((items)=>{
			if(callback) callback(items);
		})
		.catch((err)=>{
			console.log(err);
		});
}

module.exports = router;