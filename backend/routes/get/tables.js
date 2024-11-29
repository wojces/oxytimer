const express = require('express')
const router = express.Router()
const TableModel = require('../../models/updateTableModel')
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    const selectQuery = `select * from tables where user_creator_id=?`
    const [mysqlTables] = await connection.query(selectQuery, userId)
    const mongoTables = await TableModel.find()
    let tableList = []

    mysqlTables.forEach((table, index) => {
      tableList.push({
        id_table: table.id_table,
        user_creator_id: table.user_creator_id,
        name: table.name,
        location: table.location,
        created_at: table.created_at,
        finished_at: table.finished_at,
        finished: table.finished,
        rota_list: mongoTables[index].rotaList
      })
    })

    res.status(200).json(tableList)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }

})

module.exports = router


















//stare
// const express = require('express')
// const router = express.Router()
// const TableModel = require('../../models/UpdateTable')

// router.get('/', async (req, res) => {
//   const tables = await TableModel.find()
//   res.json(tables)
// })

// module.exports = router