# BlogCreater 📝

A full-stack blog creation platform with rich text editing capabilities and user authentication.


## 🚀 Features

- **🔐 User Authentication** - Secure signup/login with JWT
- **✍️ Rich Text Editor** - Create beautiful blogs with formatting, images, code blocks, and links
- **📦 Draft Auto-Save** - Never lose your work with automatic draft saving
- **👁️ Live Preview** - See your blog as you type
- **🔄 Responsive Design** - Works on all devices
- **🛡️ Protected Routes** - Secure content access
- **🌐 Social Sharing** - Share your blogs on social media

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **TipTap** - Rich text editor framework
- **React-Quill** - Alternative rich text editor
- **React-Toastify** - Toast notifications
- **Lodash** - Utility functions

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database operations
- **JWT** - Authentication mechanism
- **Python 3.x** - Backend language

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blogcreater.git
cd blogcreater
```

### 2. ⚙️ Frontend Setup

# Navigate to frontend directory
```bash
cd frontend/
```
# Install dependencies
```
npm install
npm install react@18 react-dom@18
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image
npm install @tiptap/extension-link @tiptap/extension-code-block
npm install react-toastify
npm install lodash
npm install react-quill
```

# Install and configure Tailwind CSS
```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Tailwind CSS Configuration

Update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```


Create or update your `src/index.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#Run the Development Server
```
npm run dev
```

### 3. 🐍 Backend Setup

```bash
# Navigate to backend directory
cd ../backend/

# Create virtual environment
python -m venv env

# Activate virtual environment
# For Windows PowerShell:
./env/Scripts/Activate.ps1

# For Windows Command Prompt:
# .\env\Scripts\activate

# For macOS/Linux:
# source env/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask application
python main.py
```

# 4. 🌐 Access the Application
Open your browser and navigate to:
```
http://localhost:5173
```


## 🔄 API Endpoints

| Endpoint                  | Method | Description              | Auth Required |
|---------------------------|--------|--------------------------|----------------|
| `/api/auth/register`     | POST   | Register a new user      | ❌ No          |
| `/api/auth/login`        | POST   | Login and get JWT token  | ❌ No          |
| `/api/blogs`             | GET    | Get all published blogs  | ❌ No          |
| `/api/blogs/<id>`        | GET    | Get a specific blog      | ❌ No          |
| `/api/blogs`             | POST   | Create a new blog        | ✅ Yes         |
| `/api/blogs/<id>`        | PUT    | Update a blog            | ✅ Yes         |
| `/api/blogs/<id>`        | DELETE | Delete a blog            | ✅ Yes         |
| `/api/drafts`            | GET    | Get user's drafts        | ✅ Yes         |



## 🔒 Authentication Flow

The application uses **JWT (JSON Web Tokens)** for authentication:

1. User registers or logs in  
2. Server validates credentials and returns a JWT  
3. Frontend stores the JWT in `localStorage`  
4. JWT is sent in the `Authorization` header for protected routes  
5. Server validates the JWT for protected endpoints  

---

## 🧩 Key Components

### Rich Text Editor

The blog editor utilizes **TipTap** and **React-Quill** to provide a powerful editing experience with:

- Text formatting (bold, italic, underline)  
- Headings and lists  
- Code blocks with syntax highlighting  
- Image uploads and embedding  
- Links with previews  

---

### Auto-Save Functionality

The editor automatically saves drafts to prevent work loss by:

- Periodically saving content to local storage  
- Syncing with the server when connectivity is available  
- Handling conflict resolution for multiple edits  



## 🚀 Deployment Options

### Frontend

- [Vercel](https://vercel.com)  
- [Netlify](https://netlify.com)  
- GitHub Pages  

### Backend

- [Heroku](https://heroku.com)  
- [Railway](https://railway.app)  
- [AWS EC2](https://aws.amazon.com/ec2/)  
- [PythonAnywhere](https://www.pythonanywhere.com)  
