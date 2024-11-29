const express = require('express')
const router = express.Router()
const UpdateTable = require('../../models/updateTableModel')
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')


router.put('/', verifyToken, async (req, res) => {
  try {
    const { id, name, location, rotaList } = req.body;

    const selectQuery = `select table_mongo_id from tables where id_table = (?)`
    const [tableMongoId] = await connection.query(selectQuery, [id])
    const idMongo = tableMongoId[0].table_mongo_id

    const updateQuery =
      `UPDATE tables SET name=?, location=? WHERE id_table = (?)`

    await connection.query(updateQuery,
      [name, location, id])

    await UpdateTable.findByIdAndUpdate(idMongo, {
      name,
      location,
      rotaList
    }, { new: true })

    const responseJSON = { idTable: id, msg: 'Saved' }

    res.status(200).json(responseJSON)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

