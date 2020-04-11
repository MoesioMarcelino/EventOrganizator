const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    value:{
      type: Number,
      default: 0
    },
    enrolleds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    confirmedEnrolleds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    presents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startsIn: {
      type: Date,
      required: true
    },
    endsIn: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Event', EventSchema)
