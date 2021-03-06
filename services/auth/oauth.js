// ----------------------------------------
// import node modules
// ----------------------------------------
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;

// ----------------------------------------
// import local node modules
// ----------------------------------------
const User = require("../../db/model/user");

// ----------------------------------------
// save user data as cookies in user's browser
// ----------------------------------------
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
      // callbackURL: "http://localhost:3000/auth/google/callback",
      callbackURL: "https://harshit-secure-chat-app.herokuapp.com/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.email });
        if (user) {
          return done(null, user);
        } else {
          const newUser = await User.create({
            username: `${profile.given_name}.${profile.id}`,
            firstname: profile.given_name,
            lastname: profile.family_name,
            email: profile.email,
            profile_pic_url: profile.picture,
          });
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
