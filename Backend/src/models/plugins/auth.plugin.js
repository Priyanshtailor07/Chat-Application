import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const authPlugin = (schema) => {
    schema.pre("save", async function () {
        if (!this.isModified("password")) return;
        this.password = await bcrypt.hash(this.password, 10);
    });

    schema.methods.isPasswordCorrect = async function (password) {
        return await bcrypt.compare(password, this.password);
    };

    schema.methods.generateAccessToken = function () {
        return jwt.sign(
            {
                _id: this._id,
                email: this.email,
                username: this.username,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
            }
        );
    };

    schema.methods.generateRefreshToken = function () {
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
            }
        );
    };
};
