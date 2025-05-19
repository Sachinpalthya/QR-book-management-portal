const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const fs = require('fs');

// Create upload directories if they don't exist
const uploadDirs = ['uploads', 'uploads/pdf', 'uploads/qr', 'uploads/temp'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const bookRoutes = require('./routes/bookRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const userRoutes = require('./routes/userRoutes');
const academicYearRoutes = require('./routes/academicYearRoutes');
const branchRoutes = require('./routes/branchRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const urlRoutes = require('./routes/urlRoutes');
const qrCodeRoutes = require('./routes/qrCodeRoutes');
const redirectRoutes = require('./routes/redirectRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5001;
const prisma = require('./utils/prisma');
const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));
app.use(express.json());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/group", groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/academic-years', academicYearRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/qr-codes', qrCodeRoutes);
app.use('/api/redirects', redirectRoutes);

// QR Scan redirect endpoint
app.get('/scan/:qrCode', async (req, res) => {
  try {
    const { qrCode } = req.params;
    console.log('Scanning QR code:', qrCode);
    
    const chapter = await prisma.chapter.findFirst({
      where: {
        qrContent: qrCode
      },
      include: {
        subQRCodes: true
      }
    });

    if (!chapter) {
      console.error('Chapter not found for QR code:', qrCode);
      return res.status(404).send('Chapter not found. Please try scanning again.');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/qr-scan/${chapter.id}`;
    console.log('Redirecting to:', redirectUrl);
    
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Error handling QR scan:', error);
    res.status(500).send('Error processing QR code. Please try again.');
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Upload directories initialized at ${path.join(__dirname, 'uploads')}`);
    });
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start the server if we're not in a test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
