JUSTINMOVIE STORE
=================

1. IMPORTANT SECURITY
The MongoDB password you pasted in chat is now exposed. Change/rotate that database user's password in MongoDB Atlas before using this project.

2. FOLDER STRUCTURE
- public/index.html
- public/style.css
- public/app.js
- server.js
- package.json
- .env.example

3. SETUP
Create a folder, put server.js/package.json/.env there and create a "public" folder containing index.html, style.css and app.js.

Run:
npm install
Create .env:
MONGODB_URI=your_new_mongodb_connection_string
npm start

Then open:
http://localhost:3000

4. ADD VIDEOS
The sample Catbox URL is already shown as a demo. For real videos, use your own legally hosted videos.
Admin dashboard/API still needs proper admin login before production. A simple admin UI should be added only after authentication is implemented.

5. PAYMENT
The site currently displays the WhatsApp contact button and requires a video password before playback. It does not automatically verify payments. The owner can confirm payment and provide the password.

6. 18+ CONTENT
Do not use this template to provide pornography or sexual content to minors. If the service will host adult content, implement strong age-gating and legal compliance appropriate to your jurisdiction and hosting provider.

7. DATABASE
Users and videos are stored in MongoDB through Mongoose. Passwords are hashed with bcrypt; plaintext passwords are not stored.
