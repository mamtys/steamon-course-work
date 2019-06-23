(function(){
	let data={
		getItems: function(number=10){ 
			return xhrRequest('get','/items?number='+number)
				.then((items)=>{
					this.curItems=items;
				});
		},
		getTracedItems: function(){
			return xhrRequest('get', '/trace/items',(curTracedItems)=>{
				this.curTracedItems=curTracedItems;
			});
		},
		getItemBlocks: function(part=10){
			this.itemBlocks='';
			for(let i=0;i<this.curItems.items.length && i< part;i++) 
				this.itemBlocks+=
		`<div class="item-block">
			<div class="item to-center">
				<div class="item-container">
					<a href=${this.curItems.items[i].url}>
						<img class="item-img" src=${this.curItems.items[i].smallPhoto}>
					</a>
					<a class="item-name-block" href=${this.curItems.items[i].url}>
						<div class="item-name">${this.curItems.items[i].itemName}</div>
						<div class="item-game-name">${this.curItems.items[i].gameName}</div>
					</a>
					<div class="some" id="show-trace">
						<img class="double-down-svg" src="./img/down.svg" alt="">
					</div>
				</div>
			</div>
			<div class="trace">
				<div class="to-center">
					<div class="trace-container">
						${ (this.curItems.sets) ?
							(this.curItems.sets.telegram) ?
								`<div class="trace-wraper">
									<span class="trace-title">Your lot bet</span>
									<input type="text" name="item-price" class="inp-price">
									<span class="trace-curancy">${this.curItems.sets.currency}</span>
								</div>
								<button class="trace-btn" code=${this.curItems.items[i]._id}>Trace</button>`
							: '<span>Please fill your <a href="/profile">settings</a></span>'
						
						: '<span>Please login first</span>'
						}
					</div>
				</div>
			</div>
		</div>`;
		},
		addItemEvents: function(){
			let showTrace=document.getElementsByClassName('double-down-svg');
			[...showTrace].forEach(el =>
				el.addEventListener('click',()=>{
					let traceDiv=el.parentElement.parentElement.parentElement.nextElementSibling;
					if(traceDiv.style.display=='flex') {
						traceDiv.style.display='none';
                  
						el.src='../img/down.svg';
					}
					else {
						traceDiv.style.display='flex';
						el.src='../img/eye.svg';
					}
				}));
			let traceBtn=document.getElementsByClassName('trace-btn');
			let value=document.getElementsByClassName('inp-price');
			[...value].forEach((el)=>{
				el.addEventListener('input',(e)=>{
					let txt=e.target.value;
					let len=e.target.value.length;
					if(len>5)
						e.target.value=txt.slice(0,5-len);
				});
			});
			[...traceBtn].forEach((el)=>{
				el.addEventListener('click',(e)=>{
					let id=e.target.attributes.code.value;
					let inp=e.target.previousElementSibling.lastElementChild.previousElementSibling;
					if(isNaN(inp.value)){
						alert('input not valid');
						return;
					}
					let params = 'value=' + encodeURIComponent(inp.value)+'&id='
                    + encodeURIComponent(id);
					xhrRequest('post','/trace?'+params);
				});
			});
		},
		addTracedItemEvents: function(){
			let rm=document.getElementsByClassName('trace-remove');
			[...rm].forEach(el =>
				el.addEventListener('click',(e)=>{
					let rmFromDOM=el.parentElement.parentElement.parentElement.parentElement;
					xhrRequest('post','trace/remove?id='+e.target.attributes.code.value)
						.then(()=>{
							rmFromDOM.remove();
						})
						.catch((err)=>{
							console.log(err);
						});
				}));
		},
		getTracedItemBlocks: function(part=10){
			this.tracedItemBlocks='';
			for(let i=0;i<this.curTracedItems.items.length && i< part;i++) 
				this.tracedItemBlocks+=
		`<div class="item-block">
			<div class="item to-center">
				<div class="item-container">
					<a href=${this.curTracedItems.items[i].item.url}>
						<img class="item-img" src=${this.curTracedItems.items[i].item.smallPhoto}>
					</a>
					<a class="item-name-block" href=${this.curTracedItems.items[i].item.url}>
						<div class="item-name">${this.curTracedItems.items[i].item.itemName}</div>
						<div class="item-game-name">${this.curTracedItems.items[i].item.gameName}</div>
					</a>
					<div class="some">
						<img class="trace-remove" code=${this.curTracedItems.items[i]._id} src="./img/delete.svg" alt="">
					</div>
				</div>
			</div>
		</div>`;
		},
		pushItemsToDom: function(elem){
			if(elem)
				elem.innerHTML=this.itemBlocks;
			else 
				document.getElementById('item-list').innerHTML=this.itemBlocks;
		},
		pushTracedItemsToDom: function(elem){
			if(elem)
				elem.innerHTML=this.tracedItemBlocks;
			else 
				document.getElementById('traced-item-list').innerHTML=this.tracedItemBlocks;
		}
	};
	let itemList=document.getElementById('item-list');
	document.addEventListener('DOMContentLoaded',()=>{		
		data.getItems(20)
			.then(()=>{
				data.getItemBlocks();
				data.pushItemsToDom(itemList);
				data.addItemEvents();
			});
		data.getTracedItems(20)
			.then(()=>{
				data.getTracedItemBlocks();
				data.pushTracedItemsToDom(itemList.nextElementSibling);
				data.addTracedItemEvents();
			});	
	});
	
	let displayItems=document.getElementById('display-items');
	[...displayItems.children].forEach(el=>
		el.addEventListener('click',()=>{
			el.style.backgroundColor='rgb(97, 143, 97)';
			el.style.color='rgb(230, 228, 228)';
			let next=el.nextElementSibling;
            
			let prev=el.previousElementSibling;
			if(next){
				next.style.backgroundColor='rgb(203, 204, 206)';
				next.style.color='rgb(56, 63, 57)';
				itemList.style.display='block';
				itemList.nextElementSibling.style.display='none';
			}
			else {
				prev.style.backgroundColor='rgb(203, 204, 206)';
				prev.style.color='rgb(56, 63, 57)';
				itemList.style.display='none';
				itemList.nextElementSibling.style.display='block';
			}

		}));
        
	function xhrRequest(method, url,callback) {
		return new Promise(function (resolve, reject) {
			let xhr= new XMLHttpRequest();
			xhr.responseType = 'json';
			xhr.open(method, url,true);
			xhr.onload= ()=>{
				if (xhr.status == 200) {
					resolve(xhr.response);
					if(callback) callback(xhr.response);
				} else {
					reject({
						status: xhr.status,
						statusText: xhr.statusText
					});
				}
			};
			xhr.onerror= ()=>{
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			};
			xhr.send();
		});
	}
})();

