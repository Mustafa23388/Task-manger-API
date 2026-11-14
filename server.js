require("dotenv").config();
console.log("Keys in .env:", Object.keys(require("dotenv").parse(require("fs").readFileSync(".env"))));
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorhandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: "Api is Working mustafa!"})
});

app.use("/api/auth", require('./routes/authRoutes'));
app.use("/api/tasks", require('./routes/taskRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();