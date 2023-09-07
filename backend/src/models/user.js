const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    profile: {
      type: mongoose.SchemaTypes.Mixed,
    },
  },
  { timestamps: true }
)

userSchema.plugin(autopopulate)

module.exports = mongoose.model('User', userSchema)
