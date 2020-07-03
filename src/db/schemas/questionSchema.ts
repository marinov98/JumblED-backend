import { Schema, model } from "mongoose";
import IQuestion from "./../interfaces/question";

const QuestionSchema: Schema = new Schema({
  prompt: {
    type: String
  },
  image: {
    type: String
  },
  choices: [{ type: String }],
  text: {
    type: String
  },
  time: {
    type: Number,
    enum: [10, 15, 30, 60, 120, 240, 300, 600],
    default: 60
  },
  test: {
    type: Schema.Types.ObjectId,
    ref: "Test",
    required: true
  }
});

export default model<IQuestion>("Question", QuestionSchema);
