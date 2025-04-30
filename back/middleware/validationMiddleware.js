import {  validationResult } from "express-validator";


const validationMiddleware = 
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next(); // Proceed to the actual handler
    }
  
export default validationMiddleware