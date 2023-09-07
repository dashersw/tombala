const express = require('express')

const Game = require('../models/game')
const GameCard = require('../models/game-card')
const socketServer = require('../socket-connection')

const { ensureSession } = require('./middleware')

const router = express.Router()

router.get('/', ensureSession, async (req, res) => {
  try {
    let query = {}

    let games = await Game.find(query)

    const cards = await GameCard.find({ game: { $in: games.map(g => g._id) } }).populate('user')

    games = games.map(g => g.toJSON())

    games.forEach(game => {
      game.self = game.participants.find(p => p._id.toString() == req.user._id.toString())

      game.ownCard = cards.find(
        c => c.game.toString() == game._id.toString() && c.user._id.toString() == req.user._id.toString()
      )

      if (game.drawnNumbers.length > 1) game.drawnNumbers.length = 1

      game.cards = cards
        .filter(c => c.game._id.toString() == game._id.toString())
        .sort((a, b) => b.markedNumbers.length - a.markedNumbers.length)
    })

    games.sort((a, b) => {
      if (a.active && !b.active) return -1

      return b.drawnNumbers.length - a.drawnNumbers.length
    })

    res.send(games)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.get('/:id', ensureSession, async (req, res) => {
  try {
    let game = await Game.findById(req.params.id)

    const cards = await GameCard.find({ game: game._id }).populate('user')

    game = game.toJSON()

    if (req.user && game.isBelongTo(req.user._id)) {
      game.self = game.participants.find(p => p._id.toString() == req.user._id.toString())

      game.ownCard = game.cards.find(c => c.user._id.toString() == req.user._id.toString())

      if (game.drawnNumbers.length > 1) game.drawnNumbers.length = 1

      game.participants = game.participants.map(p => {
        return {}
      })
    } else {
      game.cards = cards
    }

    res.send(game)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/:id/status', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)

    if (!game) return res.sendStatus(404)

    game.active = req.body.status == 'start'

    await game.save()

    socketServer().emit('new game', req.params.id)

    return res.send(game)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/:id/participants', ensureSession, async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)

    if (!game) return res.sendStatus(404)

    if (game.participants.find(p => p._id == req.user._id)) return res.sendStatus(400)

    await Game.findOneAndUpdate({ _id: req.params.id }, { $push: { participants: req.user._id } })

    await GameCard.create({
      game: req.params.id,
      user: req.user._id,
    })

    socketServer().to(`admin-${game._id}`).emit('new participant', req.params.id)

    return res.send(game)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/:id/numbers', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)

    if (!game) return res.sendStatus(404)

    const allNumbersUpTo90 = Array.from({ length: 90 }, (_, i) => i + 1)

    const availableNumbers = allNumbersUpTo90.filter(n => !game.drawnNumbers.includes(n))

    if (availableNumbers.length === 0) return res.sendStatus(400)

    const drawnNumbersUsed = await GameCard.findOne({ game: game._id, markedNumbers: game.drawnNumbers[0] })

    if (!drawnNumbersUsed)
      game.drawnNumbers.shift()

    const randomAvailableNumber = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]

    game.drawnNumbers.unshift(randomAvailableNumber)

    await game.save()

    socketServer().emit('new draw', req.params.id)

    return res.send(game)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.put('/:gameId/cards/:cardId', ensureSession, async (req, res) => {
  try {
    const card = await GameCard.findOne({ game: req.params.gameId, user: req.user._id, _id: req.params.cardId })

    if (!card) return res.sendStatus(404)

    card.numbers = []

    const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1)

    for (let i = 0; i < 15; i++) {
      const randomIndex = Math.floor(Math.random() * allNumbers.length)
      card.numbers.push(allNumbers[randomIndex])
      allNumbers.splice(randomIndex, 1)
    }

    card.markedNumbers = []

    card.save()

    res.send(card)

    socketServer().to(`admin-${req.params.gameId}`).emit('new card', req.params.gameId)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.put('/:gameId/cards/:cardId/numbers/:number', ensureSession, async (req, res) => {
  try {
    if (req.query.mark != 'true') return res.sendStatus(400)

    const game = await Game.findById(req.params.gameId).lean()

    if (!game) return res.sendStatus(404)

    if (game.drawnNumbers[0] != req.params.number) return res.sendStatus(400)

    const card = await GameCard.findOneAndUpdate(
      {
        game: req.params.gameId,
        user: req.user._id,
        _id: req.params.cardId,
        numbers: req.params.number,
      },
      {
        $addToSet: { markedNumbers: req.params.number },
      },
      { new: true }
    )

    socketServer().to(`admin-${req.params.gameId}`).emit('new user action', req.params.id)

    if (!card) return res.sendStatus(404)

    res.send(card)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

router.post('/', async (req, res) => {
  try {
    const game = await Game.create({
      ...req.body,
      admin: req.user._id,
    })

    res.send(game)
  } catch (e) {
    console.error(e)
    res.sendStatus(500)
  }
})

module.exports = router
