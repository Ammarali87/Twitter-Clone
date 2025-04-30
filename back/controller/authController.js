import { sanitizeUser } from '../utils/sanitizeData.js';  // Fixed import path with .js extension
import { User } from '../models/userModel.js';
import { sendEmail } from '../config/nodemailer.js';
import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';


    
// Function to generate JWT
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );
};
  


// // **Signup**
export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;
 
   // check if email exists optional   
   const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ApiError('Email already registered.', 400));
  }

  // Allow admin creation ONLY if no admins exist
  if (role === 'admin') {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return next(new ApiError('Admin already exists. Cannot create multiple admins through signup.', 403));
    }  
  }

  // Create the new user
  const newUser = await User.create({
    name,  
    email,
    password,
    phone, 
    role: role || 'user', // Default role
    //  isActive: false,  // optinal to make email verfiy
  });

  // Generate JWT token
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    user: sanitizeUser(newUser),
  });    
});



  //    ** login  ** 
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Check if email and password exist
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'fail',
      message: 'Please provide email and password' 
    });
  }

  // 2. Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  // 3. Check if user exists & password is correct using the model method
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ 
      status: 'fail',
      message: 'Incorrect email or password' 
    });
  }

  // 4. If everything ok, send token
  const token = signToken(user._id);

  res.status(200)
    .header('Authorization', `Bearer ${token}`)
    .header('Access-Control-Expose-Headers', 'Authorization')
    .json({
      status: 'success',
      token,
      user: sanitizeUser(user)
    });
});


// export async function signup(req, res) {
//   try {
//       const { name, email, password, phone, role } = req.body;
      
//       // Only allow admin creation if no other admins exist (first admin)
//       if (role === 'admin') {
//         const adminExists = await User.findOne({ role: 'admin' });
//         if (adminExists) {
//           return res.status(403).json({
//             status: 'fail',
//             message: 'Admin already exists. Cannot create multiple admins through signup.'
//           });
//         }
//       }

//       const newUser = await User.create({ 
//           name, 
//           email, 
//           password,
//           phone,
//           role: role || 'user' // Default to 'user' if no role provided
//       });

//       const token = signToken(newUser._id);
      
//       res.status(201).json({
//           status: 'success',
//           token,
//           user: sanitizeUser(newUser)
//       });
//   } catch (err) {  
//       if (err.name === 'ValidationError') {
//           const messages = Object.values(err.errors).map(er => er.message);
//           return res.status(400).json({ 
//               status: 'fail', 
//               message: messages 
//           });
//       }
//       res.status(400).json({ 
//           status: 'fail', 
//           message: err.message 
//       });
//   }
// }

// // **Login**



     
// **Logout**

// Add token blacklist feature
const blacklistedTokens = new Set();

export function logout(req, res) {
  const token = 
  req.headers.authorization?.split(' ')[1];
  if (token) {
    blacklistedTokens.add(token);
  } 
  
  res.cookie('jwt', '', { 
    expires: new Date(0), 
    httpOnly: true,  // js can not read it 
    secure: process.env.NODE_ENV === 'production', // only send cookie over HTTPS in production
    sameSite:"Strict" ,
  });  

    res.status(200).json({ 
    status: 'success', 
    message: 'Logged out successfully' 
  });
}
      







      // ** forget password Code **  //

  //  generate code and send code to email 

  export async function forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide an email address'
        });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'No user found with that email'
        });
      }
  
      // Generate reset code
      const resetCode = user.generateCode(); 
      user.passwordResetCode = resetCode;
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      
      await user.save();
    
      // const message = `
      //   <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      //     <h2>Hi ${user.name},</h2>
      //     <p>Your password reset code is:</p>
      //     <h1>${resetCode}</h1>
      //     <p>This code will expire in 10 minutes</p>
      //   </div>`;
  
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Password Reset Code',
      //   html: message
      // });

    await sendEmail(email, 'resetPassword', resetCode);

    
      res.status(200).json({
        status: 'success',
        message: 'Reset code sent to email'
      });
  
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Error sending reset code'
      });
    }
  }
  


  // user.passwordResetVerified = true;
  export async function verifyCode(req, res) {
    try {
      const { code } = req.body;
      
      // Add validation
      if (!code) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide valid 6-digit reset code'
        });
      }
  
      // Find user with reset code
      const user = await User.findOne({
        passwordResetCode: code,
        passwordResetExpires: { $gt: Date.now() }
      }).select('+passwordResetCode +passwordResetExpires');

      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid or expired reset code'
        });
      }
  
      user.passwordResetVerified = true;
      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Code verified successfully'
      });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Error verifying code'
      });
    }
  }

  export async function resetPassword(req, res) {
    try {
      const { email, newPassword } = req.body;

      // Validate inputs
      if (!email || !newPassword) {
        return res.status(400).json({
          status: 'fail',
          message: 'Please provide email and new password'
        });
      }
  
      // Find specific user with verified reset code
      // يطابق كل الصفات   
      const user = await User.findOne({
        email,
        passwordResetVerified: true,
        passwordResetExpires: { $gt: Date.now() }//forgot
        // not = falst but {$gt:dDte.now()}
               // Time now > passwordREsetExpre 
      });      
        
      if (!user) {
        return res.status(400).json({
          status: 'fail',
          message: 'Reset code not verified or expired'
        });
      }
  
      // Update password and clear reset fields
      user.password = newPassword;  
      // numer/bolean /time 
      user.passwordResetCode = undefined; // forgot
      user.passwordResetExpires = undefined;// forgot
      user.passwordResetVerified = undefined; // forgot
      await user.save();

      // Generate new token
      const token = signToken(user._id);// forgot

      res.status(200).json({
        status: 'success',
        message: 'Password reset successful',
        token
      });
  
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
  }

  // reset Pass With CurrentPass
export async function changePassword(req, res) {
  try {
    const { email, currentPassword, newPassword } = req.body;
   
    // Input validation   user or with if and not !
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email, current password and new password'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email })
    .select('+password'); // i forgot 
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that email'
      });
    }

    // Verify current password

      // Verify current password  
      // use comparePassword not if
  // he store if value in const and
  //  use it to make error  with !validPassword
  
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();  // i forgot 

    // Generate new token
    const token = signToken(user._id);  // i forgot 

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
      token
    });

  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
}

import { sendSMS } from '../config/textbeltConfig.js'; // or fast2smsConfig.js or firebaseConfig.js

export async function forgotPasswordSms(req, res) {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a phone number'
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No user found with that phone number'
      });
    }  

    // Generate reset code
    const resetCode = user.generateCode();
    user.passwordResetCode = resetCode;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    await user.save();

    // Send SMS
    const message = `Your reset code is: ${resetCode}. Valid for 10 minutes.`;
   
    await sendSMS(user.phone, message);

  console.log('SMS sent successfully');

  res.status(200).json({
      status: 'success',
      message: 'Reset code sent to your phone'
    });

  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error sending reset code'
    });
  }
}
         




export const allowedTo = (...roles) =>
  catchAsync(async (req, res, next) => {
    // 1) access roles
    // 2) access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError( "401",'You are not allowed to access this route')
      );    
    }
    next();
  });




//   make sure the user is logged in

  export const protect = catchAsync(async (req, res, next) => {
    try {  
      const token = req.headers.authorization?.startsWith('Bearer') 
        ? req.headers.authorization.split(' ')[1] 
        : req.cookies.jwt;

        if (!token) {
        return next(new ApiError(401, 'Please log in to access this route'));
      }

      // Verify token first before checking blacklist
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      // Then check blacklist
      if (blacklistedTokens.has(token)) {
        return next(new ApiError(401, 'Invalid token, please log in again'));
      }

      // 4) Check if user still exists
      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new ApiError(401, 'User no longer exists'));
      }
  
      // 5) Check if user changed password after token was issued
      // const passwordChangeTimestamp =
      //  user.passwordChangedAt 
      //   ? parseInt(user.passwordChangedAt.getTime() / 1000, 10)
      //   : 0;
  
      // if (decoded.iat < passwordChangeTimestamp) {
      //   return next(new ApiError(401, 'Password recently changed, please log in again'));
      // }
  
      if (user.passwordChangedAt &&
        decoded.iat < user.passwordChangedAt.getTime() / 1000)  { 
            return next(new ApiError('Password recently changed, please log in again', 401));
     }  

     // Grant access to protected route
      req.user = user;
      next();
      
    } catch (err) {
      return next(new ApiError(401, 'Invalid token, please log in again'));
    }
  });


  // export const protect = asyncHandler(async (req, res, next) => {
  //   // Check both header and cookie
  //   const token = 
  //     req.headers.authorization?.startsWith('Bearer') 
  //       ? req.headers.authorization.split(' ')[1] 
  //       : req.cookies.jwt; 
          
  //   if (!token) {
  //     return next(new ApiError(401, 'Please log in to access this route'));
  //   } // he use try catch in verify 
    
  //   try {
  //     // Verify token  not expired or changed 
  //     // and get user by token, decode id
  //     const decoded =   // forgot  process.env
  //     jwt.verify(token, process.env.JWT_SECRET);
  //              // forgot if to balckelist
  //     // Check if token is blacklisted
  //     if (blacklistedTokens.has(token)) {
  //       return next(new ApiError(401,'Invalid token, please log in again'));
  //     }    

  //       // Get user     // forgot findByID(decode.id)
  //     const user = await User.findById(decoded.id);
  //     if (!user) {
  //       return next(new ApiError(401,'User no longer exists'));
  //     }
  
  //     // Check password change
  //     //  console.log(decoded); can make var timeStamp =
  //     //  parseInt(user.pa.getTime()/1000,10)
  //    
  //  if (user.passwordChangedAt &&
  //        decoded.iat < user.passwordChangedAt.getTime() / 1000)  { 
  //     return next(new ApiError('Password recently changed, please log in again', 401));
  //     }   

  //     req.user = user;    // forgot 
  //     next();
  //   } catch (err) {
  //     return next(new ApiError('Invalid token', 401));
  //   }
  // });


  // const MAX_LOGIN_ATTEMPTS = 5;
  // const LOCK_TIME = 15 * 60 * 1000; // 15 minutes
  
  // export async function login(req, res) {
  //   try {
  //     const { email, password } = req.body;
  
  //     // Fetch the user
  //     const user = await
  //      User.findOne({ email }).select('+password');
  
  //     // Check if user exists
  //     if (!user) {
  //       return res.status(401).json({
  //         status: 'fail',
  //         message: 'Incorrect email or password'
  //       });
  //     }
  
  //     // Check if account is locked
  //     if (user.loginAttempts.count >=
  //        MAX_LOGIN_ATTEMPTS && 
  //         user.loginAttempts.lastAttempt >
  //          Date.now() - LOCK_TIME) {
  //       return res.status(429).json({
  //         status: 'fail',
  //         message: 'Account locked. Please try again later'
  //       });
  //     }
  
  //     // Verify password
  //     if (!(await user.comparePassword(password))) {
  //       // Increment login attempts
  //       user.loginAttempts.count = 
  //       (user.loginAttempts.count || 0) + 1;
  //       user.loginAttempts.lastAttempt = Date.now();
  //       await user.save();
  
  //       return res.status(401).json({
  //         status: 'fail',
  //         message: 'Incorrect email or password'
  //       });
  //     }
  
  //     // Successful login
  //     user.loginAttempts.count = 0;
  //     user.loginAttempts.lastAttempt = null;
  //     await user.save();
  
  //     // Proceed with the rest of your login logic...
  //     res.status(200).json({
  //       status: 'success',
  //       message: 'Login successful'
  //     });
  
  //   } catch (err) {
  //     res.status(500).json({
  //       status: 'error',
  //       message: 'An error occurred'
  //     });
  //   }
  // }
  
