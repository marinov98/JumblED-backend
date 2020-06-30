import { Schema, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface ITeacher extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  classes?: Array<typeof Schema.Types.ObjectId>;
}

const TeacherSchema: Schema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }]
});

// Handling passwords
TeacherSchema.pre("save", async function (this: ITeacher, next: any) {
  try {
    const hash: string = await bcrypt.hash(this.password, 12);
    this.password = hash;
    next();
  } catch (err) {
    console.error(err);
  }
});

TeacherSchema.methods.comparePassword = async function (
  this: ITeacher,
  otherPassword: string
) {
  try {
    return await bcrypt.compare(otherPassword, this.password);
  } catch (err) {
    console.error(err);
  }
};

export default model<ITeacher>("Teacher", TeacherSchema);
