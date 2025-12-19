const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes"); 
const EmailSendRoutes = require("./routes/EmailSend");
const adminRoutes = require("./routes/adminRoutes");
const cloudniaryAdd= require("./routes/cloudinayRoutes");

dotenv.config();

const app = express();

connectDB();


app.use(cors());
app.use(express.json());

app.use("/api", productRoutes); 
app.use("/api", EmailSendRoutes);
app.use("/api", adminRoutes);
app.use("/api", cloudniaryAdd);

const PORT = process.env.PORT || 5000;

// If you’re using Socket.io later
// const server = http.createServer(app);
// const io = new Server(server, { cors: "*" });

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });

// ✅ For now (without socket.io)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});