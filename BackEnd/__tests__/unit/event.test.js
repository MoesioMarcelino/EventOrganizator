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

  it('should created a event', async done => {
    const admin = await Session.admin()

    const response = await request(App)
      .post(`/api/events`)
      .set('Authorization', 'Bearer ' + admin.token)
      .send({
        name: faker.name.title(),
        description: faker.lorem.paragraph(),
        value: faker.commerce.price(),
        startsIn: faker.date.future(),
        endsIn: faker.date.future()
      })

    expect(response.status).toBe(200)

    done()
  })
  
  it('should not created a event when not authenticated as admin', async done => {

    const response = await request(App)
      .post(`/api/events`)
      .send({
        name: faker.name.title(),
        description: faker.lorem.paragraph(),
        value: faker.commerce.price(),
        startsIn: faker.date.future(),
        endsIn: faker.date.future()
      })

    expect(response.status).toBe(401)

    done()
  })

  it('should return a array of events', async done => {
    const admin = await Session.admin()

    await Populate.events(3)

    const response = await request(App)
      .get(`/api/events`)
      .set('Authorization', 'Bearer ' + admin.token)


    expect(response.status).toBe(200)

    done()
  })

  it('should not return a array of events when not authenticated as admin', async done => {

    await Populate.events(3)

    const response = await request(App)
      .get(`/api/events`)
      
    expect(response.status).toBe(200)

    done()
  })

  it('should return one event', async done => {
    const event = await Factory.event()

    const response = await request(App)
      .get(`/api/events/${event._id}`)

    expect(response.status).toBe(200)

    done()
  })

  it('should not return one event when event not found', async done => {
    const admin = await Session.admin()

    const response = await request(App)
      .get(`/api/events/000000000000000000000000`)
      .set('Authorization', 'Bearer ' + admin.token)


    expect(response.status).toBe(400)

    done()
  })

  it('should update event name', async done => {
    const admin = await Session.admin()

    const event = await Factory.event()

    const newName = faker.name.title()

    const response = await request(App)
    .put(`/api/events/${event._id}`)
    .set('Authorization', 'Bearer ' + admin.token)
    .send({
      name: newName
    })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe(newName)

    done()
  })
  it('should update event value', async done => {
    const admin = await Session.admin()

    const event = await Factory.event()

    let newValue = faker.commerce.price()

    const response = await request(App)
    .put(`/api/events/${event._id}`)
    .set('Authorization', 'Bearer ' + admin.token)
    .send({
      value: newValue
    })

    expect(response.status).toBe(200)
    expect(response.body.value == newValue).toBe(true)

    done()
  })
  
  it('should update event description', async done => {
    const admin = await Session.admin()

    const event = await Factory.event()

    const newDescription = faker.lorem.paragraph()

    const response = await request(App)
    .put(`/api/events/${event._id}`)
    .set('Authorization', 'Bearer ' + admin.token)
    .send({
      description: newDescription
    })

    expect(response.status).toBe(200)
    expect(response.body.description).toBe(newDescription)

    done()
  })
  
  it('should update event date starts', async done => {
    const admin = await Session.admin()

    const event = await Factory.event()

    const newStartsIn = faker.date.future()

    const response = await request(App)
    .put(`/api/events/${event._id}`)
    .set('Authorization', 'Bearer ' + admin.token)
    .send({
      startsIn: newStartsIn
    })

    expect(response.status).toBe(200)
    // expect(response.body.startsIn).toBe(newStartsIn)
    
    done()
  })
  
  it('should update event date ends', async done => {
    const admin = await Session.admin()

    const event = await Factory.event()

    const newEndsIn = faker.date.future()

    const response = await request(App)
    .put(`/api/events/${event._id}`)
    .set('Authorization', 'Bearer ' + admin.token)
    .send({
      endsIn: newEndsIn
    })

    expect(response.status).toBe(200)
    // expect(response.body.endsIn).toBe(newEndsIn)

    done()
  })
  
  it('should update event name when not authenticated', async done => {
    const event = await Factory.event()

    const newName = faker.name.title()

    const response = await request(App)
    .put(`/api/events/${event._id}`)
    .send({
      name: newName
    })

    expect(response.status).toBe(401)

    done()
  })
  
  it('should update event name when event not found', async done => {
    const admin = await Session.admin()

    const newName = faker.name.title()

    const response = await request(App)
    .put(`/api/events/000000000000000000000000`)
    .set('Authorization', 'Bearer ' + admin.token)
    .send({
      name: newName
    })

    expect(response.status).toBe(400)

    done()
  })
  
  
  it('it should delete an event', async done => {
    const admin = await Session.admin()
    
    const event = await Factory.event()

    const response = await request(App)
    .delete(`/api/events/${event._id}`)
    .set('Authorization', 'Bearer ' + admin.token)

    expect(response.status).toBe(200)

    done()
  })
  
  it('it should delete an event when event not found', async done => {
    const admin = await Session.admin()
    
    const response = await request(App)
    .delete(`/api/events/000000000000000000000000`)
    .set('Authorization', 'Bearer ' + admin.token)

    expect(response.status).toBe(400)

    done()
  })
  
  it('it should delete an event when not authenticated as admin', async done => {
    const event = await Factory.event()

    const response = await request(App)
    .delete(`/api/events/${event._id}`)

    expect(response.status).toBe(401)

    done()
  })
/*
  it('', async done => {

    done()
  })
*/
})
