import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer(async(req, res) => {
  if (req.method==="GET"){
  try{
  let filePath = req.url === "/" ? "index.html" : req.url;
  filePath = path.join(__dirname, filePath);

  // Detect content type
  let ext = path.extname(filePath);
  let contentType = "text/html";
  if (ext === ".css") contentType = "text/css";
  if (ext === ".js") contentType = "text/javascript";

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

    // Step 1: readFile
    let urlLIST = [];
    try {
      const data = await fs.readFile("urls.json", "utf-8");
      urlLIST = JSON.parse(data);
    } catch (err) {
      urlLIST = [];
    }

    // Step 2: push new URL
    urlLIST.push({ originalURL, shortURL });

    // Step 3: writeFile
    try {
      await fs.writeFile("urls.json", JSON.stringify(urlLIST, null, 2));
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


