import { Schema, Document, model } from "mongoose";

export interface IQuestion extends Document {
  prompt?: string;
  image?: string; // this will be probably be changed later
  choices?: Array<string>;
  text?: string;
  time: number;
  test: typeof Schema.Types.ObjectId;
}

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
