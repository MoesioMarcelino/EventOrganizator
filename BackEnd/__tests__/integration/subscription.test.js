/* eslint-disable */
const request = require('supertest')
const faker = require('faker')
const App = require('../../src/App')
const Trucate = require('../utils/Trucate')
const Factory = require('../utils/Factory')
const Populate = require('../utils/Populate')
const Session = require('../utils/Session')

describe('Event', () => {
  beforeEach(async done => {
    await Trucate.events()
    await Trucate.users()
    done()
  })

  it('should subscribe a user at a event', async done => {
    const user = await Session.user()
    
    const event = await Factory.event()

    const response = await request(App)
      .post(`/api/subscriptions/${event._id}`)
      .set('Authorization', 'Bearer ' + user.token)

    expect(response.status).toBe(200)

    done()
  })

  it('should not subscribe a user not authenticated at a event', async done => {
    const event = await Factory.event()

    const response = await request(App)
      .post(`/api/subscriptions/${event._id}`)

    expect(response.status).toBe(401)

    done()
  }) 

  it('should not subscribe a user at a event when user not found', async done => {
    const user = await Session.user()
    
    const response = await request(App)
      .post(`/api/subscriptions/000000000000000000000000`)
      .set('Authorization', 'Bearer ' + user.token)

    expect(response.status).toBe(400)

    done()
  })

  it('should confirm a user subscription', async done => {
    const user = await Session.user()
    
    const event = await Factory.event()

    const responseSubscribe = await request(App)
      .post(`/api/subscriptions/${event._id}`)
      .set('Authorization', 'Bearer ' + user.token)

    expect(responseSubscribe.status).toBe(200)

    console.log(user._id)

    const response = await request(App)
    .post(`/api/subscriptions/confirm/${event._id}/${user._id}`)

    // console.log(response)

    expect(response.status).toBe(200)


    done()
  })
})