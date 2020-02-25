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
      done(null, existingUser);
    }
    else {
      const user = await User.findOne({ "email": profile.emails[0].value });

      if (user) {
        done(null, false, { 'msg': 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' })
      }
      else {
        const { primechain_address } = await APICall.httpPostMethod('create_entity', {
          "external_key_management": false,
          "generate_rsa_keys": false
        });

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
          "primechain_address": primechain_address.primechain_address
        });

        await newUser.save();
        done(null, newUser);
      }
    }
  } catch (error) {
    done(error, false, error.message);
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
  profileFields: ['name', 'email', 'link', 'locale', 'timezone', 'gender'],
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  if (req.user) {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, async (err, user) => {
          if (err) { return done(err); }
          const { primechain_address } = await APICall.httpPostMethod('create_entity', {
            "external_key_management": false,
            "generate_rsa_keys": false
          });

          await APICall.httpPostMethod('manage_permissions', {
            "action": "grant",
            "primechain_address": primechain_address.primechain_address,
            "permission": "send,receive,issue"
          });
          `${profile.name.givenName} ${profile.name.familyName}`
          user.primechain_address = primechain_address.primechain_address;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.save((err) => {
            req.flash('info', { msg: 'Facebook account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, (err, existingUser) => {
      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }
      User.findOne({ email: profile._json.email }, async (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
          done(err);
        } else {
          const { primechain_address } = await APICall.httpPostMethod('create_entity', {
            "external_key_management": false,
            "generate_rsa_keys": false
          });

          await APICall.httpPostMethod('manage_permissions', {
            "action": "grant",
            "primechain_address": primechain_address.primechain_address,
            "permission": "send,receive,issue"
          });
          const user = new User();
          user.username = `${profile.name.givenName} ${profile.name.familyName}`;
          user.primechain_address = primechain_address.primechain_address;
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken });
          user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
          user.profile.gender = profile._json.gender;
          user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
          user.profile.location = (profile._json.location) ? profile._json.location.name : '';
          user.save((err) => {
            done(err, user);
          });
        }
      });
    });
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  done(null, user);
});
