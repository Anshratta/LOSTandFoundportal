#  Campus Lost & Found Portal

A responsive web application that helps students report, browse, search, and recover lost and found items within a university campus.

 Live Demo: [lost-and-foundportal.vercel.app](https://lost-and-foundportal.vercel.app/)

---

##  Problem Statement

Every campus deals with the same recurring issue — students lose items like ID cards, bags, or wallets and have no reliable way to report or recover them, other than posting in scattered WhatsApp groups. The Campus Lost & Found Portal solves this by giving students one centralized, real-time platform to report and search for lost or found items.

---

##  Project Overview

The Campus Lost & Found Portal provides a centralized platform where students can report lost belongings, submit found items, and browse existing reports. The project simplifies the recovery process by maintaining a live cloud database of reported items using Firebase Firestore — so a report submitted by one student is instantly visible to everyone else, no refresh needed.

---

## Features

-  Report Lost Item — Submit item name, category, location, date, and contact details
-  Report Found Item — Report items found around campus so owners can claim them
-  Browse & Search — Search by keyword and filter by Lost / Found / All
-  Category-wise Browsing — Quick access via Bags, Electronics, ID Cards, Books, Keys, Wallets
-  Live Statistics — Real-time count of items lost, reported, and recovered on the home page
-  Latest Lost Items Feed — Automatically updates as new reports come in
-  Firebase Firestore Integration — Real-time cloud database, no manual refresh needed
-  Fully Responsive Design — Works smoothly across mobile, tablet, and desktop
-  Fast Deployment — Hosted and live via Vercel

---

##  Tech Stack

- Frontend: HTML5, CSS3, JavaScript
- Database: Firebase Firestore 
- Hosting: Vercel
- Version Control: Git & GitHub

No frameworks, no build tools — plain HTML/CSS/JS talking directly to Firebase, kept simple so the whole team could contribute easily.

---

##  Firebase Integration

The project uses Firebase Firestore as its cloud database. Firebase handles:

- Storing lost item reports
- Storing found item reports
- Retrieving reported items in real time
- Updating item information (status, details)
- Providing real-time cloud storage across all connected users

---

## How It Works

1. Report — Submit details of your lost or found item through a simple form
2. Search — Browse all reported items, filter by category or type
3. Match — Compare details to spot a possible match
4. Recover — Reach out using the contact info provided and get your item back

Every submission gets pushed straight to Firebase Firestore, and the home/browse pages listen for changes in real time — so as soon as someone reports an item, it shows up for everyone else instantly.

---

## Project Structure

```
LOSTandFoundportal/
├── index.html              # Home page — stats, categories, latest items
├── style.css                # All styling for the site
├── script.js                 # Handles home page + browse page logic
├── firebase.js                # Firebase config & Firestore initialization
├── pages/
│   ├── browse.html            # Browse/search/filter all items
│   ├── report-lost.html        # Form to report a lost item
│   ├── report-found.html        # Form to report a found item
│   └── about.html                # About page
├── README.md
├── CONTRIBUTING.md
├── CHANGELOG.md
└── LICENSE
```

---

## Getting Started (Run Locally)

Want to run this on your own machine? Here's how:

1. **Clone the repo**
   ```bash
   git clone https://github.com/Anshratta/LOSTandFoundportal.git
   cd LOSTandFoundportal
   ```

2. Set up your own Firebase project
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project
   - Enable Firestore Database (start in test mode for development)
   - Create a Web App inside your Firebase project and copy your config

3. Add your Firebase config

   Open `firebase.js` and replace the config object with your own:
   ```js
   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.firebasestorage.app",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };
   ```

4. Run it

   Since it's plain HTML/CSS/JS, you just need a local server (opening `index.html` directly won't work because of ES module imports).

   - VS Code: Install the *Live Server* extension → right-click `index.html` → "Open with Live Server"
   - Or Python:
     ```bash
     python -m http.server 5500
     ```
     Then open `http://localhost:5500` in your browser.

---

## Team Members

Built by a team of 5 students as part of our OSD coursework:

Ansh Ratta – Homepage UI
Arjav Maheshwari – Report Forms
Bhavishya Acholiya – Browse Page
Akshay Tondon – Firebase Integration
Ananya Singh – Documentation & Deployment

---

## Deployment
The application is deployed using Vercel, allowing users to access it directly through a web browser without any local installation.

---

##  Future Enhancements

-  User Authentication (login/signup tied to real accounts)
-  Admin Dashboard to verify and manage reports
-  Image Upload Support for lost/found items
-  Email Notifications for potential matches
-  AI-Based Item Matching
-  QR Code Verification for item handovers
-  Item Claim Request System
-  Dark Mode
-  Multi-campus / multi-college support

---

## License

This project is licensed under the MIT License.
Developed for academic purposes as part of a college Open Source Development (OSD) course.

---

##  Acknowledgements

Special thanks to:

- [Firebase](https://firebase.google.com/) — for real-time database services
- [Vercel](https://vercel.com/) — for fast, free deployment
- [GitHub](https://github.com/) — for version control and collaboration
- The Open Source Community — for the tools and resources that made this project possible

---
