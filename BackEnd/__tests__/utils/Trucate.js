const User = require('../../src/App/Models/UserModel')
const Event = require('../../src/App/Models/EventModel')

class Trucate {
  async users () {
    await User.deleteMany()
  }

  async events(){
    await Event.deleteMany()
  }
}

module.exports = new Trucate()
