import mongoose from "mongoose";

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide Title Of Post"],
      minLength: [2, "Title can not be less than 2 characters"],
      maxLength: [25, "Title can not be More than 25 characters"],
    },
    message: {
      type: String,
      required: [true, "Please provide Some Message"],
      maxLength: [450, "Message can not be More than 450 characters"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    selectedFile: String,
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
    // TODO: make different Schema
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
