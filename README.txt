PATTERNME — RESPONSIVE HABIT TRACKER

GET STARTED
1. Extract the ZIP folder.
2. Open login.html in a modern browser. VS Code Live Server is recommended.
3. Select “Create an account” and register. The demo signs you in and opens index.html.
4. Add habits from “My habits”, record daily check-ins, and explore history and insights.
5. To receive reminder notifications, enable them in the app and allow browser permission.

PROJECT STRUCTURE
- login.html, register.html, index.html, habits.html, checkin.html, history.html, insights.html
- css/base.css plus a dedicated CSS file for each page
- js/app.js plus page-specific JavaScript files

FEATURES
- Responsive layout with Bootstrap 5.3
- Registration validation: name, email, password strength, confirm password, duplicate email check
- Login and per-account demo data
- Add/delete habits and track daily completion
- Daily check-ins, editable history, CSV export and insights
- Browser localStorage persistence, separated by signed-in demo account
- Browser reminders while the site is open

IMPORTANT LIMITATIONS
This is a front-end college project, not production authentication. Passwords are stored in plain text in localStorage. Do not use a real password or sensitive personal data. Data is specific to this browser/device and can be removed by clearing browser storage. For real users, implement server-side authentication and securely hashed passwords. Browser notifications require permission and reminders are checked only while the website is open. Bootstrap and Google Fonts may require an internet connection.

MAIN PAGE
index.html is the PatternMe overview/dashboard page. Internal links and login/register redirects use index.html.
