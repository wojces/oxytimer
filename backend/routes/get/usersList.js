const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.get('/', verifyToken, async (req, res) => {
  try {
    const selectQuery = `select * from users`
    const [mysqlUsers] = await connection.query(selectQuery)

    let users = []

    mysqlUsers.forEach(user => {
      const resUser = {
        id_user: user.id_user,
        first_name: user.first_name,
        last_name: user.last_name,
      }
      users.push(resUser)
    })
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router