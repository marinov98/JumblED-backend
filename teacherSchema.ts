import { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export const TeacherSchema: Schema = new Schema({
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
  // classes the teacher teaches
  classes: [{ type: Schema.Types.ObjectId, ref: "Class" }]
});

// Handling passwords
TeacherSchema.pre("save", async function (this: Schema, next: any) {
  if (!this.isModified("password")) return next();

  try {
    const hash: string = await bcrypt.hash(this.password, 12);
    this.password = hash;
  } catch (err) {
    console.error(err);
  }
});

TeacherSchema.methods.comparePassword = async function (
  this: Schema,
  otherPassword: string
) {
  try {
    return await bcrypt.compare(otherPassword, this.password);
  } catch (err) {
    console.error(err);
  }
};
