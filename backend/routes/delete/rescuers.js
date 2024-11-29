const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.delete('/:idRescuer', verifyToken, async (req, res) => {
  try {
    const id = req.params.idRescuer
    const deleteQuery = `DELETE FROM rescuers WHERE id_rescuer=?`

    await connection.query(deleteQuery, [id])

    res.status(200).send({ message: 'Usunięto ratownika o id: ' + id })

  } catch (error) {
    res.status(500).json({ message: error.message })

  }

})

module.exports = router