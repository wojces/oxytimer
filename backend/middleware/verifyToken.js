const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) {
    return res.status(401).json({ message: 'missing authentication token' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_PUBLIC_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'invalid authentication token' })
    }
    req.userId = decoded.id
    next()
  })

}

module.exports = verifyToken

