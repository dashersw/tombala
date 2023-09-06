function ensureSession(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next()

  return res.status(401).send('Unauthorized')
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.isAdmin) return next()

  return res.status(401).send('Unauthorized')
}

module.exports = { ensureSession, ensureAdmin }
