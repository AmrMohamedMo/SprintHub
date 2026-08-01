/*
1. Generate Refresh Token
        ↓
2. Hash Refresh Token
        ↓
3. Save Hash in Database
        ↓
4. Return Original Refresh Token
        ↓
5. Login Service تحطها في Cookie



User
 │
 ▼
Email + Password
 │
 ▼
Server
 │
 ▼
Verify
 │
 ▼
Generate Tokens
 │
 ├── Access Token → Browser
 │
 └── Refresh Token
        │
        ├── Original → Cookie
        │
        └── Hash → Database

        1. Login
2. Verify Email & Password
3. Generate Access Token + Refresh Token
4. Hash Refresh Token
5. Save Hash in Database
6. Send:
   - Access Token → Browser Memory
   - Refresh Token → HttpOnly Cookie

   1. Model      ← البيانات
2. Validator  ← شكل البيانات
3. Service    ← المنطق
4. Controller ← استقبال الطلب
5. Route      ← فتح الـ Endpoint
6. Test       ← التأكد إنها شغالة
*/

import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import crypto from "node:crypto";
import RefreshToken from "../models/refresh-token.model.js";


/*
1. Generate Refresh Token ✅

2. Hash Refresh Token ✅

3. Save Session in Database ✅

4. Return Refresh Token ⬅️ (إحنا هنا)
والـ Refresh Token مجرد مفتاح للـ Session دي
*/


// Create New Session

export const createRefreshToken = async (userId: Types.ObjectId) => {

  /*
  الإجابة:
  
  مفتاح جديد
  
  يعني أول حاجة نعملها:
  
  Generate Secret Key
  */
  const refreshToken = crypto.randomBytes(64).toString("hex");


  /*
  هل ينفع أخزن المفتاح الحقيقي؟

❌ لا

ليه؟

لو حد دخل Database.

هيلاقي:

Refresh Token

ويقدر يستخدمها.

فنقول:

Original
↓

Hash

زي Password بالظبط.
  */
  const tokenHash = await bcrypt.hash(refreshToken, 10);

  // الـ Function دي وظيفتها الوحيدة: إنشاء Session جديدة، تخزينها بأمان، وإرجاع مفتاح الجلسة للمتصفح.
  await RefreshToken.create({
    // Owner
    user: userId,
    // Hash
    tokenHash,
    // Expiration
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });


  return refreshToken;
}