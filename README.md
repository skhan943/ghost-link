# GhostLink 👻
Exploring Encryption, Privacy, and Secure Messaging

![image](https://github.com/skhan943/ghost-link/assets/72502583/243dfa69-adfc-4661-b2ff-2a50eab33721)

### Background
In today's interconnected world, the need for secure and private communication is more pressing than ever. Existing communication methods often lack sufficient safeguards, leaving them vulnerable to malicious actors. With GhostLink, my objective was to explore the world of cryptography, work with new tools like Vite and PostgreSQL, and try my hand at building a real-time messaging app. This project allowed me to dive into the practicalities of secure communication while gaining hands-on experience with some new technologies.

### Design
GhostLink aims to maximize privacy and security in a couple of different ways. Let's say Alice and Bob are two privacy-conscious friends who want to message each other. They decide to use an exciting new service called GhostLink.
1. Alice and Bob sign up. During the registration process, they must enter a username (used to identify users) and a password (with strict requirements).
2. A public-private key pair is derived from their passwords.
3. Their public keys are stored on the server.

![Untitled drawing](https://github.com/skhan943/ghost-link/assets/72502583/d7a31fa1-8b47-446a-9860-befdd8ab90bf)

When Alice messages Bob, here is what goes on in the background:
1. Alice will send a request to the server for Bob's public key using his username. If the server finds Bob, it will respond to Alice's request.
2. Alice's device (client) will encrypt her message to Bob using Bob's public key.
3. Alice sends her encrypted message to the server. The server can not read it.
4. When Bob opens his app, Bob's device (client) requests his messages from the server.
5. The server sends the encrypted messages to Bob.
6. Bob's device decrypts the messages using his private key, so he can read them.

There are many advantages to this design:
- Server only stores encrypted messages, can't read them.
- Only username needed to sign up, allows for complete anonymity.
- Password is hashed and salted before being stored on server.
- Private key is never stored anywhere, always derived from password, can't be stolen.
- Messages permenantly deleted after 3 days, less data exposed if account is compromised.

### What I learned
GhostLink has been an invaluable learning experience, exposing me to a wide range of concepts and technologies. Throughout the development process, I gained insights into various aspects of software development and security, including cryptography principles for implementing end-to-end encryption, the crucial role of SSL certificates in securing data in transit, and the implementation of robust user authentication mechanisms. 

The project also provided practical experience in UI design using React and Vite, along with the simplicity of Tailwind CSS for styling. Learning to protect routes and control access based on user authentication status further enhanced the overall security of the messaging app. Additionally, working with PostgreSQL for data storage, especially when containerized with Docker, offered insights into database management and deployment consistency.

The integration of JSON Web Tokens (JWT) for user authentication, allowing for the secure transmission of user identity information between the client and server, provided a valuable lesson in token-based authentication and authorization, contributing to the comprehensive exploration of secure application development.

Building a real-time messaging app using Node.js and Express.js expanded my understanding of scalable, responsive systems and the challenges associated with concurrent connections. While it's challenging to list all the lessons learned, GhostLink has been a comprehensive exploration of secure application development.

### Technologies
GhostLink utilizes a modern tech stack to ensure a secure and efficient messaging experience, I had a lot of fun working with the following:

**React with Vite**: The frontend is built using React, coupled with Vite for fast and efficient development. Vite provides a seamless development experience and I really liked it as an alternative to create-react-app

**Tailwind CSS**: Styling is streamlined with Tailwind CSS, allowing for a utility-first approach to design. Tailwind's flexibility and simplicity contribute to a responsive and visually appealing user interface.

**Node.js**: The server-side logic is powered by Node.js, enabling asynchronous handling of concurrent connections. Node.js ensures the scalability and responsiveness required for real-time messaging.

**PostgreSQL (Dockerized)**: The application relies on PostgreSQL for robust data storage. To facilitate easy deployment and management, the PostgreSQL instance is containerized using Docker, ensuring consistency across different environments.

**Express.js**: Express.js serves as the backend framework, simplifying the development of RESTful APIs and handling various server-side operations. Its minimalistic design and extensive middleware support contribute to the efficiency of GhostLink's server architecture.

**JSON Web Tokens (JWT)**: GhostLink incorporates JWT for user authentication. JWTs enable secure transmission of user identity information between the client and server.

These technologies collectively form a powerful stack, allowing GhostLink to deliver a secure, responsive, and feature-rich messaging experience.
