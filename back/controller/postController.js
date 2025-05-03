import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
  

export const createPost = async (req, res) => {
	try {
		const { text } = req.body;
		let { img } = req.body;
            
		const user = await User.findById(req.user._id);
		 // no need for .toString()
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const upload = await cloudinary.uploader.upload(img);
			img = upload.secure_url;
		}  

		const newPost = new Post({
			user: req.user._id,
			text,
			img,
		});
		await newPost.save(); 
		 // or   if you do not need to modify before save
		// const newPost = await Post.create({  } )
		

		res.status(201).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
		console.log("Error in createPost controller: ", error);
	}
};

  //  must check if this my own post  can not delete Elon must post 
export const deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
             
		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}
            // or keep them objectID  
			// if (!post.user.equals(req.user._id)) {

			if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in deletePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

// post.comments.push(comment);
		// await post.save();

export const commentOnPost = async (req, res) => {
	try {
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.log("Error in commentOnPost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

 
// const { id: postId } = req.params;
export const likeUnlikePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.user._id;

		const post = await Post.findById(postId);
		if (!post) return res.status(404).json({ message: "Post not found" });

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		const userLikedPost =
		 post.likes.some((id) => id.equals(userId));

		 if (userLikedPost) {
			// 👍 إلغاء الإعجاب
			post.likes.pull(userId);
			user.likedPosts.pull(postId);

			await post.save();
			await user.save();

			return res.status(200).json({ likes: post.likes });
		} else {
			// ❤️ إضافة إعجاب
			post.likes.push(userId);
			user.likedPosts.push(postId);

			await post.save();
			await user.save();

			// 🛎️ إنشاء إشعار
			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			return res.status(200).json({ likes: post.likes });
		}
	} catch (error) {
		console.error("Error in likeUnlikePost controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};


// export const likeUnlikePost = async (req, res) => {
// 	try {
	
// 		const userLikedPost = post.likes.includes(userId);
// 		if (userLikedPost) {
// 			// Unlike post
// 			await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
// 			await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			 // remove
// 			const updatedLikes = 
// 			 post.likes.filter((id) => id.toString() !== userId.toString());
// 			res.status(200).json(updatedLikes);
// 		} else {
// 			// Like post
// 			post.likes.push(userId);
// 			await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
// 			await post.save();

// 			const notification = new Notification({
// 				from: userId,
// 				to: post.user,
// 				type: "like",
// 			});
// 			await notification.save();

// 			const updatedLikes = post.likes;
// 			res.status(200).json(updatedLikes);
// 		}
// 	} catch (error) {
// 		console.log("Error in likeUnlikePost controller: ", error);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };


export const getAllPosts = async (req, res) => {
	try {
		const posts = await Post.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}  

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getAllPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};   
				// .sort("-careateAt")
               // user.likedPosts
	export const getLikedPosts = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likesposts = await Post.find({_id:{$in:user.likesposts}})

		const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	} catch (error) {
		console.log("Error in getLikedPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// const feedPosts = await Post.find({ user: { $in: following } })
    // user.following
export const getFollowingPosts = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });
		
		const feedPosts = await Post.find({ user: { $in: user.following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

    // user._id
export const getUserPosts = async (req, res) => {
	try {      
		const { username } = req.params;

		const user = await User.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	} catch (error) {
		console.log("Error in getUserPosts controller: ", error);
		res.status(500).json({ error: "Internal server error" });
	}
};