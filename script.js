document.querySelectorAll('.faq button').forEach(btn=>{
 btn.addEventListener('click',()=>{
   const a=btn.nextElementSibling;
   a.style.display=a.style.display==='block'?'none':'block';
 });
});
