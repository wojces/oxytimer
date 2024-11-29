const express = require('express')
const router = express.Router()
const NewTable = require('../../models/newTableModel')
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')


router.post('/', verifyToken, async (req, res) => {
  try {
    const { body } = req;
    const userCreatorId = req.userId

    const table = new NewTable({ ...body })
    const mongoResult = await table.save()

    const insertQuery =
      `insert into tables (table_mongo_id, user_creator_id, name, location) values (?)`
    const data =
      [mongoResult._id.valueOf(), userCreatorId, body.name, body.location]

    const [mysqlResult] = await connection.query(insertQuery, [data])

    console.log('Utworzono tabele z id: ' + mysqlResult.insertId)
    const responseJSON = { idTable: mysqlResult.insertId, msg: 'Added' }

    res.status(200).json(responseJSON)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router