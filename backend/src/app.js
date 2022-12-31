const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const session = require('express-session')
const MongoStore = require('connect-mongo')
const helmet = require('helmet')
const { sanitize } = require('express-mongo-sanitize')

const passport = require('passport')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const gamesRouter = require('./routes/games')

require('./database-connection')

const app = express()
app.use(helmet())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', (req, res, next) => {
  req.body = sanitize(req.body)
  req.headers = sanitize(req.headers)
  req.params = sanitize(req.params)

  next()
})

app.use(
  session({
    secret: 'tombala session secret',
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_CONNECTION_STRING,
      stringify: false,
    }),
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.authenticate('session'))

app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/games', gamesRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
/* eslint-disable-next-line */
app.use((err, req, res, next) => {
  const error = {
    status: err.status || 500,
    message: err.message,
  }

  if (req.app.get('env') === 'development') {
    error.stack = err.stack
  }

  res.status(error.status)

  res.send(error)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

module.exports = app
