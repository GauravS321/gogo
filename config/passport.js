const passport = require('passport');
const moment = require('moment');
const { Strategy: LocalStrategy } = require('passport-local');
const refresh = require('passport-oauth2-refresh');
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const { User, comparePassword } = require('../src/web/models/users/user');
const APICall = require('../helpers/request');
const { create } = require('../functions/users/account/activity-logs');

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  const user = await User.findOne({ "email": email.toLowerCase() });

  if (!user) {
    return done(null, false, {
      message: req.flash("error_msg", 'Invalid Email / Password')
    });
  }

  const isMatch = await comparePassword(email, password);

  if (isMatch) {
    req.logIn(user, async (err) => {
      if (err) {
        return done(null, false, {
          message: req.flash("error_msg", 'Invalid Email / Password')
        });
      }

      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      ip_arr = ip.split(':');
      ip = ip_arr[ip_arr.length - 1];
      let browser = req.headers['user-agent'];

      await create(email, ip, browser);

      return done(null, user);
    });
  }
  else {
    return done(null, false, {
      message: req.flash("error_msg", 'Invalid Email / Password')
    });
  }
}));

/**
 * Sign in with Google.
 */
const googleStrategyConfig = new GoogleStrategy({
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ "google.id": profile.id });
    if (existingUser) {
      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      ip_arr = ip.split(':');
      ip = ip_arr[ip_arr.length - 1];
      let browser = req.headers['user-agent'];

      await create(existingUser.email, ip, browser);
      done(null, existingUser);
    }
    else {
      const user = await User.findOne({ "email": profile.emails[0].value });
      if (user) {
        done(null, false, { message: req.flash('error_msg', 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.') });
      }
      else {
        const { primechain_address } = await APICall.httpPostMethod('create_entity', {
          "external_key_management": false,
          "generate_rsa_keys": false
        });

        if (primechain_address) {
          await APICall.httpPostMethod('manage_permissions', {
            "action": "grant",
            "primechain_address": primechain_address.primechain_address,
            "permission": "receive"
          });

          // If new user
          const newUser = new User({
            method: 'google',
            google: {
              id: profile.id
            },
            "username": profile.displayName,
            "email": profile.emails[0].value,
            "role": "customer",
            "image": profile.photos[0].value,
            "primechain_address": (primechain_address.primechain_address) ? primechain_address.primechain_address : "",
          });

          await newUser.save();
          let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          ip_arr = ip.split(':');
          ip = ip_arr[ip_arr.length - 1];
          let browser = req.headers['user-agent'];

          await create(newUser.email, ip, browser);
          done(null, newUser);
        }
        else {
          done(null, false, { message: req.flash("error_msg", 'Unable to set blockchain address, please check configuaration') });
        }
      }
    }
  } catch (error) {
    done(null, false, { message: req.flash("error_msg", 'Unable to sign in using google') });
  }
});

passport.use('google', googleStrategyConfig);
//refresh.use('google', googleStrategyConfig);

/**
 * Sign in with Facebook.
 */
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: `/auth/facebook/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {   
    const existingUser = await User.findOne({ "facebook.id": profile.id });

    if (existingUser) {
      let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      ip_arr = ip.split(':');
      ip = ip_arr[ip_arr.length - 1];
      let browser = req.headers['user-agent'];

      await create(existingUser.email, ip, browser);
      done(null, existingUser);
    } else {
      const user = await User.findOne({ email: profile._json.email });

      if (user) {
        done(null, false, { message: req.flash("error_msg", "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.") });
      }
      else {
        const { primechain_address } = await APICall.httpPostMethod('create_entity', {
          "external_key_management": false,
          "generate_rsa_keys": false
        });

        if (primechain_address) {
          await APICall.httpPostMethod('manage_permissions', {
            "action": "grant",
            "primechain_address": primechain_address.primechain_address,
            "permission": "receive"
          });

          // If new user
          const newUser = new User({
            method: 'facebook',
            facebook: {
              id: profile.id
            },
            "username": `${profile._json.first_name} ${profile._json.last_name}`,
            "email": profile._json.email,
            "role": "customer",
            "primechain_address": primechain_address.primechain_address
          });

          await newUser.save();
          let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
          ip_arr = ip.split(':');
          ip = ip_arr[ip_arr.length - 1];
          let browser = req.headers['user-agent'];

          await create(newUser.email, ip, browser);
          done(null, newUser);
        }
        else {
          done(null, false, { message: req.flash("error_msg", 'Unable to set blockchain address, please check configuaration') });
        }
      }
    }
  } catch (error) {
    done(error, false, error.message);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  done(null, user);
});
