document.getElementById('shorten-form').addEventListener('submit', (event)=>{
    event.preventDefault();

//  gettting user input   
let originalUrl = document.getElementById('original-url').value;
let customUrl = document.getElementById('custom-url').value;
let shortenUrl = document.getElementById("shorten-urls"); 
let shortCode;
if(customUrl){
    shortCode=customUrl
}else{
    shortCode = "short.ly/"+Math.random().toString(36).slice(2, 7)
}   
console.log(originalUrl, shortCode);       
});