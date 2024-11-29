const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId
    const selectQuery = `select * from rescuers where user_creator_id=?`
    const [mysqlRescuers] = await connection.query(selectQuery, userId)

    res.status(200).json(mysqlRescuers)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router