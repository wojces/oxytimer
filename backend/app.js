const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors')

const getRescuersRouter = require('./routes/get/rescuers')
const createRescuerRouter = require('./routes/post/rescuers')
const editRescuerRouter = require('./routes/put/rescuers')
const deleteRescuerRouter = require('./routes/delete/rescuers')
const getTablesRouter = require('./routes/get/tables')
const updateTableRouter = require('./routes/put/tables')
const createUserRouter = require('./routes/post/user')
const changeUserPasswordRouter = require('./routes/put/user')
const getUserRouter = require('./routes/get/user')
const createTableRouter = require('./routes/post/tables')
const loginRouter = require('./routes/auth/login')
const getSingleTableRouter = require('./routes/get/singleTable')
const getUsersListRouter = require('./routes/get/usersList')
const finishTableRouter = require('./routes/put/finishTable')
const printTableRouter = require('./routes/get/printTable')
const saveToPdfRouter = require('./routes/put/saveToPdf')
const refreshTokenRouter = require('./routes/auth/refreshToken')

app.use(express.json());

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Request-Method', '*');
  res.set('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.set('Access-Control-Allow-Headers', '*')
  next()
})

// conntect to mongodb
const mongoose = require('mongoose')
const dbUrl = require('./utils/getUrl')

mongoose
  .connect(dbUrl(), { dbName: 'rotadb' })
  .then(() => app.listen(4000))
  .catch((err) => console.log(err))

// get rescuers list
app.use('/getRescuers', getRescuersRouter)

// create rescuer
app.use('/createRescuer', createRescuerRouter)

// delete rescuer
app.use('/deleteRescuer', deleteRescuerRouter)

// edit rescuer data
app.use('/editRescuer', editRescuerRouter)

// get tables
app.use('/getTables', getTablesRouter)

// get single table
app.use('/getSingleTable', getSingleTableRouter)

// create new table
app.use('/createTable', createTableRouter)

// update table
app.use('/updateTable', updateTableRouter)

// create user
app.use('/createUser-wfExCs/GFTvIH629lorP', createUserRouter)

// change user password
app.use('/changeUserPassword', changeUserPasswordRouter)

// get user
app.use('/getUser', getUserRouter)

// get users list
app.use('/getUsersList', getUsersListRouter)

// user login 
app.use('/login', loginRouter)

// finish table
app.use('/finishTable', finishTableRouter)

// print table
app.use('/printTable', printTableRouter)

// save to pdf
app.use('/saveToPdf', saveToPdfRouter)

// refresh token
app.use('/refreshToken', refreshTokenRouter)





