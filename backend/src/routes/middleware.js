function ensureSession(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next()

  return res.send(401, 'Unauthorized')
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated() && req.user.isAdmin) return next()

  return res.send(401, 'Unauthorized')
}

module.exports = { ensureSession, ensureAdmin }
