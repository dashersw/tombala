const express = require('express')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oidc')
const UserModel = require('../models/user')
const { ensureSession } = require('./middleware')

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async function verify(issuer, profile, cb) {
      let user

      try {
        user = await UserModel.findOne({ googleId: profile.id })
      } catch (e) {
        return cb(e)
      }

      if (user) return cb(null, user)

      try {
        user = await UserModel.create({
          name: profile.displayName,
          googleId: profile.id,
          email: profile.emails[0].value,
          profile,
        })

        return cb(null, user)
      } catch (e) {
        return cb(e)
      }
    }
  )
)

passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user._id)
  })
})

passport.deserializeUser(async (userId, cb) => {
  const user = await UserModel.findById(userId)

  if (!user) return cb(new Error('User not found'))

  return cb(null, user)
})

const router = express.Router()

router.get('/login/federated/google', passport.authenticate('google', { failWithError: true }))

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    successReturnToOrRedirect: '/',
    failureRedirect: 'https://tombala.gg',
  })
)

router.get('/me', ensureSession, (req, res) => {
  res.json(req.user)
})

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)

    return res.redirect('/')
  })
})

module.exports = router
