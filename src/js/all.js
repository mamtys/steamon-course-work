let showTrace=document.getElementsByClassName("some");[...showTrace].map(e=>e.addEventListener("click",e=>{let t=e.target.parentElement.parentElement.nextElementSibling;"flex"==t.style.display?t.style.display="none":t.style.display="flex"}));let setButn=document.getElementById("setts-btn"),form=document.getElementById("set");setButn.addEventListener("click",()=>{console.log(form),form.submit()});