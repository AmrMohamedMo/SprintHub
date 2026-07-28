import bcrypt from "bcryptjs";
import { Schema, Model, model, HydratedDocument } from "mongoose";

// "خلينا نوصف شكل الـ Object قبل ما نستخدمه."
// هو مخطط (Blueprint) يصف شكل الـ Object.
// Interface = وصف لشكل الـ Object، يستخدمه TypeScript للتحقق من صحة الكود، ويختفي بعد التحويل إلى JavaScript.
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  avatar: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: Date | null;
}

// بتوصف الـ Functions الموجودة داخل الـ User Model.
export interface IUserMethods {
  // ترجع Promise، وعندما تكتمل ستكون النتيجة true أو false.
  // الدالة لن ترجع boolean
  // مباشرة، بل سترجع Promise، 
  // وعندما تنتهي ستكون النتيجة boolean.
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// بتقول إن الـ Model بتاع User فيه Data + Methods.
// ليه؟
// علشان Mongoose يربط بين الـ Schema والـ Methods.
type UserModel = Model<IUser, {}, IUserMethods>;

// دي النسخة الحقيقية من الـ User اللي بترجع من MongoDB.
// UserDocument المستخدم الحقيقي القادم من MongoDB
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

// const userSchema = new Schema(
/*
علشان Mongoose يعرف:
البيانات (IUser)
الـ Methods (IUserMethods)
الـ Model (UserModel)
*/
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  // Schema Fields.
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minLength: 8
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    // user img
    avatar: {
      type: String,
      default: null
    },
    // if user disable account
    isActive: {
      type: Boolean,
      default: true,
    },
    // email 2fa
    // هل الإيميل متأكد منه ولا لأ؟
    emailVerified: {
      type: Boolean,
      default: true
    },
    // كل مرة المستخدم يعمل Login ناجح، هنحدثه:
    // موجود في أغلب الأنظمة لأنه بيساعد Monitoring
    // To track user activity, improve security, and provide auditing
    lastLogin: {
      type: Date,
      default: null
    }

  },
  // Schema Options.
  {
    timestamps: true,
    // هنمنع إرسال الـ password في أي Response.
    toJSON: {
      // "سيبني، أنا عارف إن ret Object عادي، وأنا حر أمسح منه اللي أنا عايزه."
      // doc لأننا مش بنستخدمه.
      transform(_doc, ret:Record<string,any>) {
        delete ret.password;
        return ret;
      }
    }
  }
);

/*
بدل:

const isPasswordValid = await bcrypt.compare(
  password,
  user.password
);
هيبقى:

const isPasswordValid = await user.comparePassword(password);


هنستخدم الـ Method اللي عملناه بدل bcrypt.compare() في auth.service.ts.
Interview
ليه عملناها؟

لأن مقارنة الباسورد هي سلوك (Behavior) خاص بالمستخدم، فمكانها الطبيعي داخل الـ User Model.
Q: Why put comparePassword() in the model?

A: Because password comparison is behavior that belongs to the User entity, 
keeping business logic close to the data and improving reusability.


🏢 Production

وده اسمه:

Encapsulation

يعني الـ Model بيخفي التفاصيل الداخلية، واللي بره بيتعامل مع API بسيطة.

🎤 Interview

Q: What is Encapsulation in this example?

A:

The service doesn't know how password comparison works. It only calls user.comparePassword(). The implementation details are encapsulated inside the model.
*/
userSchema.method(
  "comparePassword",
  async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password)
  }
);



const User = model("User", userSchema);
export default User;

