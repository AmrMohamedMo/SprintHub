import { model, Schema, Types } from "mongoose";

export interface IRefreshToken {
  user: Types.ObjectId;
  tokenHash: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};



const refreshTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  tokenHash: {
    type: String,
    require: true
  },
  isRevoked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    require: true
  }
}, {
  timestamps: true
});

refreshTokenSchema.index({ user: 1 });

refreshTokenSchema.index(
  { expiresAt: 1, },
  { expireAfterSeconds: 0 }
)

const RefreshToken = model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;