const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()


router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body

    const selectQuery = `select * from users where email = (?)`
    const [emailCheck] = await connection.query(selectQuery, [email])

    if (emailCheck.length === 0) {
      return res.status(401).json({ message: 'Email is not valid' });
    }

    const user = emailCheck[0]
    const passwordCheck = await bcrypt.compare(password, user.password)

    if (!passwordCheck) {
      return res.status(401).json({ message: 'Password is not valid' });
    }

    const token =
      jwt.sign({ id: user.id_user }, process.env.ACCESS_TOKEN_PRIVATE_KEY, { algorithm: 'RS256', expiresIn: process.env.TOKEN_EXPIRES_IN });

    const refreshToken = jwt.sign(
      { id: user.id_user }, process.env.ACCESS_TOKEN_REFRESH_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    console.log('User logged in!')
    res.status(200).json({ access_token: token, refresh_token: refreshToken })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router