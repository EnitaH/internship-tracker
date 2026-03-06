# Internship Tracker

A **full-stack web application** for managing and tracking internship and placement applications.
The application allows users to add, view, and organise internship applications with details such as company, role, status, location, and notes.

This project demonstrates a complete full-stack workflow including a REST API backend, database integration, and a dynamic frontend interface.

---

## Features

* Add internship applications
* Track application status (Applied, Interview, Offer, Rejected)
* Store applications in a SQLite database
* Display applications dynamically in the browser
* REST API built with Express
* Responsive card-based UI
* Status badges with colour indicators

---

## Tech Stack

**Backend**

* Node.js
* Express.js
* SQLite

**Frontend**

* HTML
* CSS
* Vanilla JavaScript (Fetch API)

**Tools**

* Git
* GitHub
* npm

---

## Project Structure

```
internship-tracker
│
├── public
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── db
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## Installation

Clone the repository:

```
git clone https://github.com/EnitaH/internship-tracker.git
```

Navigate into the project folder:

```
cd internship-tracker
```

Install dependencies:

```
npm install
```

Start the server:

```
node server.js
```

---

## Running the Application

After starting the server, open your browser and go to:

```
http://localhost:3000
```

You can now add and manage internship applications.

---

## API Endpoints

### Get all internships

```
GET /api/internships
```

Returns all stored internship applications.

### Add a new internship

```
POST /api/internships
```

Example request body:

```
{
  "company": "Aize",
  "role": "Software Engineer",
  "status": "Applied",
  "location": "Aberdeen",
  "notes": "Applied via company website",
  "date_applied": "2026-03-04"
}
```

---

## Future Improvements

* Edit internship entries
* Delete applications
* Search and filtering
* Dashboard statistics (applications, interviews, offers)
* User authentication
* Deployment to a cloud platform

---

## Author

**Enita Hashemi**  
BSc (Hons) Computer Science  
Robert Gordon University

---

## License

This project is for educational and portfolio purposes.
