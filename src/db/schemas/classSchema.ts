import { Schema, Document, model } from "mongoose";

export interface IClass extends Document {
  title: string;
  students?: Array<typeof Schema.Types.ObjectId>;
  teacher: typeof Schema.Types.ObjectId;
}

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
