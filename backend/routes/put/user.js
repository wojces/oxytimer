const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const bcrypt = require('bcrypt')
const verifyToken = require('../../middleware/verifyToken')

router.put('/', verifyToken, async (req, res) => {
  try {
    const { body } = req;

    const oldPassword = body.oldPassword
    const newPassword = body.newPassword
    const userId = req.userId

    const selectQuery = `select password from users where id_user=?`
    const [userPassword] = await connection.query(selectQuery, userId)

    const passwordCheck = await bcrypt.compare(oldPassword, userPassword[0].password)

    if (!passwordCheck) {
      return res.status(401).json({ message: 'Password is not valid' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const insertQuery = `UPDATE users SET password=? WHERE id_user=?`

    const [mysqlResult] = await connection.query(insertQuery, [hashedPassword, userId])

    console.log('Zmieniono hasło usera: ' + userId)

    res.status(200).send({ message: "Ok" })

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
})

module.exports = router



