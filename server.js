import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async(req, res) => {
  if (req.method==="GET"){
     // Handle /api/urls route first
  if (req.url === "/api/urls") {
    try {
      const data = await fs.readFile("urls.json", "utf-8");
      const urlList = JSON.parse(data);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(urlList));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Unable to read saved URLs" }));
    }
    return;
  } 
  try{
  let filePath = req.url === "/" ? "index.html" : req.url;
  filePath = path.join(__dirname, filePath);

  // Detect content type
const ext = path.extname(filePath);
const contentType = mimeTypes[ext] || "text/plain";


  const data =await fs.readFile(filePath);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data); 
  }catch(error){   
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("File not found");
    }
}else if(req.method === "POST"){
  let body = "";
  req.on("data", (chunk)=>{
    body = body + chunk;
  }
);
req.on("end", async () => {
  try {
    const { originalURL, shortURL } = JSON.parse(body);

    //  readFile
    let savedUrls = [];
    try {
      const data = await fs.readFile("urls.json", "utf-8");
      savedUrls = JSON.parse(data);
    } catch (err) {
      savedUrls = [];
    }
    
    //checking for duplicate data
    const alreadyExists = savedUrls.some(url => url.shortURL === shortURL);
    if (alreadyExists){
      res.writeHead(409, {"Content-Type": "application/json"});
      res.end(JSON.stringify({error: "shortURL already exists"}));
      return
    }

    // push new URL
    savedUrls.push({ originalURL, shortURL });

    //  writeFile
    try {
      await fs.writeFile("urls.json", JSON.stringify(savedUrls, null, 2));
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Data saved successfully" }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to save data" }));
    }

  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Invalid JSON or bad request" }));
  }
});
}
}
);

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});