# Deployment Guide for Jeevan Milk Tracking App

## Prerequisites
1. **MongoDB Atlas Account**: Create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Git**: Install Git on your system
3. **Node.js**: Ensure Node.js is installed

## Environment Setup

### 1. Create Environment File
Create a `.env` file in your project root:
```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Server Port (optional, defaults to 3000)
PORT=3000
```

### 2. Get MongoDB Connection String
1. Go to MongoDB Atlas
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with your database name

## Deployment Options

### Option 1: Heroku (Recommended)

#### Setup:
1. **Install Heroku CLI**: Download from [devcenter.heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login to Heroku**:
   ```bash
   heroku login
   ```

3. **Create Heroku App**:
   ```bash
   heroku create your-app-name
   ```

4. **Set Environment Variables**:
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_connection_string"
   ```

5. **Deploy**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

6. **Open Your App**:
   ```bash
   heroku open
   ```

#### Heroku Files Created:
- `Procfile`: Tells Heroku how to start your app
- `.gitignore`: Excludes sensitive files from Git

### Option 2: Railway

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables**:
   ```bash
   railway variables set MONGODB_URI="your_mongodb_connection_string"
   ```

### Option 3: Render

1. **Connect GitHub Repository**:
   - Push your code to GitHub
   - Connect to Render.com
   - Choose "Web Service"

2. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variable: `MONGODB_URI`

### Option 4: DigitalOcean App Platform

1. **Create App**:
   - Connect GitHub repository
   - Choose "Node.js" as source type

2. **Configure**:
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Add environment variables

## Local Testing Before Deployment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Create .env file** with your MongoDB URI

3. **Test Locally**:
   ```bash
   npm start
   ```

4. **Visit**: `http://localhost:3000`

## Post-Deployment Checklist

- [ ] App loads without errors
- [ ] Database connection works
- [ ] Batch submission works
- [ ] Admin panel accessible
- [ ] Phone number collection works
- [ ] All CRUD operations functional

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**:
   - Check your connection string
   - Ensure IP whitelist includes 0.0.0.0/0 for deployment
   - Verify database user permissions

2. **Port Issues**:
   - Use `process.env.PORT || 3000` (already configured)

3. **Static Files Not Loading**:
   - Ensure `public` folder is in root directory
   - Check `express.static` configuration

4. **Environment Variables**:
   - Verify all required variables are set in deployment platform

## Security Considerations

- Use environment variables for sensitive data
- Implement authentication for admin routes
- Add input validation
- Use HTTPS in production
- Regular security updates

## Monitoring

- Set up logging
- Monitor database performance
- Track user analytics
- Set up error reporting

## Scaling

- Use MongoDB Atlas for database scaling
- Consider CDN for static assets
- Implement caching strategies
- Monitor resource usage

