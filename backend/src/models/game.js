const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        autopopulate: {
          maxDepth: 2,
        },
      },
    ],
    active: {
      type: Boolean,
      default: false,
    },
    drawnNumbers: [
      {
        type: Number,
      },
    ],
    admin: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

gameSchema.static('isBelongTo', async function (userId) {
  return this.admin == userId
})

gameSchema.plugin(autopopulate)

module.exports = mongoose.model('Game', gameSchema)
