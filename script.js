document.getElementById('shorten-form').addEventListener('submit', async(event)=>{
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
try {
    const res = await fetch("/api/urls", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            originalURL: originalUrl,
            shortURL: shortCode
        })
    })
    const data = await res.json();
    if(res.status === 201){
        alert("Short URL saved successfully!");
        renderUrls(); //update list
        document.getElementById(('shorten-form').reset());
    }else {
        alert(data.error || "Something went wrong!");
    }

} catch (error) {
    console.error("Error:", error);
    alert("Server error, try again later.");
}      
});