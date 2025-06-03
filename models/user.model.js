import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
   airdrops: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Airdrop',
    }
  ],
  verificationToken: { type: String },
});

export default mongoose.model("User", userSchema);
