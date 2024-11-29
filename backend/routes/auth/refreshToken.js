const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')


router.post('/', async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken

    if (refreshToken == null) {
      return res.status(401).json({ message: 'missing refresh token' })
    }

    jwt.verify(refreshToken, process.env.ACCESS_TOKEN_REFRESH_KEY,
      (err, user) => {
        if (err) {
          return res.status(403).json({ message: 'invalid refresh token' })
        }

        const newAccesToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRES_IN });

        res.status(200).json({ access_token: newAccesToken })
      })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router