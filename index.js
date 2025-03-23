require('dotenv').config(); // Load environment variables
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const DB_connect = require('./Configs/DatabaseConfig');
const route = require('./Routes/PostRoutes');
const getRoute = require('./Routes/GetRoute');
const putrouter = require('./Routes/PutRoute');

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(
  cors({
    origin: "https://frontend-uniator.vercel.app",
    credentials: true, // Allow cookies & auth headers
  })
);

app.use(bodyParser.json());
app.use(cookieParser());

app.use('/mern-revision/v1', route);
app.use('/mern-revision/v1/get', getRoute);
app.use('/mern-revision/v1/put', putrouter);

app.get('/hello', (req, res) => {
  console.log("Health check: Server is running!");
  res.send("<h1>Server is live! 🚀</h1>");
});

const URL = process.env.MONGO_URL;
console.log("Connecting to MongoDB...");

DB_connect(URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });
