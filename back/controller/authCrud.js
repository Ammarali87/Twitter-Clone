import { sanitizeUser } from '../utils/sanitizeData.js';  // Fixed import path with .js extension
import { User } from '../models/userModel.js';



// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users.map(user => sanitizeUser(user))
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching users'
    });
  }
}

// Get single user
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching user'
    });
  }
}

// Update user
export async function updateUser(req, res) {
  try {
    const allowedFields = ['name', 'email', 'password'];
    const updates = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    Object.assign(user, updates);
    await user.save();

    res.status(200).json({
      status: 'success',
      data: sanitizeUser(user)
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
}

// Delete user
export async function deleteUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting user'
    });
  }
}
