import { Schema, model } from "mongoose";
import ITest from "./../interfaces/test";

const TestSchema: Schema = new Schema({
  activation: {
    type: Date,
    required: true,
    default: Date.now()
  },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  label: {
    type: String,
    default: "None",
    required: true
  },
  code: {
    type: String,
    default:
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
    required: true
  }
});

export default model<ITest>("Test", TestSchema);
