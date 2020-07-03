import { Schema, model } from "mongoose";
import IClass from "./../interfaces/class";

const ClassSchema: Schema = new Schema({
  title: {
    type: String,
    required: true
  },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  teacher: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Teacher"
  }
});

export default model<IClass>("Class", ClassSchema);
