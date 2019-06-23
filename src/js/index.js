
let showTrace=document.getElementsByClassName("some");
[...showTrace].map(el =>
    el.addEventListener("click",(e)=>{
    let traceDiv=e.target.parentElement.parentElement.nextElementSibling;
    if(traceDiv.style.display=="flex") traceDiv.style.display="none";
    else traceDiv.style.display="flex"
}))
