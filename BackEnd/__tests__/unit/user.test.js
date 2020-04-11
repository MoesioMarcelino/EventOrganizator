/* eslint-disable */
const request = require('supertest')
const bcrypt = require('bcryptjs')

const App = require('../../src/App')
const Trucate = require('../utils/Trucate')
const Factory = require('../utils/Factory')
const Populate = require('../utils/Populate')
const Administrator = require('../utils/Administrator')

describe('User', () => {
  beforeEach(async done => {
    await Trucate.users()
    done()
  })

  it('should created a user', async done => {
    const response = await request(App)
      .post(`/api/users`)
      .send({
        fullName: 'Foo',
        email: 'test@email.com',
        password: 'mypass'
      })

    expect(response.status).toBe(200)

    done()
  })

  it('should not created a user whit same emails', async done => {
    const user =  await Factory.create()

    const response = await request(App)
      .post(`/api/users`)
      .send({
        fullName: user.name,
        email: user.email,
        password: user.password
      })

    expect(response.status).toBe(400)

    done()
  })

  it('should encrypt user password', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const compareHash = await bcrypt.compare('mypass123', user.password)

    expect(compareHash).toBe(true)

    done()
  })

  it('should return a array of users', async done => {
    const tokenAdministrator = await Administrator.Login()

    await Populate.users(3)

    const response = await request(App)
      .get(`/api/users`)
      .set('Authorization', 'Bearer ' + tokenAdministrator)

    console.log(response.body)

    expect(response.status).toBe(200)

    done()
  })

  it('should not return a array of users when not autheticate as admin', async done => {
    await Populate.users(3)

    const response = await request(App)
      .get(`/api/users`)

    expect(response.status).toBe(401)

    done()
  })

  
  it('should return one user', async done => {
    const tokenAdministrator = await Administrator.Login()

    const user = await Factory.create({
      fullName: 'Foo'
    })

    const response = await request(App)
      .get(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + tokenAdministrator)

    expect(response.status).toBe(200)

    expect(response.body).toHaveProperty('fullName', 'Foo')

    done()
  })

  it('should update a full name user', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const responseLogin = await request(App)
    .post(`api/sessions`)
    .send({
      email: user.email,
      password: 'mypass123'
    })

    const response = await request(App)
      .put(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + responseLogin.token)
      .send({
        fullName: 'Doe'
      })

    expect(response.status).toBe(200)

    expect(response.body.fullName).toBe('Doe')

    done()
  })

  it('should update a email ', async done => {
    const user = await Factory.create()

    const responseLogin = await request(App)
    .post(`api/sessions`)
    .send({
      email: user.email,
      password: 'mypass123'
    })

    const response = await request(App)
      .put(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + responseLogin.token)
      .send({
        email: 'test@email.com'
      })

    expect(response.status).toBe(200)

    expect(response.body.email).toBe('test@email.com')

    done()
  })

  it('should update a user password', async done => {
    const user = await Factory.create()

    const responseLogin = await request(App)
    .post(`api/sessions`)
    .send({
      email: user.email,
      password: 'mypass123'
    })

    const response = await request(App)
      .put(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + responseLogin.token)
      .send({
        password: 'mypass'
      })

    expect(response.status).toBe(200)

    done()
  })

  it('should not update when user not found', async done => {

    const response = await request(App)
      .put(`/api/users/000000000000000000000000`)
      .send({
        fullName: 'Foo'
      })

    expect(response.status).toBe(401)

    done()
  })

  it('should not update email when alredy exists', async done => {
    await Factory.create({
      email: 'test@email.com'
    })

    const user = await Factory.create({
      email: 'test2@email.com'
    })

    const responseLogin = await request(App)
    .post(`api/sessions`)
    .send({
      email: user.email,
      password: 'mypass123'
    })

    const response = await request(App)
      .put(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + responseLogin.token)
      .send({
        email: 'test@email.com'
      })

    expect(response.status).toBe(400)

    done()
  })

  it('should delete a user', async done => {
    const user = await Factory.create()

    const responseLogin = await request(App)
    .post(`api/sessions`)
    .send({
      email: user.email,
      password: 'mypass123'
    })

    console.log(responseLogin.body)

    let response = await request(App)
      .delete(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + responseLogin.token)

      console.log(response.body)

    expect(response.status).toBe(200)

    done()
  })

  it('should not delete a user when not found', async done => {
    const response = await request(App).delete(
      `/api/users/000000000000000000000000`
    )

    expect(response.status).toBe(401)

    done()
  })
  
})
