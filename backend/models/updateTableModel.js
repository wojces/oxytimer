const mongoose = require('mongoose')

const rescuerSchema = new mongoose.Schema({
  rescuerId: { type: String, required: true },
  name: { type: String, required: true },
  IN: { type: Number, required: true },
  k: [{ type: Number, }],
  OUT: { type: Number },
}, { _id: false })

const rotaSchema = new mongoose.Schema({
  currentState: { type: Number, required: true },
  name: { type: String, required: true },
  inspection: {
    air: { type: Boolean },
    communication: { type: Boolean },
    entryReport: { type: Boolean },
    equipment: { type: Boolean },
    lights: { type: Boolean },
    signals: { type: Boolean },
  },
  alarmCanPlay: [Boolean || null],
  timestamps: {
    IN: { type: Number },
    k: [
      { type: Number }
    ],
    OUT: { type: Number },
    estimatedExitTime: { type: Number },
  },
  rescuers: [rescuerSchema],
  avgPressureConsumption: [Number]

}, { _id: false })

const updateTableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  rotaList: [rotaSchema]
},
  { timestamps: true }
)


module.exports = mongoose.model('updateTable', updateTableSchema, 'tables')