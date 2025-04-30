import { getAll, getOne, createOne, updateOne, deleteOne } from './handlersFactory.js';
import Coupon from '../models/couponModel.js';

export const getCoupons = getAll(Coupon);

export const getCoupon = getOne(Coupon);

export const createCoupon = createOne(Coupon);

export const updateCoupon = updateOne(Coupon);

export const deleteCoupon = deleteOne(Coupon);