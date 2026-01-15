
---

# 🌍 EchoLocal

**EchoLocal** is an anonymous, location-based chatroom platform designed for **temporary, history-free conversations**.
It allows people within a nearby radius to create and join short-lived chatrooms without accounts, profiles, or permanent data.

> Talk freely. Stay anonymous. Leave no trace.

---

## ✨ Core Concept

EchoLocal is **not** a traditional chat app like WhatsApp or Instagram.

Instead:

* No signup
* No personal identity
* No long-term chat history
* No permanent rooms

Everything is **temporary, local, and ephemeral**.

---

## 🔑 Key Features

### 🕵️ Anonymous Identity

* Every user gets a **random temporary username** on entry.
* No login or signup required.
* Users can **refresh usernames anytime**.
* Sessions automatically expire after inactivity or time limit.

---

### 📍 Location-Based Chatrooms

* Users can create or join chatrooms within a **5km radius**.
* Location matching is **privacy-safe** (no exact GPS shared).
* Exact user location is **never stored or exposed**.

---

### ⏳ Ephemeral Chatrooms

* Chatrooms auto-delete after **2 hours by default**.
* Room hosts can extend duration to **3, 4, or 6 hours**.
* After expiry, rooms and messages are permanently removed.

---

### 🚫 No Chat History

* EchoLocal does **not retain readable chat history**.
* Messages are designed to be **temporary and disposable**.
* Once a room expires or a user refreshes their identity, old messages are gone forever.

---

### 🔐 Secure & Safe by Design

* Socket-based real-time communication.
* JWT-based temporary session protection.
* Rate-limiting to prevent spam.
* Room expiry enforced at both database and socket level.

---

### ⚠️ Prohibited Activities

EchoLocal strictly forbids:

* Scamming, fraud, phishing, impersonation
* Illegal content (drugs, weapons, hacking, etc.)
* Hate speech, harassment, or threats
* Organizing illegal activities or spreading misinformation

Violations may result in:

* Temporary or permanent bans
* Room deletion
* IP / device fingerprint flagging

---

### 🛡 Safety & Moderation

* Built-in **Report System** for users and rooms.
* Admin moderation tools for:

  * Room termination
  * Message discard
  * User bans (temporary or infinite)

EchoLocal is meant for **safe, fun, and free conversations** — not misuse.

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO
* JWT (temporary session auth)

### Frontend

* React.js (Web)
* Tailwind CSS
* Socket.IO Client

### Mobile (Planned)

* Expo + React Native

---

## 🗂 Project Structure (Backend)

```
EchoLocal/
├── Backend/
│   ├── Controllers/
│   ├── Models/
│   ├── Routes/
│   ├── Utils/
│   └── server.js
│
├── Frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── socket.js
```

---

## 🚀 Project Status

* ✅ Backend completed
* ✅ Frontend completed
* 🛠 Remaining features: Block, Report, Moderation enhancements
* 📱 Mobile app planned after web MVP

---

## 📌 Disclaimer

EchoLocal does not intentionally collect personal data.
However, misuse of the platform may still be reported to authorities if required by law.

You are responsible for what you send.

---

## 👨‍💻 Author

**Aniket Kumar**
Built as an experimental MERN + Socket.IO project focused on privacy, ephemerality, and real-time systems.

---
