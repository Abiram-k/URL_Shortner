require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlRoutes = require("../routes/urlRoutes");

const app = express();
app.options('*', cors());

app.use(cors({
    origin: 'https://smolink-iota.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Middleware to ensure CORS headers are set for all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://smolink-iota.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Ensure OPTIONS requests return HTTP 200
    }
    
    next();
});

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api", urlRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 