سؤال ممتاز جدًا. وده بالضبط النوع اللي عايزك تسأله. 👏

الإجابة: **فيه نقطة لازم نفهمها.**

## 🎯 سؤالك

> هل وجود `comparePassword()` داخل الـ Model يعتبر مشكلة Security؟

## الإجابة المختصرة

> **لا، لو اتعمل صح.**

---

## ليه؟

إحنا **مش حطينا الباسورد جوه الـ Model**.

إحنا حطينا **طريقة المقارنة فقط**.

يعني:

```ts
user.comparePassword(password)
```

من جوه هيعمل:

```ts
bcrypt.compare(password, this.password)
```

والـ Service **ميعرفش** إزاي المقارنة حصلت.

وده في الحقيقة **أحسن** من ناحية التصميم.

---

## الحاجة اللي تبقى غلط

لو عملنا Method زي:

```ts
user.getPassword()
```

أو

```ts
return this.password;
```

❌ ده خطر.

---

## أو لو عملنا

```ts
user.generateJWT()
```

هنا يبدأ يبقى فيه نقاش.

ليه؟

لأن إنشاء JWT مش مسئولية الـ User، دي مسئولية **Auth Service**.

فإحنا مش هنحطها في الـ Model.

---

## قاعدة هتمشي عليها

اسأل نفسك:

> **هل السلوك ده يخص المستخدم نفسه؟**

لو **أيوه** ➜ يبقى Method في الـ Model.

مثل:

```text
✅ comparePassword()
✅ fullName()
✅ isAdmin()
```

لو **لا** ➜ يبقى في Service.

مثل:

```text
❌ sendEmail()
❌ generateJWT()
❌ uploadAvatar()
```

---

### 🏢 الشركات

إحنا هنكون متشددين في SprintHub.

مش أي Function هنحطها في الـ Model.

كل Function هنسأل:

> **هل دي مسئولية الـ User فعلًا؟**

لو الإجابة "لأ"، هتروح للـ Service.

وده اسمه **Single Responsibility Principle (SRP)**، وهنطبقه طول المشروع. 💪



آه، فهمت قصدك. 👌

أنت بتسأل:

> **إزاي الـ User هو اللي يتأكد من الباسورد بتاعه؟ مش ده المفروض الـ Auth Service؟**

والإجابة: **سؤال احترافي جدًا.**

---

## من ناحية الـ Business

أنت صح.

اللي بيعمل Authentication هو:

```text
Auth Service
```

مش الـ User.

---

## طب ليه الشركات بتعمل:

```ts
user.comparePassword(...)
```

لأنهم بيفرقوا بين **Business Responsibility** و **Code Responsibility**.

### الـ Auth Service مسؤوليته:

```text
Login Flow
│
├── يجيب المستخدم
├── يطلب مقارنة الباسورد
├── يولد JWT
└── يرجع النتيجة
```

### أما الـ User Model مسؤوليته:

```text
أنا أعرف أقارن الباسورد بتاعي.
```

هو **مش بيعمل Login**، هو بس بيعرف يقارن كلمة المرور.

---

## مثال

تخيل عندك عربية.

السائق هو:

```text
Auth Service
```

أما الموتور هو:

```text
User Model
```

السائق هو اللي بيقرر يمشي العربية.

لكن الموتور هو اللي يعرف يشغل نفسه.

---

## لو حطينا `bcrypt.compare()` في Auth Service

هيشتغل؟ ✅

أكيد.

بل وفي شركات بتعمل كده.

---

## إحنا ليه اخترنا Model Method؟

لأنه بيدي:

* Encapsulation.
* إعادة استخدام.
* كود أنضف.

لكن **مش هو الحل الوحيد**.

---

### الخلاصة

* **Authentication** = مسئولية `Auth Service`. ✅
* **Password comparison** = سلوك خاص بالـ `User`، لذلك ممكن يبقى Model Method. ✅

وده Pattern مشهور جدًا مع Mongoose وORMs بشكل عام، لكنه اختيار تصميم (Design Choice)، مش قاعدة إجبارية.

**وده النوع من الأسئلة اللي بيفرق فعلًا بين واحد بيحفظ كود وواحد بيفهم Architecture.** 👏





Interview

Q: Why use toJSON.transform?

A: To automatically hide sensitive fields (such as password) from every API response, instead of remembering to remove them in each controller.


---------------------------------


ده معناه إن الاختبار نجح.

## 🎯 بنعمل إيه؟

> **اتأكدنا إن الـ `password` مبقاش بيتبعت للـ Client.**

يعني:

```text id="r2jwyg"
Database
     │
     ▼
User Document
     │
     ▼
toJSON.transform()
     │
     ▼
حذف password
     │
     ▼
Response
```

---

## 🏢 دي تعتبر إيه؟

دي أول **Security Enhancement** في الـ Model.

بدل ما كل Controller يعمل:

```ts
delete user.password;
```

مرة واحدة في الـ Model وخلاص.

---

## 🎤 Interview

ممكن جدًا يتسأل:

> **How do you prevent sensitive fields from being returned?**

الإجابة:

> "I use Mongoose's `toJSON.transform` to automatically remove sensitive fields like `password` from every JSON response."

---

## 📝 اكتب في `LEARNING.md`

### `toJSON.transform`

* **إيه؟**: Mongoose Option.
* **بتعمل إيه؟**: تعدل الـ Object قبل إرساله كـ JSON.
* **ليه؟**: لإخفاء البيانات الحساسة مثل `password`.
* **Professional?**: ✅ نعم.

---

## 🎯 Checkpoint

الـ User Model عندنا دلوقتي فيه:

```text id="0vhs48"
✅ Fields
✅ Methods
✅ TypeScript Types
✅ Password Comparison
✅ Hide Password
```

🎉 أقدر أقول إن **User Model V1 انتهى**.

**الخطوة الجاية** هنرجع للـ Auth ونحسنه، وأول تحسين هيكون تحديث `lastLogin` تلقائيًا بعد نجاح تسجيل الدخول، بحيث يبقى عندنا Audit حقيقي للمستخدمين. 💪





-----------------------
الخطوة 1

بعد:

if (!user) {
  throw new Error("invalid email or password");
}

أضف:

if (!user.isActive) {
  throw new Error("Account is disabled");
}
🤔 ليه؟

لو الـ Admin عمل Disable للمستخدم:

isActive = false

مينفعش يعمل Login.

🏢 في الشركات

بدل حذف المستخدم:

DELETE User ❌

بيعملوا:

isActive = false ✅

عشان يحافظوا على:

Projects
Tasks
Logs
Audit
---------------------------
😂 لا، كده **مشتغلتش**، لكن ده اكتشاف مهم.

## 🎯 بنعمل إيه؟

> **بنكتشف إن الـ Error Handling عندنا محتاج يتحسن.**

أنت رميت:

```ts
throw new Error("Account is disabled");
```

لكن الـ Response رجع:

```json
{
  "message": "internal server Error"
}
```

يعني الـ `errorHandler` بتاعنا **بيحول أي Error إلى 500**.

---

## هل ده غلط؟

❌ أيوه.

لأن:

```text
Account is disabled
```

مش Internal Server Error.

دي المفروض تبقى:

```text
403 Forbidden
```

أو

```text
401 Unauthorized
```

حسب التصميم.

---

## 🏢 في الشركات

عشان كده بيستخدموا:

```text
Custom Error Classes
```

زي:

```text
BadRequestError
UnauthorizedError
ForbiddenError
NotFoundError
```

وبعدين الـ `errorHandler` يعرف يطلع الـ Status المناسب.

---

## 🎯 دي أول Task عندنا

الخطوة الجاية مش Features.

الخطوة الجاية هي:

> **نبني Professional Error Handling System.**

وده هيخلي كل المشروع بعد كده أنضف بكتير.

---

## 💡 Professional Tip (اكتبه في LEARNING.md)

**500 Internal Server Error**

معناه:

> **المشكلة في السيرفر نفسه.**

مش:

* Password غلط.
* User مش موجود.
* Account معطل.

دي كلها أخطاء متوقعة (Expected Errors)، ولازم يبقى ليها Status Codes مختلفة.

---

👏 ودي من أكتر الحاجات اللي بتفرق Backend احترافي عن Backend مبتدئ. إحنا هنصلحها في الخطوة الجاية قبل ما نضيف أي Feature جديد.

-------------------------









ممتاز. 👌

## 🎯 بنعمل إيه؟

> **هنعمل الأب لكل الـ Errors.**

---

## في الملف:

```text
apps/api/src/errors/AppError.ts
```

اكتب:

```ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}
```

---

## كل سطر بيعمل إيه؟

### 1.

```ts
extends Error
```

📌 **إيه؟**

بنورث من Error الأصلي بتاع JavaScript.

📌 **ليه؟**

علشان `AppError` يبقى Error عادي + نضيف عليه حاجات.

---

### 2.

```ts
statusCode
```

📌 **إيه؟**

رقم الـ HTTP Status.

مثال:

```text
400
401
403
404
409
```

📌 **ليه؟**

بدل ما كل Error يبقى 500.

---

### 3.

```ts
super(message);
```

📌 **إيه؟**

بيبعت الرسالة للأب (`Error`).

يعني:

```ts
new AppError(403, "Forbidden")
```

يبقى:

```ts
err.message
```

=

```text
Forbidden
```

---

### 4.

```ts
this.name = this.constructor.name;
```

📌 **إيه؟**

بيخلي اسم الـ Error يبقى اسم الكلاس.

مثال:

```ts
class ForbiddenError extends AppError
```

هيبقى:

```text
err.name

↓

ForbiddenError
```

بدل:

```text
Error
```

وده بيساعد جدًا في الـ Debugging.

---

## 🏢 في الشركات

ده يعتبر **Base Class**.

وكل Error في المشروع هيورث منه.

مثلاً بعد كده:

```text
AppError
│
├── BadRequestError
├── UnauthorizedError
├── ForbiddenError
├── NotFoundError
└── ConflictError
```

📌 اعمله وشغل:

```bash
npx tsc --noEmit
```

وقولي **تم**، وبعدها هنعمل أول Error حقيقي (`ConflictError`).
دي ملاحظة ممتازة، وفعلاً دي الطريقة اللي هنشرح بيها من دلوقتي.

قبل ما نشرح السطور، لازم نعرف **القطعة دي كلها عبارة عن إيه؟**

---

# 🎯 دي عبارة عن إيه؟

دي **Class** اسمها:

```ts
AppError
```

وظيفتها:

> **تمثل أي Error في المشروع، بالإضافة إلى HTTP Status Code.**

يعني بدل ما JavaScript عندها:

```ts
Error
```

إحنا عملنا نسخة أقوى اسمها:

```ts
AppError
```

---

# ليه عملناها؟

الـ `Error` العادي يعرف يخزن:

```ts
message
```

بس.

مثال:

```ts
throw new Error("Email already exists");
```

هو يعرف إن الرسالة:

```text
Email already exists
```

لكن **ميعرفش**:

* هل ده 400؟
* ولا 401؟
* ولا 403؟
* ولا 409؟

---

## إحنا أضفنا له حاجة جديدة

بقينا نقدر نعمل:

```ts
throw new AppError(
  409,
  "Email already exists"
);
```

يعني الـ Object ده بقى يحتوي على:

```text
AppError
│
├── message = "Email already exists"
└── statusCode = 409
```

---

# الصورة الكبيرة

بدل:

```text
Error
│
└── message
```

بقى:

```text
AppError
│
├── message
├── statusCode
└── name
```

---

# ليه سميناه AppError؟

لأنه:

> **الـ Base Error لكل الـ Application.**

يعني أي Error في المشروع هيطلع منه.

بعد شوية هنعمل:

```text
AppError
│
├── BadRequestError
├── UnauthorizedError
├── ForbiddenError
├── NotFoundError
└── ConflictError
```

كلهم هيورثوا منه.

---

# لو شبهناه بحاجة

تخيل إن عندك:

```
سيارة
```

كل العربيات ليها:

* عجلات
* موتور
* كرسي

بعدها تعمل:

```
BMW
Mercedes
Toyota
```

كلهم عربيات.

نفس الفكرة هنا.

```
AppError
```

هو "السيارة".

وبعدين:

```
ConflictError
ForbiddenError
...
```

كلهم أنواع من `AppError`.

---

## 🎯 الخلاصة في سطر

> **`AppError` هو Class أساسي (Base Class) يمثل أي Error في المشروع، ويضيف `statusCode` إلى الـ `Error` العادي حتى يقدر الـ `errorHandler` يرجع HTTP Response الصحيح.**

---

👏 من دلوقتي هنتبع نفس أسلوب الشرح:

1. **دي عبارة عن إيه؟ (الفكرة العامة)**
2. **ليه عملناها؟**
3. **بتستخدم فين؟**
4. **بعد كده نشرح كل سطر.**

وده هيخليك تفهم الـ Architecture الأول، وبعدها تفاصيل الكود.






بالضبط. 👏 ولاحظتك صح.

السطرين دول:

```ts
super(message);
this.name = this.constructor.name;
```

**ملهمش علاقة بـ `statusCode`.**

---

الـ `statusCode` بيتخزن تلقائيًا هنا:

```ts
constructor(
  public statusCode: number,
  message: string
)
```

في TypeScript، لما تكتب:

```ts
public statusCode: number
```

جوه الـ Constructor، TypeScript بيحولها تلقائيًا إلى:

```ts
class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
```

يعني السطر ده:

```ts
public statusCode: number
```

هو اختصار لـ:

```ts
this.statusCode = statusCode;
```

---

### 💡 معلومة مهمة (Interview)

دي اسمها:

> **Parameter Properties**

وهي ميزة في TypeScript بتختصر كتابة:

```ts
this.statusCode = statusCode;
```

بس من غير ما تكتبها بنفسك.






ممتاز. ✅

**وده بالظبط اللي كنا متوقعينه.**

يعني:

* ✅ `ConflictError` اتنفذ.
* ❌ لكن `error.middleware.ts` لسه ميعرفش يتعامل معاه.

---

## 🎯 بنعمل إيه؟

هنعلم الـ `error.middleware.ts` يتعرف على `AppError`.

### 1. افتح:

```text
apps/api/src/middlewares/error.middleware.ts
```

### 2. أضف في أول الملف:

```ts
import { AppError } from "../errors/AppError.js";
```

### 3. بعد جزء الـ `ZodError` مباشرة، أضف:

```ts
if (err instanceof AppError) {
  return res.status(err.statusCode).json({
    message: err.message,
  });
}
```

---

هيبقى ترتيبه كده:

```ts
if (err instanceof ZodError) {
  ...
}

if (err instanceof AppError) {
  ...
}

console.log(err);

return res.status(500).json({
  message: "internal server Error",
});
```

---

## 🧪 نجرب تاني

اعمل Register بنفس الإيميل مرة تانية.

**المفروض يرجع:**

* **Status Code:** `409`
* **Body:**

```json
{
  "message": "Email already exists"
}
```

---

### 📌 في سطر: بنعمل إيه؟

> **بنخلي الـ `errorHandler` يفهم الـ `AppError` ويرجع الـ Status Code الصحيح بدل 500.**





ممتاز جدًا. 👏👏

دي أول مرة نبني **جزء من الـ Infrastructure** في المشروع، ومشى صح.

---

## 🎯 إحنا عملنا إيه؟

```text
Service
    │
throw new ConflictError(...)
    │
    ▼
error.middleware
    │
instanceof AppError
    │
    ▼
statusCode = 409
message = "Email already exists"
    │
    ▼
HTTP Response
```

---

## إيه اللي اتغير؟

قبل:

```ts
throw new Error("Email already exists");
```

⬇️

```http
500 Internal Server Error ❌
```

---

بعد:

```ts
throw new ConflictError("Email already exists");
```

⬇️

```http
409 Conflict ✅
```

---

## دي اسمها إيه؟

> **Centralized Error Handling**

يعني كل الـ Errors بتمر من مكان واحد (`error.middleware.ts`).

---

## 🏢 Professional Tip

أي Backend احترافي لازم يكون فيه:

* ✅ Validation System
* ✅ Error Handling System
* ✅ Authentication System

وإحنا دلوقتي خلصنا واحد منهم.

---

## 🎯 الخطوة الجاية

هنكمل باقي الـ Errors بنفس النظام:

* `UnauthorizedError` → **401**
* `ForbiddenError` → **403**
* `NotFoundError` → **404**
* `BadRequestError` → **400**

وبعدين هنستبدل كل `throw new Error(...)` في المشروع بيهم.

**كل واحد منهم هياخد أقل من دقيقة لأن الـ Architecture خلاص اتبنت.**








أيوه، ولازم نفهم `class` الأول قبل ما نفهم الكود ده.

# 1. ما هو الـ Class؟

الـ `class` هو **قالب (Blueprint)** لإنشاء Objects.

مثال بدون Class:

```ts
const user1 = {
  name: "Amr",
  age: 22,
};

const user2 = {
  name: "Ali",
  age: 25,
};
```

فيه تكرار.

---

## 2. باستخدام Class

```ts
class User {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}
```

إنشاء Object:

```ts
const user1 = new User("Amr", 22);
const user2 = new User("Ali", 25);
```

`new` معناها:

> "أنشئ Object جديد من هذا الـ Class."

---

# 3. الـ constructor

```ts
constructor(name: string, age: number) {
  this.name = name;
  this.age = age;
}
```

دي أول دالة تعمل تلقائيًا عند:

```ts
new User(...)
```

---

# 4. extends

لنفترض عندك:

```ts
class Animal {
  eat() {
    console.log("Eating");
  }
}
```

وتريد Class جديد يرث منه:

```ts
class Dog extends Animal {}
```

الآن:

```ts
const dog = new Dog();

dog.eat();
```

يعمل رغم أن `Dog` لم يكتب `eat()`.

---

# 5. super

لو الـ Parent عنده Constructor:

```ts
class Animal {
  constructor(public name: string) {}
}
```

فالابن لازم يستدعيه:

```ts
class Dog extends Animal {
  constructor(name: string) {
    super(name);
  }
}
```

`super()` يعني:

> "نفذ Constructor الخاص بالأب."

---

# 6. نرجع لكودك

```ts
export class UnauthorizedError extends AppError {
```

يعني:

> أنشأنا Class جديد اسمه `UnauthorizedError` يرث من `AppError`.

---

```ts
constructor(message: string = "Unauthorized") {
```

لو لم ترسل Message:

```ts
new UnauthorizedError();
```

ستكون:

```text
Unauthorized
```

ولو:

```ts
new UnauthorizedError("Invalid Token");
```

ستصبح:

```text
Invalid Token
```

---

ثم:

```ts
super(401, message);
```

يعني:

> استدعِ Constructor الخاص بـ `AppError` وأرسل له:

* `401`
* `message`

---

غالبًا `AppError` شكله:

```ts
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}
```

فلما تكتب:

```ts
throw new UnauthorizedError();
```

فكأنه كتب:

```ts
throw new AppError(
  401,
  "Unauthorized"
);
```

لكن باسم أوضح وأسهل في الاستخدام.

---

## احفظ الفكرة

* `class` = قالب لإنشاء Objects.
* `new` = ينشئ Object من الـ Class.
* `constructor` = أول دالة تُنفذ عند إنشاء الـ Object.
* `extends` = وراثة من Class آخر.
* `super()` = استدعاء Constructor الخاص بالأب.

**وده كل اللي هتحتاجه تقريبًا في SprintHub عن الـ Classes.**








تمام. 👍

## 🎯 بنعمل إيه؟

هنخلص باقي الـ Errors بسرعة، لأنهم نفس الفكرة.

---

## 1. اعمل ملف

```text
apps/api/src/errors/ForbiddenError.ts
```

واكتب:

```ts
import { AppError } from "./AppError.js";

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(403, message);
  }
}
```

---

## 2. اعمل ملف

```text
apps/api/src/errors/NotFoundError.ts
```

واكتب:

```ts
import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(404, message);
  }
}
```

---

## 3. اعمل ملف

```text
apps/api/src/errors/BadRequestError.ts
```

واكتب:

```ts
import { AppError } from "./AppError.js";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(400, message);
  }
}
```

---

## 📝 احفظهم كده

| Error               | Status | نستخدمه إمتى؟                |
| ------------------- | :----: | ---------------------------- |
| `BadRequestError`   |   400  | البيانات اللي بعتها غلط      |
| `UnauthorizedError` |   401  | مش عامل Login أو Token غلط   |
| `ForbiddenError`    |   403  | عامل Login لكن معندكش صلاحية |
| `NotFoundError`     |   404  | المورد مش موجود              |
| `ConflictError`     |   409  | فيه تعارض (زي Email موجود)   |

---

## 🎯 بعد ما تعملهم

شغل:

```bash
npx tsc --noEmit
```

وقولي **تم**.

> **في سطر:** بنبني مكتبة Errors جاهزة هنستخدمها في المشروع كله.









سؤال ممتاز، وده بالضبط سؤال مهندس مش مبرمج مبتدئ.

والإجابة:

> **أيوه، بيعملوا كده، لكن فيه أكتر من أسلوب.**

---

## الأسلوب الأول (الأكثر شيوعًا) ✅

كل Error في ملف.

```text
errors/
│
├── AppError.ts
├── BadRequestError.ts
├── UnauthorizedError.ts
├── ForbiddenError.ts
├── NotFoundError.ts
└── ConflictError.ts
```

**المميزات:**

* واضح.
* سهل البحث.
* سهل الإضافة.
* كل Error له اسم واضح.

وده موجود في مشاريع Node.js كبيرة.

---

## الأسلوب الثاني

ملف واحد:

```ts
export class BadRequestError extends AppError {}
export class UnauthorizedError extends AppError {}
export class ForbiddenError extends AppError {}
...
```

وده مناسب لو المشروع صغير.

---

## الأسلوب الثالث (اللي أنا بفضله للمشاريع الكبيرة)

ملف واحد للـ Status Codes:

```ts
export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  ...
};
```

ثم:

```ts
throw new AppError(
  HttpStatus.CONFLICT,
  "Email already exists"
);
```

---

# هل فيه تكرار؟

**أيوه، فيه تكرار بسيط.**

لكن ده اسمه:

> **Acceptable Duplication**

لأن:

```ts
new ConflictError(...)
```

أوضح من:

```ts
new AppError(409, ...)
```

أول ما تشوف الكود تعرف نوع الخطأ بدون ما تحفظ الأرقام.

---

# لو كنت Tech Lead

كنت هختار:

```
AppError
+
ملف لكل Error
```

لأن مشروعنا هدفه **Production-level**، وهيبقى أسهل في الصيانة لو بعد سنة المشروع بقى فيه 100 ألف سطر كود.

---

## 👏 لكن...

أنا مبسوط إنك سألت السؤال ده.

لأن ده معناه إنك بدأت تفكر في:

> **هل الكود قابل للصيانة؟**

وده أهم من إن الكود "يشتغل" بس.

وده التفكير اللي عايز أوصلك له.

---------------------------------------