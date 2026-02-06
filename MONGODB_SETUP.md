# MongoDB Atlas Setup Guide (Quick & Easy!)

Since MongoDB is not installed locally, the easiest solution is to use **MongoDB Atlas** (free cloud database).

## Option 1: MongoDB Atlas (Recommended - 5 minutes)

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with email (or Google/GitHub)
3. Choose **FREE** tier (M0 Sandbox)

### Step 2: Create Cluster
1. After signup, click "Build a Database"
2. Choose **FREE** (M0) option
3. Select any cloud provider (AWS recommended)
4. Choose a region close to you
5. Click "Create Cluster" (takes 1-3 minutes)

### Step 3: Setup Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `movieapp`
5. Password: Click "Autogenerate Secure Password" (COPY THIS!)
6. User Privileges: "Atlas admin"
7. Click "Add User"

### Step 4: Setup Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://movieapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with the password you copied in Step 3
6. Add database name before the `?`:
   ```
   mongodb+srv://movieapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/movie-catalog?retryWrites=true&w=majority
   ```

### Step 6: Update Backend .env
Open `backend\.env` and update:
```env
MONGODB_URI=mongodb+srv://movieapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/movie-catalog?retryWrites=true&w=majority
```

### Step 7: Backend Will Auto-Restart
The backend server (running with `--watch`) will automatically detect the .env change and reconnect!

---

## Option 2: Install MongoDB Locally (Longer)

### For Windows:
1. Download: https://www.mongodb.com/try/download/community
2. Run installer (choose "Complete" installation)
3. Install as a Windows Service
4. MongoDB will start automatically
5. Keep the default .env setting:
   ```env
   MONGODB_URI=mongodb://localhost:27017/movie-catalog
   ```

---

## Verify Connection

After setting up MongoDB (Atlas or Local):

1. Check backend terminal - you should see:
   ```
   MongoDB Connected: cluster0.xxxxx.mongodb.net
   ```
   OR
   ```
   MongoDB Connected: localhost
   ```

2. If connected, the backend will stop showing the `ECONNREFUSED` error!

---

## Quick Test

Once connected, test the API:
1. Open browser: http://localhost:5000/api/health
2. Should see: `{"status":"OK","message":"Server is running"}`

---

**Recommended**: Use MongoDB Atlas - it's faster to setup, free, and works immediately without installing anything!
