const express = require('express')
const router = express.Router()
const fs = require('fs')
const handlebars = require('handlebars')
const pdf = require('html-pdf-node')
const duration = require('dayjs/plugin/duration')
const dayjs = require('dayjs')
const timezone = require('dayjs/plugin/timezone');
const utc = require('dayjs/plugin/utc');
const TableModel = require('../../models/updateTableModel')
const connection = require('../../utils/mysqlConn')
const verifyToken = require('../../middleware/verifyToken')

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);

router.put('/:idTable', verifyToken, async (req, res) => {
  try {
    const idTable = req.params.idTable
    const selectQuery = `select * from tables where id_table=?`
    const [mysqlTable] = await connection.query(selectQuery, [idTable])
    const [mongoTable] = await TableModel.find({ _id: mysqlTable[0].table_mongo_id })
    1
    const selectQueryUser = `select * from users where id_user=?`
    const [tableUser] = await connection.query(selectQueryUser, [mysqlTable[0].user_creator_id])

    const currentDate = dayjs().tz('Europe/Warsaw').format("DD/MM/YYYY, HH:mm");

    //Object data
    const singleTable = {
      userName: tableUser[0].first_name + ' ' + tableUser[0].last_name,
      tableName: mysqlTable[0].name,
      location: mysqlTable[0].location,
      createdAt: dayjs(mysqlTable[0].created_at).format("DD" + "." + "MM" + "." + "YYYY"),
      rotaList: JSON.parse(JSON.stringify(mongoTable.rotaList)),
      finished: mysqlTable[0].finished,
      finishedAt: dayjs(mysqlTable[0].finished_at).format("DD" + "." + "MM" + "." + "YYYY")
    };

    //Handlebars Helpers
    handlebars.registerHelper('indexPlusOne', function (index) {
      return index + 1;
    });
    handlebars.registerHelper('formatToTime', function (value) {
      if (value == null) return '-';
      return dayjs.unix(value).format("HH" + ":" + "mm" + ":" + "ss");
    });
    handlebars.registerHelper('formatToDifferenceTime', function (valueIn, value) {
      if (valueIn == null || value == null) return '-';
      else return "+" + dayjs.duration(value - valueIn, 'seconds').format("HH:mm:ss");
    });
    handlebars.registerHelper('isValueEmpty', function (value) {
      if (value == null) return '-'
      else return value
    })
    handlebars.registerHelper('rotaIsUsed', function (value) {
      if (value == null) return 'Nie'
      else return 'Tak'
    })
    handlebars.registerHelper('countRotaActionTime', function (valueIn, valueOut) {
      if (valueIn == null) return '-'
      else return dayjs.duration(valueOut - valueIn, 'seconds').format("HH:mm:ss");
    })
    handlebars.registerHelper('notEmptyK', function (arrayK) {
      const filteredArrayK = arrayK.filter(k => k != null)
      if (filteredArrayK.length == 0) return false
      else return true
    })
    handlebars.registerHelper('sliceArray', function (array) {
      return array.slice(1)
    })
    handlebars.registerHelper('consumptionMeasurement', function (array, index) {
      const last = array.length - 1
      if (index === 0 && array.length > 1) return 'wejście-k' + (index + 1)
      else if (index == last - 1) return "k" + (index) + "-wyjście"
      else return "k" + (index) + '-' + 'k' + (index + 1)

    })

    //Handlebars compile
    const templateTable = fs.readFileSync('./data/templates/table.html', { encoding: 'utf8', flag: 'r' });
    const compiledTemplate = handlebars.compile(templateTable);
    const filledTable = compiledTemplate(singleTable);

    //Generate PDF buffer
    const tablePDF = await pdf.generatePdf({ content: filledTable },
      {
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; display: flex; justify-content:  space-between;  width: 100%; margin: 0 35px 0 35px">
          <span>${currentDate}</span> OxyTimer
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; padding-top: 5px; text-align: center; width: 100%;">
          Strona - <span class="pageNumber"></span> z <span class="totalPages"></span>
          </div>
        `,
        format: 'A4',
        margin: {
          bottom: 70,
          left: 35,
          right: 35,
          top: 70,
        },
        printBackground: true,
      })

    const pdfToDb = tablePDF.toString('base64')

    const updateQuery =
      `UPDATE tables SET table_pdf_base64=? WHERE id_table = (?)`

    await connection.query(updateQuery, [pdfToDb, idTable])

    const responseJSON = { idTable: idTable, msg: "Saved To PDF" }
    res.status(200).json(responseJSON)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }

})

module.exports = router


//Używane do sprawdzania 
//Save to file PDF
// fs.writeFile("./data/output/table.pdf", tablePDF,
// {
//   encoding: "utf8",
//   flag: "w",
//   mode: 0o666
// },
// (err) => {
//   if (err)
//     console.log(err);
//   else {
//     console.log("File written successfully\n");
//   }
// });

//Save to file HTML
// fs.writeFile("./data/output/table.html", filledTable,
//   {
//     encoding: "utf8",
//     flag: "w",
//     mode: 0o666
//   },
//   (err) => {
//     if (err)
//       console.log(err);
//     else {
//       console.log("File written successfully\n");
//     }
//   });
