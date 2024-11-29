const express = require('express')
const router = express.Router()
const rescuerSchema = require('../../utils/rescuerSchema')
const { validationResult, checkSchema, checkExact } = require('express-validator')
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.put('/:idRescuer', checkExact(checkSchema(rescuerSchema)), verifyToken,
  async (req, res) => {
    try {

      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(400).json({ message: 'Nie uzupełniono wszystkich wymaganych pól' });
      }

      const { firstName, lastName, unit, location, commanderFirstName, commanderLastName, IN } = req.body;
      const id = req.params.idRescuer

      const updateQuery = `UPDATE rescuers SET first_name=?, last_name=?,unit=?, location=?, commander_first_name=?, commander_last_name=?, in_pressure=? WHERE id_rescuer=?`

      await connection.query(updateQuery, [firstName, lastName, unit, location, commanderFirstName, commanderLastName, IN, id])

      console.log('Zaktualizowano dane ratownika z id: ' + id)
      const responseJSON = { idRescuer: id }

      res.status(200).send(responseJSON)

    } catch (error) {
      res.status(500).json({ message: error.message })
    }

  })

module.exports = router
