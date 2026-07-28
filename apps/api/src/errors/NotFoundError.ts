import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(404, message)
  }
}