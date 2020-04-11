const faker = require('faker')
const User = require('../../src/App/Models/UserModel')
const Event = require('../../src/App/Models/EventModel')

class Populate {
  async users (quantity) {
    let users = []

    for (let i = 0; i < quantity; i++) {
      let user = await User.create({
        fullName: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password()
      })

      users = [...users, user]
    }

    return users
  }
  async events (quantity) {
    const user = await User.create({
      fullName: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    })    

    let events = []

    for (let i = 0; i < quantity; i++) {
      let event = await Event.create({
        name: faker.name.title(),
        description: faker.lorem.paragraph(),
        value: faker.commerce.price(),
        creator: user,
        startsIn: faker.date.future(),
        endsIn: faker.date.future()
      })

      events = [...events, event]
    }

    return events
  }
}
module.exports = new Populate()
