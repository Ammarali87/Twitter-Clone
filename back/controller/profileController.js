import User from '../models/user.model.js';
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

// Get user profile by username
export const getUserProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Follow/Unfollow user
export const followUnfollowUser = async (req, res) => {
  try {
    const { id: targetUserId } = req.params;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ error: "You can't follow/unfollow yourself" });
    }

    const [targetUser, currentUser] = await Promise.all([
      User.findById(targetUserId),
      User.findById(currentUserId)
    ]);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isAlreadyFollowing = currentUser.following.includes(targetUserId);
    
    if (isAlreadyFollowing) {
      // Unfollow
      await Promise.all([
        User.updateOne(
          { _id: targetUserId }, 
          { $pull: { followers: currentUserId }}
        ),
        User.updateOne(
          { _id: currentUserId }, 
          { $pull: { following: targetUserId }}
        )
      ]);
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow
      await Promise.all([
        User.updateOne(
          { _id: targetUserId }, 
          { $addToSet: { followers: currentUserId }}
        ),
        User.updateOne(
          { _id: currentUserId }, 
          { $addToSet: { following: targetUserId }}
        )
      ]);

      // Create notification
      await Notification.create({
        type: "follow",
        from: currentUserId,
        to: targetUserId,
      });

      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (error) {
    console.error("Error in followUnfollowUser:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get suggested users
export const getSuggestedUsers = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("following");
    
    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: [req.user._id, ...user.following] }
        }
      },
      { $sample: { size: 10 } },
      { $project: { password: 0 } }
    ]);

    res.status(200).json(users.slice(0, 4));
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  const {
    fullName,
    email,
    username,
    currentPassword,
    newPassword,
    bio,
    link,
  } = req.body;
  let { profileImg, coverImg } = req.body;

  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== userId.toString()) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: "Username is already taken" });
      }
    }

    // Update password if provided
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Update other fields
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.username = username || user.username;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;

    await user.save();

    // Remove password from response
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.log("Error in updateUser: ", error.message);
    res.status(500).json({ error: error.message });
  }
};














// import bcrypt from "bcryptjs";
// import { v2 as cloudinary } from "cloudinary";

// // models
// import Notification from "../models/notification.model.js";
//  import bcrypt from "bcryptjs";
//  import User from '../models/user.model.js';

 
// // const { username } = req.params;
// // const user = await User.findOne({ username }).select("-password");
//  //  select "-passwrod"
//   // findOne() findByid vs find({})   one person   many persons
// export const getUserProfile = async (req, res) => {
// 	const { username } = req.params;

// 	try {  
// 		const user = await User.findOne({ username }).select("-password");
// 		if (!user) return res.status(404).json({ message: "User not found" });

// 		res.status(200).json(user);
// 	} catch (error) {
// 		console.log("Error in getUserProfile: ", error.message);
// 		res.status(500).json({ error: error.message });
// 	}
// };



//     //   if two await user Promise.all([])
//     // { followers: currentUserId } }),
// 	//  { following: targetUserId } })
// export const followUnfollowUser = async (req, res) => {
// 	try {
// 		const { id: targetUserId } = req.params;
// 		const currentUserId = req.user._id;

// 		// ❌ Prevent following/unfollowing self
// 		if (targetUserId === currentUserId.toString()) {
// 			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
// 		}    

// 		// ✅ Check if both users exist
// 		const [targetUser, currentUser] = await Promise.all([
// 			User.findById(targetUserId),
// 			User.findById(currentUserId)
// 		]);   

// 		if (!targetUser || !currentUser) {
// 			return res.status(404).json({ error: "User not found" });
// 		}

// 		const isAlreadyFollowing =
// 		 currentUser.following.includes(targetUserId);
// 		if (isAlreadyFollowing) {
// 			// 👎 Unfollow
// 			await Promise.all([
// 				User.updateOne({ _id: targetUserId }, { $pull:
// 					 { followers: currentUserId } }),
// 				User.updateOne({ _id: currentUserId }, { $pull:
// 					 { following: targetUserId } })
// 			]);

// 			return res.status(200).json({ message: "User unfollowed successfully" });
// 		} else {
// 			// 👍 Follow
// 			await Promise.all([
// 				User.updateOne({ _id: targetUserId }, { $addToSet:
// 					 { followers: currentUserId } }),
// 				User.updateOne({ _id: currentUserId }, { $addToSet:
// 					 { following: targetUserId } })
// 			]);  

// 			// 🛎️ Create follow notification
// 			await Notification.create({
// 				type: "follow",
// 				from: currentUserId,
// 				to: targetUserId,
// 			});

// 			return res.status(200).json({ message: "User followed successfully" });
// 		}
// 	} catch (error) {
// 		console.error("Error in followUnfollowUser:", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };
//   // get ids findByid() userTomodify, currentuser
//   //    if id == id can not follow your self
// //   3 validate 4 isFloowind = currnet.floowind.includes(id)
 

// //   if use select("follower") get only them not all obj  popluate get more date

// export const getSuggestedUsers = async (req, res) => {
// 	try {
	
// 		// 1. بنجيب الـ IDs اللي اليوزر بيتابعهم
// 		const user = await User.findById(req.user._id).select("following");

// 		// 2. بنستخدم aggregate عشان نفلتر ونجيب يوزرات عشوائية
// 		const users = await User.aggregate([
// 			{   
// 				$match: {     // $nin:[] not {}   //  , rest params  
// 					_id: { $nin: [req.user._id, ...user.following] }
// 					, // بنستبعد نفسي واللي أنا متابعهم
// 				},
// 			},        //   if one  
// 				// 		_id: { $ne: userId },

// 				{ $sample: { size: 10 } }, // بناخد 10 عشوائيين من الباقي
// 			{ $project: { password: 0 } }, // بنشيل الباسورد من الريسبونس
// 		]); 

// 		// 3. بنرجع أول 4 بس للمستخدم  cut from 0 to 4 
// 		res.status(200).json(users.slice(0, 4));
// 	} catch (error) { 
// 		console.log("Error in getSuggestedUsers: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };


//     //   i forgot  findById(req.user._id)
// 	// extract newpasword and currentpassword to check if he update
// 	export const updateUser = async (req, res) => {
// 		const {
// 			fullName,
// 			email,
// 			username,
// 			currentPassword,
// 			newPassword,
// 			bio,
// 			link,
// 		} = req.body;
// 		let { profileImg, coverImg } = req.body;
	
// 		const userId = req.user._id;
	
// 		try {
// 			let user = await User.findById(userId);
// 			if (!user) return res.status(404).json({ message: "User not found" });
	
// 			// ✅ تحقق من أن الإيميل غير مستخدم من شخص آخر
// 			if (email && email !== user.email) {
// 				const emailExists = await User.findOne({ email });
// 				if (emailExists && emailExists._id.toString() !== userId.toString()) {
// 					return res.status(400).json({ error: "Email is already in use" });
// 				}
// 			}
// 	            // optional 
// 			// ✅ تحقق من أن اليوزرنيم غير مستخدم من شخص آخر
// 			if (username && username !== user.username) {
// 				const usernameExists = await User.findOne({ username });
// 				if (usernameExists && usernameExists._id.toString() !== userId.toString()) {
// 					return res.status(400).json({ error: "Username is already taken" });
// 				}
// 			}
	
// 			// ✅ التحقق من الباسورد
// 				if (currentPassword && newPassword) {
// 					const isMatch =
// 					await user.comparePassword(currentPassword)
// 					if (!isMatch) {
// 						return res.status(400).json({ error: "Current password is incorrect" });
// 					}
// 					if (newPassword.length < 6) {
// 						return res
// 							.status(400)
// 							.json({ error: "Password must be at least 6 characters long" });
// 					}
	
// 					const salt = await bcrypt.genSalt(10);
// 					user.password = await bcrypt.hash(newPassword, salt);
// 				} else {
// 					return res.status(400).json({
// 						error: "Please provide both current password and new password",
// 					});
// 				}
			
	
// 			// ✅ تحديث الصور
// 			if (profileImg) {
// 				if (user.profileImg) {
// 					await cloudinary.uploader.destroy(
// 						user.profileImg.split("/").pop().split(".")[0]
// 					);
// 				}
// 				const uploadedResponse = await cloudinary.uploader.upload(profileImg);
// 				profileImg = uploadedResponse.secure_url;
// 			}
	
// 			if (coverImg) {
// 				if (user.coverImg) {
// 					await cloudinary.uploader.destroy(
// 						user.coverImg.split("/").pop().split(".")[0]
// 					);
// 				}
// 				const uploadedResponse = await cloudinary.uploader.upload(coverImg);
// 				coverImg = uploadedResponse.secure_url;
// 			}
	
// 			// ✅ التحديث النهائي
// 			user.fullName = fullName || user.fullName;
// 			user.email = email || user.email;
// 			user.username = username || user.username;
// 			user.bio = bio || user.bio;
// 			user.link = link || user.link;
// 			user.profileImg = profileImg || user.profileImg;
// 			user.coverImg = coverImg || user.coverImg;
	
// 			user = await user.save();
// 			user.password = null;
	
// 			return res.status(200).json(user);
// 		} catch (error) {
// 			console.log("Error in updateUser: ", error.message);
// 			res.status(500).json({ error: error.message });
// 		}
// 	};
	


// // import { User } from '../models/userModel.js';
// // import ApiError from '../utils/ApiError.js';
// // import asyncHandler from '../utils/catchAsync.js';
// // import { sanitizeUser } from '../utils/sanitizeData.js';

// //    // profile for user 


// // // Get logged in user profile
// // export const getMyProfile = asyncHandler(async (req, res) => {
// //   // req.user is already available from protect middleware
// //   const user = await User.findById(req.user._id);
  
// //   res.status(200).json({
// //     status: 'success',
// //     data: sanitizeUser(user)
// //   });
// // });

// // // Update logged in user profile
// // export const updateMyProfile = asyncHandler(async (req, res) => {
// //   const { name, email, phone, address } = req.body;

// //   // Prevent password update on this endpoint
// //   if (req.body.password) {
// //     throw new ApiError(400, 'This route is not for password updates. Please use /updateMyPassword');
// //   }  

// //   // Build update object with only allowed fields
// //   const updateData = {
// //     name: name || req.user.name,
// //     email: email || req.user.email,
// //     phone: phone || req.user.phone,
// //     address: address || req.user.address
// //   };

// //   const updatedUser = await User.findByIdAndUpdate(
// //     req.user._id,  
// //     updateData,
// //     { new: true, runValidators: true }
// //   );

// //   res.status(200).json({
// //     status: 'success',
// //     data: sanitizeUser(updatedUser)
// //   });
// // });

// // // Delete logged in user (deactivate)
// // export const deleteMyProfile = asyncHandler(async (req, res) => {
// //   await User.findByIdAndUpdate(req.user._id, { active: false });

// //   res.status(200).json({
// //     status: 'success',
// //     data: null
// //   });
// // });