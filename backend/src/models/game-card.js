const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const gameCardSchema = new mongoose.Schema(
  {
    game: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Game',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    numbers: [
      {
        type: Number,
        default: [],
      },
    ],
    markedNumbers: [
      {
        type: Number,
        default: [],
      },
    ],
  },
  { timestamps: true }
)

gameCardSchema.index({ game: 1, user: 1 }, { unique: true })

gameCardSchema.pre('save', async function (next) {
  if (this.numbers.length > 0) return next()

  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1)

  for (let i = 0; i < 15; i++) {
    const randomIndex = Math.floor(Math.random() * allNumbers.length)
    this.numbers.push(allNumbers[randomIndex])
    allNumbers.splice(randomIndex, 1)
  }

  this.save()

  next()
})

gameCardSchema.plugin(autopopulate)

module.exports = mongoose.model('GameCard', gameCardSchema)
