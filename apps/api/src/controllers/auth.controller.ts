import { Request, Response } from "express";
import { registerUser, loginUser, refreshAccessToken } from "../services/auth.service.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";


/*
القاعدة الذهبية

أي حاجة خاصة بالـ HTTP تكون في Controller.

مثل:

res.status(...)
res.json(...)
res.cookie(...)
res.clearCookie(...)
req.headers
req.cookies
*/


export const register = async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  res.status(201).json(result)
}

/*
هي مش مسؤولة عن:

Cookie ❌
Response ❌
Status Code ❌

دي مسؤولية الـ Controller.
Login

↓

Controller

↓

loginUser()

↓

Return Tokens ✅

↓

Store Refresh Token in Cookie ⬅️
*/
/*
😂 حاضر.

هقول المهم بس.

---

# 🎯 الهدف

عايزين نخزن الـ Refresh Token في مكان آمن داخل الـ Browser.

```text
Server
   │
   ▼
Browser Cookie
```

وده بيتم بـ:

```ts
res.cookie(...)
```

---

# شكلها

```ts
res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000
});
```

---

# كل Option في سطر

## 1.

```ts
httpOnly: true
```

### معناها

JavaScript **ممنوع** تقرأ الـ Cookie.

```text
document.cookie

❌ مش هيشوفها
```

### ليه؟

لو فيه XSS.

الهاكر مش هيعرف يسرق الـ Refresh Token.

---

## 2.

```ts
secure: true
```

### معناها

الـ Cookie تمشي على:

```text
HTTPS فقط
```

مش:

```text
HTTP
```

### ليه؟

علشان محدش يسرقها وهي ماشية في الشبكة.

---

## 3.

```ts
sameSite: "strict"
```

### معناها

المتصفح **ميبعتش** الـ Cookie لأي Website تاني.

يعني:

```text
myapp.com

✅
```

```text
evil.com

❌
```

### ليه؟

حماية من:

```text
CSRF
```

---

## 4.

```ts
maxAge
```

### معناها

عمر الـ Cookie.

مثلاً:

```text
30 يوم
```

بعدها:

```text
Browser

↓

يحذفها
```

---

# القاعدة الذهبية

```text
httpOnly

↓

يحمي من JavaScript
```

---

```text
secure

↓

يحمي أثناء النقل
```

---

```text
sameSite

↓

يحمي من CSRF
```

---

```text
maxAge

↓

يحدد عمر الـ Cookie
```

---

# اللى الشركات بتعمله

Development

```ts
secure: false
```

Production

```ts
secure: true
```

علشان Localhost بيشتغل HTTP.

---

## هنكتب الكود

في الـ Controller:

```ts
// Store the Refresh Token securely in an HttpOnly Cookie.
res.cookie("refreshToken", result.refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
});
```

**Comment معاه:**

```ts
// Store the Refresh Token securely.
// The browser will send it automatically with future requests.
```

دي أهم 4 Options في الـ Cookie. أي Interview Backend غالبًا هيسألك عنهم.

//------------
النتيجة في الـ Browser

هيبقى عنده:

Cookie

Name:
refreshToken

Value:
a8f3d91e4c5b...




-------------
🎯 Feature: Login with Refresh Token
الهدف الحقيقي

المستخدم يعمل Login، والسيرفر ينشئ Session آمنة ويخليه يقدر يفضل مسجل دخول.

Client Login
      │
      ▼
1. Verify Email & Password
      │
      ▼
2. Generate Access Token
      │
      ▼
3. Create Refresh Session
      │
      ▼
4. Store Refresh Token in HttpOnly Cookie   ← إحنا هنا
      │
      ▼
5. Return Access Token in JSON
      │
      ▼
6. Browser saves Cookie automatically
      │
      ▼
7. Test the whole flow
      │
      ▼
8. Commit

*/

/*
Login
  │
  ▼
Browser عنده:
- Access Token
- Refresh Token (Cookie)

        │
        ▼
Access Token انتهى

        │
        ▼
Frontend يرسل POST /refresh

        │
        ▼
Browser يرسل Cookie تلقائياً

        │
        ▼
Controller

        │
        ▼
Service

        │
        ▼
Database (Session)

        │
        ▼
Verify Refresh Token

        │
        ▼
Generate New Access Token

        │
        ▼
Return Access Token

*/
export const login = async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  // Store the Refresh Token in a secure HttpOnly Cookie.
  // The browser will send it automatically with future requests.
  // res.cookie(name, value, options)
  res.cookie(
    // name
    "refreshToken",
    // value
    result.refreshToken,
    //  options
    {
      // JavaScript ممنوع تقرأ الـ Cookie.
      httpOnly: true,
      // HTTPS فقط
      secure: process.env.NODE_ENV === "production",
      // المتصفح ميبعتش الـ Cookie لأي Website تاني. myapp.com ✅evil.com ❌
      sameSite: "strict",
      // عمر الـ Cookie. 30 يوم
      maxAge: 30 * 24 * 60 * 60 * 1000
    }
  )

  // Return the Access Token in JSON response.
  res.status(200).json({
    accessToken: result.accessToken
  })
}


export const me = (req: Request, res: Response) => {
  res.json({
    user: req.user
  })
};
/*
Request
│
├── headers
├── body
├── params
├── query
└── cookies ✅
*/


/*
Client

↓

Middlewares

↓

Route

↓

Controller

↓

Service

↓

Database









⭐ بص بقى على التشابه الجميل

كل Middleware تقريبًا بيعمل:

Data

↓

Parse / Verify

↓

Attach to req
*/

export const refresh = async (req: Request, res: Response) => {

  // Get the Refresh Token from the HttpOnly Cookie.
  const { refreshToken } = req.cookies;

  // The client must send a Refresh Token Cookie.
  if (!refreshToken) {
    throw new UnauthorizedError("Refresh token is missing");
  }

  // Generate a new Access Token.
  const accessToken = await refreshAccessToken(refreshToken);

  // Return the new Access Token in JSON response.
  res.status(200).json({
    accessToken
  })


}
/*
Refresh Token
    ↓
Cookie
    ↓
Controller
    ↓
Service
    ↓
Verify + Session + Hash
    ↓
generateAccessToken()
    ↓
New Access Token
    ↓
JSON Response
*/