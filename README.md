# EstateHub : Buyer Portal

A full-stack real-estate buyer portal with JWT auth and a personal favourites dashboard.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Backend  | Python FastAPI SQLAlchemy SQLite |
| Auth     | JWT (python-jose) bcrypt        |
| Frontend | React 19 Vite Axios           |
| Styling  | Vanilla CSS |

---

## Project Structure

```
jobAssesments/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI app + CORS
│   │   ├── models.py         # SQLAlchemy models (User, Favorite)
│   │   ├── schemas.py        # Pydantic schemas
│   │   ├── database.py       # SQLite engine + session
│   │   ├── hashing.py        # bcrypt helpers
│   │   ├── token.py          # JWT create / verify
│   │   ├── oauth2.py         # get_current_user dependency
│   │   └── routers/
│   │       ├── auth.py       # POST /auth/login
│   │       ├── users.py      # POST /users/register · GET /users/me
│   │       └── favorites.py  # GET/POST/DELETE /favorites/…
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── api/axios.js           # Axios instance + auth interceptor
    │   ├── context/AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx  # used dummy pre made database for properties
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── vite.config.js        
```

### Note : "Haven't used dot env for easy evaluation of project architecture"
---

## How to Run

### 1 · Backend

```bash
cd backend

# Create & activate virtual environment
python -m venv .venv
./.venv/Scripts/activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### 2 · Frontend

```bash
cd frontend

# Install node modules
npm install

# Start frontend server
npm run dev
# → http://localhost:5173
```

> **Note:** The Vite dev server proxies `/auth`, `/users`, and `/favorites` to `http://localhost:8000`, so no CORS issues in development.

---

## API Endpoints

| Method   | Path                                  | Auth | Description           |
|----------|---------------------------------------|------|-----------------------|
| `POST`   | `/users/register`                     | No   | Create an account     |
| `POST`   | `/auth/login`                         | No   | Returns a JWT token   |
| `GET`    | `/users/me`                           | Yes  | Current user info     |
| `GET`    | `/favorites/show_favorite`           | Yes  | List my favourites    |
| `POST`   | `/favorites/favorite/{property_id}`  | Yes  | Add a favourite       |
| `DELETE` | `/favorites/remove_favorite/{property_id}` | Yes | Remove a favourite |

---

## Example Flows

### Sign up → Login → Add Favourite

```
1. Open http://localhost:5173
2. Click "Get started" → fill in name, email, password → submit
   auto-logged in, redirected to /dashboard

3. On the dashboard, browse "All Listings"
4. Click "Save" on any property card
   toast: "Added to favourites!"
   card moves to "My Favourites" section

5. Click "Saved" on a favourited card to remove it
   toast: "Removed from favourites."

6. Click "Sign out" in the navbar → redirected to landing page
7. Click "Sign in" → log in with your credentials
   dashboard loads with your saved favourites restored
```

### Via Swagger UI (REST APIs only)

```
1. POST /users/register   { "name": "Sanjib", "email": "sanjib@example.com", "password": "secret123" }
2. POST /auth/login       username=jane@example.com & password=secret123
   copy the access_token
3. Click "Authorize" in Swagger, paste: Bearer <token>
4. GET  /users/me
5. POST /favorites/favorite/3
6. GET  /favorites/show_favorite
7. DELETE /favorites/remove_favorite/3
```

---

## Security Notes

- Passwords are hashed with **bcrypt** — never stored in plain text.
- JWTs expire after **120 minutes**.
- All favourite endpoints verify ownership via the JWT, users cannot read or modify another user's data.
- Client-side validation runs before every API call (required fields, password length, password match).

### Developed By Sanjib Poudel
