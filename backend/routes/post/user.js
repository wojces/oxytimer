const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const bcrypt = require('bcrypt')
const generatePassword = require('../../utils/passwordGenerator')

router.post('/', async (req, res) => {
  try {
    const { body } = req;

    const password = generatePassword(7)

    const hashedPassword = await bcrypt.hash(password, 10)
    const data = [
      body.email,
      hashedPassword,
      body.firstName ? body.firstName : '',
      body.lastName ? body.lastName : ''
    ]

    const insertQuery = `insert into users (email, password, first_name, last_name) values (?)`

    const [mysqlResult] = await connection.query(insertQuery, [data])

    console.log('Utworzono nowego usera z id: ' + mysqlResult.insertId)
    const responseJSON = { email: body.email, password: password }

    res.status(200).send(responseJSON)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router



