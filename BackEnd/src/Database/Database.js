require('dotenv')
const mongoose = require('mongoose')

class Database {
  connection () {
    mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true
    })

    mongoose.set('useCreateIndex', true)
    mongoose.Promise = global.Promise

    if (process.env.NODE_ENV === 'dev') {
      mongoose.connection.on(
        'error',
        console.error.bind(console, 'Connection database error:')
      )
    }
  }
}

module.exports = new Database()
