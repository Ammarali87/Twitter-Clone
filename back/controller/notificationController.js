import Notification from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";


//    find({to:req.user_id})
 // select username profileimg   get Only them form path "from"
export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

	const notifications = await Notification.find({ to: userId })
        .populate({
            path: "from",
            select: "username profileImg",
        })   
        .sort({ createdAt: -1 }); // Add sorting

    await Notification.updateMany({ to: userId }, { read: true });

	res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
    }); 
});

export const deleteNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    await Notification.deleteMany({ to: userId });

	res.status(200).json({
        success: true,
        message: "Notifications deleted successfully"
    });
});

