const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin
// Make sure to place your serviceAccountKey.json in the server directory
const fs = require('fs');
const path = require('path');
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: serviceAccountKey.json is missing!');
    console.log('\x1b[33m%s\x1b[0m', 'Please follow these steps:');
    console.log('1. Go to Firebase Console > Project Settings > Service accounts');
    console.log('2. Click "Generate new private key"');
    console.log('3. Rename the downloaded file to "serviceAccountKey.json"');
    console.log(`4. Place it in: ${__dirname}`);
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Middleware to check Admin role
const checkAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        // Check role in Firestore 'Users' collection
        // Note: The screenshot shows 'Users' with capital 'U' and 'Role' with capital 'R'
        const userDoc = await db.collection('Users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(403).json({ error: 'Forbidden: User profile not found' });
        }

        const userData = userDoc.data();
        if (userData.Role?.trim() !== 'Admin') {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        req.user = userData;
        next();
    } catch (error) {
        console.error('Error verifying token or role:', error);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// API Endpoints

// 1. Submit Inquiry Form
app.post('/api/inquiries', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const inquiryData = {
            name,
            email,
            phone: phone || '',
            message: message || '',
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('inquiries').add(inquiryData);
        res.status(201).json({ id: docRef.id, message: 'Inquiry submitted successfully' });
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Enroll User in Course
app.post('/api/enrollments', async (req, res) => {
    try {
        const { userId, userName, userEmail, courseId, courseName } = req.body;

        if (!userEmail || !courseId) {
            return res.status(400).json({ error: 'User email and course ID are required' });
        }

        const enrollmentData = {
            userId: userId || 'anonymous',
            userName,
            userEmail,
            courseId,
            courseName,
            enrolledAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await db.collection('enrollments').add(enrollmentData);
        res.status(201).json({ id: docRef.id, message: 'Enrollment successful' });
    } catch (error) {
        console.error('Error enrolling user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 3. Admin: Get all inquiries
app.get('/api/admin/inquiries', checkAdmin, async (req, res) => {
    try {
        // In a real app, you should add authentication middleware here
        const snapshot = await db.collection('inquiries').orderBy('createdAt', 'desc').get();
        const inquiries = [];
        snapshot.forEach(doc => {
            inquiries.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(inquiries);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Admin: Get all enrollments
app.get('/api/admin/enrollments', checkAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('enrollments').orderBy('enrolledAt', 'desc').get();
        const enrollments = [];
        snapshot.forEach(doc => {
            enrollments.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(enrollments);
    } catch (error) {
        console.error('Error fetching enrollments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
