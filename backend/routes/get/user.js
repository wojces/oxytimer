const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.userId

    const selectQuery = `select * from users where id_user = ?`
    const [mysqlUser] = await connection.query(selectQuery, [userId])

    const resUser = {
      id_user: mysqlUser[0].id_user,
      email: mysqlUser[0].email,
      first_name: mysqlUser[0].first_name,
      last_name: mysqlUser[0].last_name,
      created_at: mysqlUser[0].created_at,
    }

    res.status(200).json(resUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router