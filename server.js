const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb+srv://goddeepgamer:UFP8Nac5QQSsVwgt@cluster7.towpj08.mongodb.net/blood_donation', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Donor Schema
const donorSchema = new mongoose.Schema({
    name: String,
    bloodGroup: String,
    age: Number,
    phone: String,
    email: String,
    address: String,
    lastDonation: Date,
    password: String, // In a real app, this would be hashed
    donationHistory: [{
        date: Date,
        location: String,
        notes: String
    }]
});

const Donor = mongoose.model('Donor', donorSchema);

// Campaign Schema
const campaignSchema = new mongoose.Schema({
    title: String,
    date: Date,
    location: String,
    description: String,
    organizer: String,
    contact: String
});

const Campaign = mongoose.model('Campaign', campaignSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Routes
// Donor registration
app.post('/api/donors', async (req, res) => {
    try {
        const donor = new Donor(req.body);
        await donor.save();
        res.status(201).json(donor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all donors
app.get('/api/donors', async (req, res) => {
    try {
        const donors = await Donor.find();
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get donors by blood group
app.get('/api/donors/:bloodGroup', async (req, res) => {
    try {
        const donors = await Donor.find({ bloodGroup: req.params.bloodGroup });
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get donor by email (for login)
app.get('/api/donors/email/:email', async (req, res) => {
    try {
        const donor = await Donor.findOne({ email: req.params.email });
        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }
        res.json(donor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update donor profile
app.put('/api/donors/:id', async (req, res) => {
    try {
        const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }
        res.json(donor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add donation history
app.post('/api/donors/:id/donations', async (req, res) => {
    try {
        const donor = await Donor.findById(req.params.id);
        if (!donor) {
            return res.status(404).json({ error: 'Donor not found' });
        }
        
        donor.donationHistory.push(req.body);
        donor.lastDonation = req.body.date;
        await donor.save();
        
        res.status(201).json(donor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Campaign routes
app.post('/api/campaigns', async (req, res) => {
    try {
        const campaign = new Campaign(req.body);
        await campaign.save();
        res.status(201).json(campaign);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ date: 1 });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Initialize some sample campaigns
async function initializeCampaigns() {
    try {
        const count = await Campaign.countDocuments();
        if (count === 0) {
            const sampleCampaigns = [
                {
                    title: 'Community Blood Drive',
                    date: new Date('2024-06-15'),
                    location: 'Community Center, 123 Main St',
                    description: 'Join us for our monthly community blood drive. Refreshments will be provided.',
                    organizer: 'Community Health Association',
                    contact: 'contact@communityhealth.org'
                },
                {
                    title: 'Corporate Blood Donation Camp',
                    date: new Date('2024-06-22'),
                    location: 'Tech Park, 456 Innovation Ave',
                    description: 'Annual corporate blood donation camp. All employees and their families are welcome.',
                    organizer: 'TechCorp Inc.',
                    contact: 'hr@techcorp.com'
                },
                {
                    title: 'Emergency Blood Collection',
                    date: new Date('2024-06-30'),
                    location: 'City Hospital, 789 Health Blvd',
                    description: 'Emergency blood collection drive to replenish hospital blood banks.',
                    organizer: 'City Hospital',
                    contact: 'bloodbank@cityhospital.org'
                }
            ];
            
            await Campaign.insertMany(sampleCampaigns);
            console.log('Sample campaigns initialized');
        }
    } catch (error) {
        console.error('Error initializing campaigns:', error);
    }
}

// Call the initialization function
initializeCampaigns();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});