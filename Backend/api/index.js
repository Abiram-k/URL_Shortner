require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlRoutes = require("../routes/urlRoutes");

const app = express();

const corsOptions = {
  origin: 'https://smolink-iota.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://smolink-iota.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
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