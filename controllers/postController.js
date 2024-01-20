import Post from "../modals/PostModal.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/customError.js";
import checkPermissions from "../utils/checkPermissions.js";
import { v2 as cloudinary } from "cloudinary";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  const LIMIT = 8;
  const startIndex = (Number(page) - 1) * LIMIT;
  const total = await Post.countDocuments({});
  const Posts = await Post.find()
    .sort({ _id: -1 })
    .limit(LIMIT)
    .skip(startIndex)
    .populate({ path: "creator", select: "name" });

  res.status(StatusCodes.OK).json({
    data: Posts,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};

export const getPost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId).populate({
    path: "creator",
    select: "name",
  });
  if (!post) {
    throw new NotFoundError("Post not Found");
  }
  res.status(StatusCodes.OK).json(post);
};

export const createPost = async (req, res) => {
  const { title, message } = req.body;
  const { userId } = req.user;
  const file = req.file;

  if (!title || !message || !file) {
    throw new BadRequestError(
      "Please Provide Title, Message, and a Valid File"
    );
  }
  if (
    !["image/jpeg", "image/png"].includes(file.mimetype) ||
    file.size > 5 * 1024 * 1024
  ) {
    throw new BadRequestError("Invalid file");
  }
  // Upload the file to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "Social",
    use_filename: true,
  });
  const newPost = new Post({
    creator: userId,
    title,
    message,
    selectedFile: result.secure_url,
  });
  await newPost.save();
  const populatePost = await newPost.populate({
    path: "creator",
    select: "name",
  });
  res.status(StatusCodes.CREATED).json(populatePost);
};

export const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, message } = req.body;
  const post = await Post.findById(postId);

  checkPermissions(req.user.userId, post.creator);
  const updatedPost = await Post.findOneAndUpdate(
    { _id: postId },
    { title, message },
    {
      new: true,
      runValidators: true,
    }
  ).populate({ path: "creator", select: "name" });

  if (!updatedPost) {
    throw new NotFoundError(`No item with id : ${postId}`);
  }
  res.status(StatusCodes.OK).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  const post = await Post.findById(postId);

  checkPermissions(req.user.userId, post.creator);
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    throw new NotFoundError("Post not found");
  }
  res.status(StatusCodes.OK).json({ postId });
};

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not Found");
  }

  const index = post.likes.findIndex((id) => String(id) === userId);
  if (index === -1) {
    post.likes.push(userId);
  } else {
    post.likes = post.likes.filter((id) => String(id) !== userId);
  }
  const updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
  }).populate({ path: "creator", select: "name" });

  res.status(StatusCodes.OK).json(updatedPost);
};

// TODO: Make it more robust
export const commentPost = async (req, res) => {
  const { postId } = req.params;
  const { value } = req.body;
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError("Post not Found");
  }
  post.comments.push(value);
  const updatedPost = await Post.findByIdAndUpdate(postId, post, {
    new: true,
  }).populate({ path: "creator", select: "name" });

  res.status(StatusCodes.OK).json(updatedPost);
};
