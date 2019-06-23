(function(){
	let setButn=document.getElementById('setts-btn');
	if(!setButn) return;
	let form=document.getElementById('set');
	setButn.addEventListener('click',()=>{
		console.log(form);
		form.submit();
	});
})();