const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const dayjs = require('dayjs')
const verifyToken = require('../../middleware/verifyToken')

router.put('/', verifyToken, async (req, res) => {
  try {
    const { id } = req.body;

    const finished = 1
    const finishedAt = dayjs().format()

    const updateQuery =
      `UPDATE tables SET finished=?, finished_at=? WHERE id_table = (?)`

    await connection.query(updateQuery, [finished, finishedAt, id])

    const responseJSON = { idTable: id, msg: "Finished" }

    res.status(200).json(responseJSON)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router

