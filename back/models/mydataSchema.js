import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

// Define the schema
const mydataSchema = new Schema({
  userName: { type: String, required: true },
});

// Create and export the model
export default model("Mydata", mydataSchema);
