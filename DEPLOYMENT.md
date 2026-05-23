# Deployment Guide

## Quick Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) and create a new Blueprint
3. Connect your GitHub repo
4. Render will detect `render.yaml` and create both services
5. Add environment variables in Render dashboard:
   - `MONGO_URI` - your MongoDB Atlas connection string
   - `ADMIN_EMAIL` - admin login email
   - `ADMIN_PASSWORD` - admin login password
   - `CLOUDINARY_CLOUD_NAME` - from Cloudinary dashboard
   - `CLOUDINARY_API_KEY` - from Cloudinary dashboard
   - `CLOUDINARY_API_SECRET` - from Cloudinary dashboard
   - `GOOGLE_CLIENT_ID` - from Google Cloud Console
   - `SMTP_USER` - your Gmail address
   - `SMTP_PASS` - your 16-digit app password
   - `VITE_API_URL` - your Render API URL (e.g., `https://your-api.onrender.com/api/v1`)
   - `VITE_GOOGLE_CLIENT_ID` - same as GOOGLE_CLIENT_ID

## Docker (Local or VPS)

```bash
# Build and run
docker-compose up --build

# Or individually
docker build -t mws-api ./server
docker build -t mws-client ./client
docker run -p 5000:5000 --env-file server/.env mws-api
docker run -p 80:80 mws-client
```

## Manual VPS (Ubuntu/Debian)

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and install
git clone <your-repo>
cd modern-studio
npm run install:all

# Build client
npm run build:client

# Set environment variables in server/.env
# Start with PM2
npm install -g pm2
pm2 start server/src/server.js --name mws-api
pm2 serve client/dist 3000 --name mws-client --spa
pm2 save
pm2 startup
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | 64-char hex secret |
| `PORT` | No | Server port (default: 5000) |
| `NODE_ENV` | No | `production` or `development` |
| `CLIENT_URL` | Yes | Frontend URL for CORS |
| `ADMIN_EMAIL` | Yes | Admin login email |
| `ADMIN_PASSWORD` | Yes | Admin login password |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `SMTP_HOST` | No | SMTP server (e.g., smtp.gmail.com) |
| `SMTP_PORT` | No | SMTP port (default: 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password/app password |
| `VITE_API_URL` | Yes | API URL for frontend |
| `VITE_GOOGLE_CLIENT_ID` | No | Same as GOOGLE_CLIENT_ID |

## Post-Deployment

1. Update Google Cloud Console authorized origins with your new domain
2. Update Cloudinary CORS settings if needed
3. Test all features: login, registration, media upload, OTP
