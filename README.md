# URL Shortener

A simple and efficient URL shortener built using **HTML, CSS, JavaScript, and Node.js**. This project is currently in progress, with the frontend completed and backend functionality being implemented.

## Features
- Simple and responsive UI
- Clean and modern design using HTML and CSS
- JavaScript handles user input and server communication
- **Node.js backend** for handling POST and GET requests
- Stores URLs in a local `urls.json` file
- Duplicate short URL detection


## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (Basic implementation completed, more features coming)

## Installation
1. Clone the repository:
   ```sh
   git clone http://github.com/metherahul/URL_Shortener.git
   ```
2. Navigate to the project folder:
   ```sh
   cd URL_Shortener
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. ```sh
   node server.js
   ```
5. Open http://localhost:3000 in your browser. 


## 📁 Project Structure
URL_Shortener/
│
├── index.html        # Frontend HTML
├── style.css         # Styling
├── script.js         # Client-side JS logic
├── server.js         # Node.js backend
└── urls.json         # Stores submitted URLs locally


## 🧠 Current Backend Endpoints
- POST /:
   Accepts `originalURL` and `shortURL`, and stores them in `urls.json` if it's not a duplicate.


- GET /api/urls:
   Returns all saved URLs in JSON format.

## 📌 In Progress
- renderUrls() function to dynamically display shortened URLs on the page.
- Refactor code structure and improve modularity.


## 📈 Future Enhancements
- Add GET route to redirect short URLs directly.
- Automatically generate short URLs (random or hash-based).
- Add UI feedback for success and error messages.
- Replace local storage (urls.json) with MongoDB.
- Add timestamps and analytics (optional).


## 🤝 Contributing
Contributions are welcome!
Feel free to fork the repo, submit a pull request, or open an issue.

## License
This project is licensed under the **MIT License**.

---
Made with ❤️ by Rahul Gupta