## Campus Lost & Found Portal

A simple web app that helps students report, search, and recover lost belongings around campus — no more spamming the group chat every time someone loses their ID card.

🔗 Live Site: lost-and-foundportal.vercel.app


## About the Project

We've all been there — you lose your earphones or ID card on campus, post in five different WhatsApp groups, and still never get it back. This portal is our attempt to fix that with one centralized place where students can report lost items, report found items, and browse through them to find a match.

This was built as our Open Source Development (OSD) college project, by a team of 5.


## Features


1. Report Lost Item — Fill a form with item name, category, location, date, and your contact info
2. Report Found Item — Same, but for items you've found and want to return
3. Browse & Search — Search by keyword, and filter items by "Lost" / "Found" / "All"
4. Category Shortcuts — Quick-browse by Bags, Electronics, ID Cards, Books, Keys, Wallets
5. Live Stats — Home page shows real-time counts of items lost, reported, and recovered
6. Latest Lost Items — Home page auto-updates with the most recently reported items
7. Responsive Design — Works on mobile, tablet, and desktop



## Tech Stack

Frontend: HTML5, CSS3, JavaScript
Database: Firebase Firestore (real-time updates)
Hosting: Vercel

No frameworks, no build tools — plain HTML/CSS/JS talking directly to Firebase, kept simple so the whole team could contribute easily.


## Project Structure

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
└── README.md


## How It Works


Report — Submit details of your lost or found item through a simple form
Search — Browse all reported items, filter by category or type
Match — Compare details to spot a possible match
Recover — Reach out using the contact info provided and get your item back


Every submission gets pushed straight to Firebase Firestore, and the home/browse pages listen for changes in real time — so as soon as someone reports an item, it shows up for everyone else instantly, no page refresh needed.


## Getting Started (Run Locally)

Want to run this on your own machine? Here's how:

Clone the repo

bash   git clone https://github.com/Anshratta/LOSTandFoundportal.git
   cd LOSTandFoundportal


Set up your own Firebase project

Go to Firebase Console and create a new project
Enable Firestore Database (start in test mode for development)
Create a Web App inside your Firebase project and copy your config



Add your Firebase config
Open firebase.js and replace the config object with your own:


js   const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT.firebasestorage.app",
       messagingSenderId: "YOUR_SENDER_ID",
       appId: "YOUR_APP_ID"
   };


Run it
Since it's plain HTML/CSS/JS, you just need a local server (opening index.html directly won't work because of ES module imports). Easiest way, if you have VS Code:

Install the Live Server extension
Right-click index.html → "Open with Live Server"


Or use Python:

bash  python -m http.server 5500

Then open http://localhost:5500 in your browser.


## Future Scope


1. User authentication (login/signup) so reports are tied to real accounts
2. Image upload for items instead of emoji icons
3. Notifications when a matching item is found
4. Admin panel to verify and close resolved cases
5. Multi-campus / multi-college support


## License

This project is licensed under the MIT License
Developed for educational purposes as part of a college Open Source Development course.


## Acknowledgements

Special thanks to:

- Firebase
- Vercel
- GitHub
- Open Source Community

for providing the tools and services used during the development of this project.
