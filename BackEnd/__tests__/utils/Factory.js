const faker = require('faker')
const User = require('../../src/App/Models/UserModel')
const Event = require('../../src/App/Models/EventModel')

class Factory {
  async user (params = {}) {
    const user = await User.create({
      fullName: params.fullName || faker.name.findName(),
      email: params.email || faker.internet.email(),
      password: params.password || faker.internet.password(),
      role: params.role || 'user'
    })

    return user
  }

  async event (params = {}) {
    const user = await this.user()

    const event = await Event.create({
        name: params.name || faker.name.title(),
        description: params.description || faker.lorem.paragraph(),
        value: params.value ||faker.commerce.price(),
        creator: user,
        startsIn: params.startsIn || faker.date.future(),
        endsIn: params.endsIn || faker.date.future()
    })

    return event
  }
}

module.exports = new Factory()
