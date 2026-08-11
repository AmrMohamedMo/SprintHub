import { RegisterInput, LoginInput } from "../validators/auth.validator.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { ConflictError } from "../errors/ConflictError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { generateRefreshToken, createSession, saveRefreshTokenHash } from "./refresh-token.service.js";
import { generateAccessToken, verifyRefreshToken } from "./jwt.service.js";
import RefreshToken from "../models/refresh-token.model.js";
import { verifyRefreshTokenHash } from "./refresh-token.service.js";




/*
Business Logic فقط
أي حاجة خاصة بالمنطق تكون في Service.

مثل:

Verify Password
Generate JWT
Create Session
Save Database
Hash Password

*/
/*
مسؤوليته:

Authentication

يعني:

Register
Login
Refresh
Logout
*/

export const registerUser = async (data: RegisterInput) => {

  // search if email is exist in DB
  const existingUser = await User.findOne({
    email: data.email,
  });

  // exist is error
  if (existingUser) {
    throw new ConflictError("Email already exists");
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
/*

Login

↓

Verify User ✅

↓

Generate Access Token ✅

↓

Create Refresh Session ✅

↓

Return Response ⬅️
*/

/*
Authenticate User
↓

Create Session
↓

Return Tokens
*/
export const loginUser = async (data: LoginInput) => {

  // Verify Email
  //-------------

  // check if email is exist
  const user = await User.findOne({
    email: data.email,
  });

  // is not exist error
  if (!user) {
    throw new UnauthorizedError("invalid email or password");
  };

  // if admin disable user
  if (!user.isActive) {
    throw new ForbiddenError("Account is Disabled");
  };

  // Verify Password

  // exist compare hashed pass
  // const isPasswordValid = await bcrypt.compare(data.password, user.password);
  const isPasswordValid = await user.comparePassword(data.password);

  // if not error
  if (!isPasswordValid) {
    throw new UnauthorizedError("invalid email or password");
  };

  // Update lastLogin
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT
  // ------------
  // exist generate token to be authorized
  // jwt.sign(payload, secret, options)
  // Access Token 7d

  // const accessToken = jwt.sign(
  //   {
  //     userId: user._id,
  //     email: user.email,
  //     role: user.role
  //   },
  //   env.jwtSecret,
  //   { expiresIn: "7d" }
  // );


  // Generate JWT
  const accessToken = generateAccessToken(
    user._id.toString(),
    user.email,
    user.role
  );

  // Create a new user session and get the Refresh Token for the browser.
  // مدة طويلة 30 يوم
  // const refreshToken = await createRefreshToken(user._id);
  const session = await createSession(user._id);

  // Generate a refresh jwt for this session
  const refreshToken = generateRefreshToken(
    user._id,
    session._id
  )

  // hash the refresh jwt and store it in the session
  await saveRefreshTokenHash(session._id, refreshToken);

  /*
  Access Token
↓

JSON

Refresh Token
↓

HttpOnly Cookie
  */
  // The controller will send the Access Token in JSON
  // and store the Refresh Token inside an HttpOnly Cookie.
  return {
    accessToken,
    refreshToken
  };

}






/*
لما المستخدم يعمل:

POST /refresh

إحنا محتاجين نعمل كام حاجة؟

1. قراءة Cookie

2. البحث عن Session

3. مقارنة Hash

4. Generate Access Token

5. Return Access Token

دي عملية Authentication كاملة ولا مجرد Session؟

الإجابة:

Authentication.
*/

/*
لازم الأول نتأكد إن الـ Refresh Token دي:

موجودة في الـ Database.
مش Revoked.
مش منتهية.
والـ Hash بتاعها يطابق الـ Original.

*/



/*
1. نفك الـ Refresh Token         ✅
2. نجيب الـ Session من Database  ✅
3. نتأكد إن الـ Session صالحة
4. نتأكد إن الـ Refresh Token هو نفسه
5. نطلع Access Token جديد
*/
// Create a new Access Token for the authenticated user.
// اتأكد إن الـ Refresh Token صحيح، وبعدها اصدر Access Token جديد.

/*
إحنا بنعمل إيه؟

بننفذ عملية:

POST /auth/refresh

لما الـ Access Token يخلص.

ليه؟

لأن المستخدم لسه مسجل دخول، فمش منطقي نطلب منه يعمل Login كل 15 دقيقة أو كل ساعة.

هنستفيد إيه؟
✅ تجربة استخدام أفضل.
✅ أمان أعلى لأن الـ Access Token عمره قصير.
✅ المستخدم يفضل Logged In لمدة 30 يوم.
المرحلة دي هتنتهي بإيه؟

هنرجع:

{
  "accessToken": "new_access_token"
}

بدون ما المستخدم يحس بأي حاجة.
الهدف

نتأكد إن الـ Session اللي جبناها من قاعدة البيانات صالحة.

لأن ممكن تكون:

اتحذفت.
المستخدم عمل Logout.
انتهت صلاحيتها.

لو حصل أي واحد من دول ⇒ نرفض الطلب.
*/
export const refreshAccessToken = async (
  refreshToken: string
) => {



  // Decode and validate the Refresh JWT. افتح الـ JWT وتأكد إنه صحيح.
  const payload = verifyRefreshToken(refreshToken);


  // Load the user session from the database. هات الـ Session من قاعدة البيانات.
  const session = await RefreshToken.findById(payload.sid);


  /*
      Check if the session is valid. اتأكد إن الـ Session صالحة.
      If the session is not found, revoked, or expired, throw an error. لو الـ Session مش موجودة أو Revoked أو منتهية، ارمي Error.
      جبنا الـ Session من Database.
    دلوقتي بنتأكد إنها صالحة.
    ليه؟

    لأن ممكن:

    الـ User عمل Logout.
    الـ Admin لغى الجلسة.
    الـ Session انتهت مدتها.
    أو الـ Session اتحذفت.

    في كل الحالات دي مينفعش نطلع Access Token جديد.

    بعد الخطوة دي هيترتب عليها إيه؟

    بما إن الـ Session بقت سليمة، يبقى نقدر نعمل الخطوة الأهم:

    Compare Browser Refresh Token
                VS
    Hash stored in Database

    ولو الاتنين متطابقين، يبقى المستخدم فعلاً هو صاحب الجلسة، وساعتها نطلع له Access Token جديد.

  */

  // Ensure the session is still valid.
  if (!session || session.isRevoked || session.expiresAt < new Date()) {
    throw new UnauthorizedError("Invalid session");
  }

  // Verify that the Refresh Token matches the current session.
  // const isRefreshTokenValid = await verifyRefreshToken(session._id, refreshToken);
  const isRefreshTokenValid =
    await verifyRefreshTokenHash(
      session._id,
      refreshToken
    );

  /*
  Browser Refresh Token
          ↓
  Verify JWT              ✅
          ↓
  Get Session             ✅
          ↓
  Validate Session        ✅
          ↓
  Compare Token + Hash    ✅
          ↓
    ┌────┴────┐
  false       true
    ↓           ↓
  Reject      Continue
  */




  // reject the request when the refresh token does (not) match the session
  if (!isRefreshTokenValid) {
    throw new UnauthorizedError("Invalid refresh token");
  }


  // load the user associated with the current session
  const user = await User.findById(session.user);


  if (!user) {
    throw new UnauthorizedError("User not Found");
  }

  /*
  إصدار Access Token جديد
  بنعمل إيه؟
  
  نستخدم بيانات الـ user اللي جبناها علشان نعمل Access Token جديد.
  
  ليه؟
  
  لأن الـ Access Token القديم انتهت صلاحيته، لكن الـ Session والـ Refresh Token ما زالوا صالحين.
  
  هنستفيد إيه؟
  
  المستخدم يكمل استخدام التطبيق من غير Login جديد.
  
  */

  // issue a new acess token for the authenticated user.
  const accessToken = generateAccessToken(
    user._id.toString(),
    user.email,
    user.role
  )

  // return the newly issued access token
  return accessToken;


}

























/*
Refresh JWT
    ↓
Verify JWT
    ↓
Extract sid
    ↓
Find Session
    ↓
Compare Hash
    ↓
Generate New Access Token
    ↓
Return Access Token
*/

/*
Browser
   ↓
Refresh Token Cookie
   ↓
refreshAccessToken()
   ↓
Verify JWT
   ↓
Validate Session
   ↓
Compare Hash
   ↓
Get User
   ↓
Generate New Access Token
   ↓
return accessToken
   ↓
Controller
   ↓
Browser
*/