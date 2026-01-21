import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/users.models.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    // Check if user exists with the same email
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link googleId to existing user
                        user.googleId = profile.id;
                        // handle avatar if needed
                        if (!user.avatar && profile.photos && profile.photos.length > 0) {
                            user.avatar = profile.photos[0].value;
                        }
                        await user.save();
                    } else {
                        // Create new user
                        user = await User.create({
                            googleId: profile.id,
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "",
                            // Generate a random password or leave empty/handled by schema
                        });
                    }
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

// Serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;
