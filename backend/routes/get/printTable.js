const express = require('express')
const router = express.Router()
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

router.get('/:idTable', verifyToken, async (req, res) => {
  try {
    const idTable = req.params.idTable
    const selectQuery = `select table_pdf_base64 from tables where id_table=?`
    const [pdfBase64] = await connection.query(selectQuery, [idTable])

    const pdfBuffer = Buffer.from(pdfBase64[0].table_pdf_base64, 'base64')

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="table${idTable}.pdf"`
    });
    res.send(pdfBuffer)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }

})

module.exports = router
