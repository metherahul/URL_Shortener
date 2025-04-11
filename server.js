import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";


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

// MongoDB setup
const mongoURL = "mongodb://localhost:27017"; // Default MongoDB URL
const client = new MongoClient(mongoURL);

let collection;
async function connectToDB() {
  try {
    await client.connect();
    const db = client.db("urlShortener"); // Database name
    collection = db.collection("urls");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
async function startServer() {
  await connectToDB();
const server = http.createServer(async(req, res) => {
  if (req.method==="GET"){
     // Handle API route
  if (req.url === "/api/urls") {
    try {
     const urlList = await collection.find({}).toArray();
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
    const { originalUrl,customUrl} = JSON.parse(body);

    if (!originalUrl) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing originalUrl" }));
      return;
    }
    // Generate customUrl if not provided
    let shortCode =customUrl || "custom.ly/" + Math.random().toString(36).slice(2, 7);
    
    //checking for duplicate data
    const alreadyExists = await collection.findOne({customUrl: shortCode });
    if (alreadyExists){
      res.writeHead(409, {"Content-Type": "application/json"});
      res.end(JSON.stringify({error: "customUrl already exists"}));
      return
    }

// Save to MongoDB
await collection.insertOne({ originalUrl,customUrl: shortCode });
res.writeHead(201, { "Content-Type": "application/json" });
res.end(JSON.stringify({ message: "Data saved to MongoDB" }));

} catch (error) {
res.writeHead(500, { "Content-Type": "application/json" });
res.end(JSON.stringify({ error: "Failed to save to database" }));
}
});
}
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
}
startServer();