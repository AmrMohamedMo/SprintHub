import { RequestHandler } from "express";
/*
ده من أشهر الـ Utilities في Express.
اسمه asyncHandler، ووظيفته:
يمسك أي Error يحصل داخل async/await ويرسله للـ Error Handler تلقائيًا.

الخلاصة
asyncHandler = Wrapper حول أي Route async، حتى لا تكتب try/catch في كل Route. وهو يمرر أي Error إلى الـ errorHandler تلقائيًا.

عدها هنستخدمه مع أي Route فيها async/await بدل ما نكتب try/catch في كل Controller.

export const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
*/
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
    (req, res, next) =>
      Promise.resolve(handler(req, res, next)).catch(next);