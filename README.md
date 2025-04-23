# SWE-Semester-Project: DyNotes

DyNotes is a full-stack note-taking web application that allows users to create Cornell-style notes, organize them in folders, and generate AI-powered quizzes based on their notes. Users can log in, manage their notes, and test their retention using multiple quiz formats, such as flashcards, multiple choice, and true or false.

---

## 🛠️ Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Backend:** Flask, Python
- **Database:** MongoDB (Atlas or local)
- **AI Integration:** OpenAI GPT (quiz generation)

---

## 🚀 Features

- 📝 Cornell-style note editor
- 📁 Folder-based note organization
- 🔐 User authentication (login, register, reset password)
- 🤖 AI-powered quiz generation
  - Multiple choice
  - True/False
  - Flashcards
- 🔄 Save and view created notes and generated quizzes

---

## 💻 Getting Started

### Prerequisites

- Node.js (v16 recommended)
- Python (v3.8+)
- MongoDB (local or Atlas)
- OpenAI API key

---

### 🧪 Running Locally

#### 1. Clone the repo
```bash
git clone https://github.com/CamilaM1010/SWE-Semester-Project
cd SWE-Semester-Project
```

#### 2. Setup the Backend
```bash
cd flask-server
pip install -r requirements.txt
# Create .env with:
#MONGO_URI=your_mongodb_uri_here
#FLASK_SECRET_KEY=your_flask_secret_here
#OPENAI_API_KEY=your_openai_key_here

# Start the server:
python server.py
```
### 3. Setup the Frontend
```bash
cd ../client
npm install
npm start
```

---

## 👥 Team Members 
  - Nil Aydinoz: Frontend + Backend (UI and Notes Integration)
  - Camila Menendez: Frontend + Backend (UI and Notes Integration)
  - Sofija Mitukevic : Frontend (Quiz Generator Integration)
  - Omar Travieso: Frontend + Backend (Quiz Generator Integration)

---

## 📬 Contact
  - For any questions regarding the project and its functionality, contact menendez.c@ufl.edu, omartravieso@ufl.edu, ...  or open an issue.
