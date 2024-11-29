const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const rescuerSchema = require('../../utils/rescuerSchema')
const { validationResult, checkSchema, checkExact } = require('express-validator')
const verifyToken = require('../../middleware/verifyToken')


router.post('/', checkExact(checkSchema(rescuerSchema)), verifyToken, async (req, res) => {
  try {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      console.log(errors)
      return res.status(400).json({ message: 'Nie uzupełniono wszystkich wymaganych pól' });
    }

    const { body } = req;
    const userCreatorId = req.userId

    const data = [
      body.firstName,
      body.lastName,
      body.unit,
      body.location,
      body.commanderFirstName,
      body.commanderLastName,
      body.IN,
      userCreatorId
    ]

    const insertQuery = `insert into rescuers (first_name, last_name, unit, location, commander_first_name, commander_last_name, in_pressure, user_creator_id) values (?)`

    const [mysqlResult] = await connection.query(insertQuery, [data])

    console.log('Utworzono nowego ratownika z id: ' + mysqlResult.insertId)
    const responseJSON = { idRescuer: mysqlResult.insertId }

    res.status(200).send(responseJSON)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }


})

module.exports = router