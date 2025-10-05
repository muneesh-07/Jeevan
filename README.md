# Jeevan - Milk Quality Management System

A web application for managing milk batch quality data with MongoDB integration.

## Features

- Batch number lookup for milk quality data
- Phone number collection
- Admin panel for batch management
- Real-time database health monitoring

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/jeevan
# For MongoDB Atlas (cloud), use format like:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jeevan?retryWrites=true&w=majority

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/jeevan` as your MONGODB_URI

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update MONGODB_URI in your `.env` file

### 4. Test Database Connection

```bash
npm run test-db
```

This will test the MongoDB connection and verify that all models are working correctly.

### 5. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - Homepage
- `GET /health` - Database health check
- `POST /submit` - Submit batch number
- `POST /submit-phone` - Submit phone number
- `GET /batches` - Get all batches (admin)
- `POST /add-batch` - Add new batch (admin)
- `POST /update-batch/:id` - Update batch (admin)
- `POST /delete-batch/:id` - Delete batch (admin)
- `GET /phones` - Get all phone numbers (admin)

## Database Models

### Batch Model
- `batch_no` (String, required) - Unique batch identifier
- `fat` (Number) - Fat percentage
- `snf` (Number) - Solids Not Fat percentage
- `water` (Number) - Water percentage
- `protein` (Number) - Protein percentage
- `date` (Date, required) - Batch date
- `createdAt` (Date) - Auto-generated creation timestamp
- `updatedAt` (Date) - Auto-generated update timestamp

### Phone Model
- `phoneNumber` (String, required) - Phone number
- `date` (Date) - Submission date (auto-generated)

## Health Monitoring

The application includes built-in health monitoring:

- Database connection status checking
- Automatic reconnection on connection loss
- Graceful error handling
- Health check endpoint at `/health`

## Troubleshooting

### Connection Issues
1. Verify MongoDB is running (local) or accessible (Atlas)
2. Check your MONGODB_URI in the `.env` file
3. Run `npm run test-db` to diagnose connection issues

### Common Errors
- **Connection timeout**: Check network connectivity and MongoDB service status
- **Authentication failed**: Verify username/password in connection string
- **Database not found**: MongoDB will create the database automatically on first use

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB instance (Atlas recommended)
3. Set appropriate environment variables
4. Use a process manager like PM2 for Node.js applications

## License

ISC
