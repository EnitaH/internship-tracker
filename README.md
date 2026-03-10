# Internship Tracker

A **full-stack web** application that helps students track their internship applications in one place.
Users can add, manage, filter, and export their applications while monitoring deadlines and application progress.

This project demonstrates practical full-stack development using Node.js, Express, SQLite, and vanilla JavaScript.

---


# Features
## Application Management
* Add internship applications
* Delete applications
* Edit existing applications
* Cancel edit mode
## Filtering & Search
* Filter by application status:
  * Applied
  * Interview
  * Offer
  * Rejected
* Search by company name or role
## Sorting
* Newest first
* Oldest first
* Company A → Z
## Dashboard Statistics
Displays live statistics for:
* Total applications
* Applied
* Interview
* Offers
* Rejected
## Deadlines & Alerts
Each internship can include an application deadline.
The system automatically:

* Highlights overdue applications

* Shows **Due Soon** warnings for deadlines within 7 days

## CSV Export
Users can export their applications to a CSV file for external tracking or backup.
Export respects:
* search filters
* status filters
* sorting

## User Experience Improvements
* Toast notifications for:
  * Added internship
  * Updated internship
  * Deleted internship

* Form validation with friendly error messages
* Disabled export button when there are no applications
* Clean responsive UI

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
### Update internship

```
PUT /api/internships/:id
```
### Delete internship

```
DELETE /api/internships/:id
```

## Future Improvements
Authentication / user accounts
* Cloud database
* Application analytics
* Email deadline reminders
* Dark mode
---

## Example Use Case
A student applying to multiple companies can:
1. Add each internship application
2. Track application status
3. Monitor approaching deadlines
4. Filter applications by status
5. Export data for external analysis
   
## Author

**Enita Hashemi**  
BSc (Hons) Computer Science  
Robert Gordon University

---

## License

This project is for educational and portfolio purposes.
