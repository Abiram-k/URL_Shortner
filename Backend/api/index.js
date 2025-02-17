require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const urlRoutes = require("../routes/urlRoutes");

const app = express();

app.use(cors({
  origin: 'https://smolink-iota.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
})); app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/api", urlRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 