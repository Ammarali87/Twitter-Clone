import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan'; 
import cors from "cors";
import compression from 'compression';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import cookieParser from "cookie-parser";
import csrf from "csurf"; // Add this import

import errorMiddleware from './middleware/errorMiddleware.js';
import { connect } from './config/mongo.js';
import authRoutes from './routes/authRoute.js';
import ApiError from './utils/ApiError.js';
import { protect } from './controller/authController.js';
import userRoutes from './routes/userRoute.js';
import profileRoutes from './routes/profileRoute.js';

 

// http://localhost:3000/api/v1/csrf-token

dotenv.config();
 
const app = express();

 // protect headers
// app.use(helmet());
// Add before routes
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Keep only one CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.options('*', cors());
// app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET || 'your-secret-key'));
const csrfProtection = csrf({ cookie: true });
 
 
 
// Route to get CSRF token
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
}); 
 
// example of route we protected
app.post("/submit", (req, res) => {
  res.send("Form submitted successfully!");
});


// Development logging morgan 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log("Morgan enabled in development");
}


// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: 'Too many login attempts, please try again later'
});

app.use('/api/v1/auth/login', loginLimiter);


// Limit requests from same IP
// DDOS ATTACK  
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // 1 hour in mili second
//   message: 'Too many requests from this IP, please try again in an hour!'
// }); 

// Make rate limiter configurable
const limiter = rateLimit({
  max: process.env.API_RATE_LIMIT || 100,
  windowMs: process.env.API_RATE_LIMIT_WINDOW || 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));


   //  Security middleware
// sql/mongo injection 
app.use(mongoSanitize());
// protect comment /search/login input
app.use(xss());
// prevent parameter pollution 
// only take Array whatelist:["price","sold"]
// تمنع تمرير نفس المعامل أكثر من مرة.
// تضمن أن كل معامل يتم معالجته مرة واحدة فقط.
// القائمة البيضاء (whitelist) تسمح ببعض المعاملات التي قد تحتاج إلى قيم متعددة.
app.use(hpp({
  whitelist: ['price', 
    'sold', 'quantity', 
    'ratingsAverage',
     'ratingsQuantity']
})); 
app.use(compression()); // compress all resonses

// Handle favicon
app.get('/favicon.ico', (req, res) => res.status(204));

// Connect to database
connect();

 // test connection
app.get('/health', (req, res) => {
  res.send("Hello World");
});


// Routes
const apiRouter = express.Router();
app.use("/api/v1", apiRouter);

// Updated routes without /api/v1 prefix
apiRouter.use("/auth", authRoutes);   
apiRouter.use("/", storeRoutes);   

apiRouter.use(protect); // All routes after this require authentication
// app.use(csrfProtection);


apiRouter.use('/users', userRoutes); // admin controller
apiRouter.use('/profile', profileRoutes); // user controller


// Handle 404 routes
app.all("*", (req, res, next) => {
   next(new ApiError(404, `Route not found: ${req.originalUrl}`));
});   


// Global error handler
app.use(errorMiddleware);

export default app;



//  in front 

import axios from "axios";


const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true, // تفعيل الكوكيز لكل الطلبات
});

// الحصول على التوكن
async function getCsrfToken() {
  const res = await axiosInstance.get("/csrf-token");
  return res.data.csrfToken;
} 

// إرسال البيانات
// send token in headers 
// يجبر الكلاينت على طلبه وإرساله يدويًا،
async function submitForm(data) {
  const csrfToken = await getCsrfToken();
  await axiosInstance.post("/submit", data, {
    headers: { "CSRF-Token": csrfToken },
  });
}   