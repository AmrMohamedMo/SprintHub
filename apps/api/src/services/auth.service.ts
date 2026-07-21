import { RegisterInput } from "../validators/auth.validator.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const registerUser = async (data: RegisterInput) => {

  // search if email is exist in DB
  const existingUser = await User.findOne({
    email: data.email,
  });

  // exist is error
  if (existingUser) {
    throw new Error("Email already exists");
  };

  // new email
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // create and save
  const user = await User.create({
    ...data,
    password:hashedPassword
  })

  return user;

};


