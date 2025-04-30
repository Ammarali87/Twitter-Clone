// 400 fail 500 error
// ApiError → لإنشاء الأخطاء المخصصة
//errorMiddleware → يعالج جميع الأخطا

class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;

  
//   If you prefer a function, you can do this:

// const ApiError = (statusCode, message) => {
//   const error = new Error(message);
//   error.statusCode = statusCode;
//   return error;
// };

// export default ApiError;