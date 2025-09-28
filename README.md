<!-- <p align="center">
  <img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/chatify-logo.png" alt="Chatify Logo" width="150"/>
</p> -->
<h1 align="center">Chatify 🚀</h1>

<p align="center">
  A modern, mobile-first, full-stack chat application built with React Native and the MERN stack.
  <!-- <br /> -->
  <!-- <a href="#-key-features"><strong>Explore the features »</strong></a> -->
  <!-- <br />
  <br /> -->
  <!-- <a href="#-known-limitations">Report Bug</a> -->
  ·
  <!-- <a href="#-future-enhancements">Request Feature</a> -->
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
	<img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" alt="Socket.IO">
  <img src="https://img.shields.io/badge/NativeWind-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind">
</p>

---

## 📖 About The Project

Chatify is a real-time, full-stack messaging application designed for seamless communication. Built from the ground up with a mobile-first approach using React Native, it provides a robust and intuitive user experience. The project leverages a powerful backend built with Node.js, Express, and MongoDB to handle user authentication, profile management, and chat functionalities.

This project is nearly complete and serves as a comprehensive example of building a modern, feature-rich mobile application with a popular and powerful tech stack.

---

## 📸 Application Screenshots

*(Here you can add your screenshots. Replace the placeholder links with links to your actual images in the repository, perhaps in an `assets` folder.)*

<table>
  <tr>
    <td align="center"><strong>Login / Signup</strong></td>
    <td align="center"><strong>OTP Verification</strong></td>
    <td align="center"><strong>Chat List (Tabs)</strong></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/screenshot1.png" alt="Login Screen" width="250"/></td>
    <td><img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/screenshot2.png" alt="OTP Screen" width="250"/></td>
    <td><img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/screenshot3.png" alt="Chat List" width="250"/></td>
  </tr>
  <tr>
    <td align="center"><strong>One-to-One Chat</strong></td>
    <td align="center"><strong>Group Chat</strong></td>
    <td align="center"><strong>Profile Management</strong></td>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/screenshot4.png" alt="Direct Message" width="250"/></td>
    <td><img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/screenshot5.png" alt="Group Chat" width="250"/></td>
    <td><img src="https://raw.githubusercontent.com/user-name/repo-name/main/assets/screenshot6.png" alt="Profile" width="250"/></td>
  </tr>
</table>


---

## ✨ Key Features

Chatify comes packed with essential features for a modern chat application:

* **⚡ Real-time Messaging:** Instant one-to-one and group messaging powered by **WebSockets** (Socket.IO).
* **🔐 User Authentication:**
    * Secure Login & Signup using Email and Password.
    * Email OTP Verification for new user onboarding via Nodemailer.
* **👤 Profile Management:**
    * Users can update their display name.
    * Ability to upload and change profile pictures, hosted on Cloudinary.
* **💬 Direct Messaging:**
    * Real-time one-to-one private conversations.
* **👨‍👩‍👧‍👦 Group Chats:**
    * Create new groups with custom names and group images.
    * Add multiple users to a group upon creation.
* **📱 Clean & Organized UI:**
    * Intuitive conversation pages with separate tabs for Direct Messages and Group Chats.
    * Built with NativeWind for a clean, consistent, and responsive design.

---

## 🛠️ Tech Stack

This project is built with a modern and scalable technology stack.

* **Frontend:**
    * [React Native](https://reactnative.dev/)
    * [TypeScript](https://www.typescriptlang.org/)
    * [NativeWind](https://www.nativewind.dev/)
* **Backend:**
    * [Node.js](https://nodejs.org/)
    * [Express.js](https://expressjs.com/)
    * [Socket.IO](https://socket.io/) (for WebSocket communication)
    * [REST APIs](https://restfulapi.net/)
* **Database:**
    * [MongoDB](https://www.mongodb.com/) (for user and chat data storage)
    * [Mongoose](https://mongoosejs.com/) (as ODM)
* **Services & Authentication:**
    * [JSON Web Tokens (JWT)](https://jwt.io/) for session management.
    * [Cloudinary](https://cloudinary.com/) for cloud-based image storage.
    * [Nodemailer](https://nodemailer.com/) for sending email OTPs.

---

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
* Node.js (LTS version recommended)
* npm or yarn
* MongoDB instance (local or cloud-based like MongoDB Atlas)
* An active Cloudinary account
* An email service provider (like Gmail) for Nodemailer

### Installation

1.  **Clone the repository**
    ```sh
    git clone [https://github.com/your-username/chatify.git](https://github.com/your-username/chatify.git)
    cd chatify
    ```

2.  **Install Backend Dependencies**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```sh
    cd frontend
    npm install
    ```

4.  **Set up Environment Variables**

    Create a `.env` file in the `backend` directory and add the following variables:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key

    # Nodemailer (using Gmail as an example)
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_gmail_app_password
    ```

### Running the Application

1.  **Start the Backend Server**
    ```sh
    cd backend
    npm run dev
    ```

2.  **Start the Frontend Application**
    ```sh
    cd frontend
    # For Android
    npm run android
    # For iOS
    npm run ios
    ```

---

## 🗺️ Roadmap & Future Enhancements

While Chatify is feature-rich, there's always room for improvement. Here are some planned features:

* **✍️ Typing Indicators:** Show when a user is actively typing in a conversation.
* **✅ Message Status:** Add message delivery and read receipts (single tick, double tick, blue tick).
* **🎥 Expanded Media:** Add support for sending video clips and voice messages.
* **🔔 Push Notifications:** Integrate a service like Firebase Cloud Messaging (FCM) for push notifications.
* **📞 Audio/Video Calls:** Introduce WebRTC for real-time voice and video communication.
* **🔒 End-to-End Encryption:** Enhance security with E2EE for all conversations.

---

## ⚠️ Known Limitations

* Media sharing is limited to images; video and audio messages are not yet supported.
* No end-to-end encryption is implemented yet.
* Advanced real-time features like typing indicators and read receipts are still pending.

---

## 👨‍💻 Author
**Vansh Chauhan** 
<p><a href="https://www.linkedin.com/in/vanshchauhan0/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="https://vansh-chauhan.netlify.app/" target="_blank">
    <img src="https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=briefcase&logoColor=white" alt="Portfolio"/>
  </a></p>
