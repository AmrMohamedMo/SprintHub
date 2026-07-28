import { AppError } from "./AppError.js";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(400, message)
  }
}