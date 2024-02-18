const mongoose = require("mongoose");

mongoose.connect(process.env.SRV)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("MongoDB connection error:", error));