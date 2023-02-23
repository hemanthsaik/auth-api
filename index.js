const express = require("express");
const PORT = process.env.PORT || 3002

const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// Import Routes
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");

dotenv.config();

// Connect to DB

mongoose.connect(process.env.DB_CONNECT, () => console.log("connected to db"));

// Middalewares
app.use(express.json());

// Routes Middalwares
app.use("/api/user", authRouter);
app.use("/api/posts", postRouter);

app.listen(PORT, () => console.log(`"Server Up and running on port ${PORT}"`));
