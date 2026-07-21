import { RegisterInput,LoginInput } from "../validators/auth.validator.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
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
    password: hashedPassword
  })

  // put pass in iso var 
  const { password, ...userRespone } = user.toObject();

  // return with no pass
  return userRespone;

};


export const loginUser = async (data: LoginInput) => {

  // check if email is exist
  const user = await User.findOne({
    email: data.email,
  });

  // is not exist error
  if (!user) {
    throw new Error("invalid email or password");
  };

  // exist compare hashed pass
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  
  // if not error
  if (!isPasswordValid) {
    throw new Error("invalid email or password");
  };

  // exist generate token to be authorized
  // jwt.sign(payload, secret, options)
  const token = jwt.sign(
    { userId: user._id },
    env.jwtSecret,
    { expiresIn: "7d" }
  );

  return { token };
  
}