require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
})

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const Database = require('./Database/Database')
const Routes = require('./Routes/Routes')

class App {
  constructor () {
    this.app = express()

    this.server = require('http').createServer(this.app)
    this.io = require('socket.io')(this.server)

    this.database()
    this.middlewares()
    this.routes()

    return this.server
  }

  database () {
    Database.connection()
  }

  middlewares () {
    this.app.use((req, res, next) => {
      req.io = this.io
      next()
    })
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(logger('dev'))
    this.app.use(cookieParser())
    this.app.use(cors())
  }

  routes () {
    this.app.use('/api', Routes.publicRoutes())
    this.app.use('/api', Routes.privateRoutes())
    this.app.use('/api', Routes.AdmRoutes())
  }
}

module.exports = new App()
