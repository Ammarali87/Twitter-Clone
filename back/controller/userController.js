import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

import * as factory from './handlersFactory.js';
import ApiError from '../utils/ApiError.js';
import { User } from '../models/userModel.js';


//  user for admin  ,  profile for client user

// Use factory functions for standard CRUD operations
export const getAllUsers = factory.getAll(User, 'User');
export const getUser = factory.getOne(User);
export const deleteUser = factory.deleteOne(User);
export const createUser = factory.createOne(User);


export const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {   
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg,
      role: req.body.role,
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,  // obj or no obj if req
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});


export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat('jpeg')
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);

    req.body.profileImg = filename;``
    next();
  } catch (err) {
    return next(new ApiError(500, 'Error processing image'));
  }
});









