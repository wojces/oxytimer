const express = require('express')
const router = express.Router()
const TableModel = require('../../models/updateTableModel')
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.get('/:idTable', verifyToken, async (req, res) => {
  try {
    const idTable = req.params.idTable
    const userId = req.userId
    const selectQuery = `select * from tables where id_table=?`
    const [mysqlTable] = await connection.query(selectQuery, [idTable])
    const [mongoTable] = await TableModel.find({ _id: mysqlTable[0].table_mongo_id })

    if (mysqlTable[0].user_creator_id !== userId) {
      res.status(404).json({ message: "Wrong user!" })

    } else {

      const singleTable = {
        id_table: mysqlTable[0].id_table,
        user_creator_id: mysqlTable[0].user_creator_id,
        name: mysqlTable[0].name,
        location: mysqlTable[0].location,
        created_at: mysqlTable[0].created_at,
        rota_list: mongoTable.rotaList,
        finished: mysqlTable[0].finished,
        finished_at: mysqlTable[0].finished_at
      }

      res.status(200).json(singleTable)
    }
  } catch (error) {
    res.status(404).json({ message: error.message })
  }

})

module.exports = router
