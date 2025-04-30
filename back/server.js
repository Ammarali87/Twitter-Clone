import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
   // this new add const to app.listen
   // server.close(()=>{ process.exit(1)})
   
const server = app.listen(PORT, () => {
  console.log(`Server running in 
    ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled rejections promise
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});