# Blood Donation Website

A modern blood donation website that allows users to register as donors and search for donors by blood group. Built with HTML, CSS, JavaScript, and MongoDB.

## Features

- User-friendly interface
- Donor registration form
- Blood group search functionality
- Responsive design
- MongoDB integration for data storage

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blood-donation-website
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on your system. If you're using MongoDB locally, start the MongoDB service:
```bash
mongod
```

4. Create a `.env` file in the root directory and add your MongoDB connection string (optional):
```
MONGODB_URI=mongodb://localhost:27017/blood_donation
PORT=3000
```

## Running the Application

1. Start the server:
```bash
npm start
```

2. For development with auto-reload:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure

```
blood-donation-website/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── main.js
├── views/
│   └── index.html
├── server.js
├── package.json
└── README.md
```

## API Endpoints

- `POST /api/donors` - Register a new donor
- `GET /api/donors` - Get all donors
- `GET /api/donors/:bloodGroup` - Get donors by blood group

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
