(function(){
	let showTrace=document.getElementsByClassName('some');
	if(!showTrace) return;
	[...showTrace].forEach(el =>
		el.addEventListener('click',(e)=>{
			let traceDiv=e.target.parentElement.parentElement.nextElementSibling;
			if(traceDiv.style.display=='flex') traceDiv.style.display='none';
			else traceDiv.style.display='flex';
		}),false);
})()

(function(){
	let setButn=document.getElementById('setts-btn') || null;
	if(isNull(setButn)) return;
	let form=document.getElementById('set');
	setButn.addEventListener('click',()=>{
		console.log(form);
		form.submit();
	});
})();