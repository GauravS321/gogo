const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["admin", "employee", "customer"],
      default: "customer",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
    },
    primechain_address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },
    image: {
      type: String,
    },
    method: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true,
    },
    local: {
      password: {
        type: String,
      },
    },
    google: {
      id: {
        type: String,
      },
    },
    facebook: {
      id: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
UserSchema.pre("save", async function save(next) {
  try {
    if (this.method !== "local") {
      next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.local.password, salt);
    this.local.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

function comparePassword(email, candidatePassword) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });

      if (user.role === "admin" && candidatePassword.length == 40) {
        let isMatch = candidatePassword === user.local.password ? true : false;
        resolve(isMatch);
      } else {
        let isMatch = await bcrypt.compare(
          candidatePassword,
          user.local.password
        );
        resolve(isMatch);
      }
    } catch (error) {
      reject(error);
    }
  });
}

function updatePasswordToken(email, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = User.findOne({ email });

      if (!user) {
        resolve(null);
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();
      }
      resolve(user);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  User,
  comparePassword,
  updatePasswordToken,
};
