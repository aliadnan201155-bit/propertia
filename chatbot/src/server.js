// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load .env.local (preferred) or fallback to .env
dotenv.config({ path: '.env.local' });

// Constants
const PORT = process.env.PORT || 8000;
const DB_NAME = process.env.DB_NAME || "RealEstate";

// Connect to MongoDB
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

// App setup
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim()) : ['http://localhost:8000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    // Allow localhost and any origin in allowed list
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(null, true); // Allow for development; restrict in production
    }
  },
  credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


// Routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import reviewRoutes from './routes/review.routes.js';
import faq from './routes/faq.routes.js'
import inquiryRoutes from './routes/inquiry.routes.js';
import propertyRoutes from './routes/property.routes.js';
import chatbotRoutes from './routes/chatbot.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';


//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use("/api/v1/faq", faq);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
});
