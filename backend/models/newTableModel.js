const mongoose = require('mongoose')

const newTableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
},
  { timestamps: true }
)


module.exports = mongoose.model('newTable', newTableSchema, 'tables')