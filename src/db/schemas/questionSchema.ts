import { Schema, Document, model } from "mongoose";

export interface IQuestion extends Document {
  prompt?: string;
  image?: string; // this will be probably be changed later
  choices?: Array<string>;
  text?: string;
  topic: string;
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
  topic: {
    type: String,
    default: "Not specified"
  }
});

export default model<IQuestion>("Question", QuestionSchema);
