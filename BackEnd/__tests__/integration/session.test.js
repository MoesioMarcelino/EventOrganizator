/* eslint-disable */
const request = require('supertest')

const App = require('../../src/App')
const Trucate = require('../utils/Trucate')
const Factory = require('../utils/Factory/UserFactory')

describe('User', () => {
  beforeEach(async done => {
    await Trucate.users()
    done()
  })

  it('should return jwt token when authenticated', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const response = await request(App)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'mypass123'
      })

    expect(response.body).toHaveProperty('token')

    done()
  })

  it('should not return jwt token when authenticated fail', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const response = await request(App)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'mypass'
      })

    expect(response.body).not.toHaveProperty('token')

    done()
  })

  it('should authenticate with valid credentials', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const response = await request(App)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'mypass123'
      })

    expect(response.status).toBe(200)

    done()
  })

  it('should not authenticate with invalid credentials', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const response = await request(App)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: '123456'
      })

    expect(response.status).toBe(400)

    done()
  })

  it('should not authenticate when user not found', async done => {
    const response = await request(App)
      .post('/api/sessions')
      .send({
        fullName: 'Foo',
        email: 'test@email.com',
        password: 'mypass'
      })

    expect(response.status).toBe(400)

    done()
  })

  it('should be able to access private routes when authenticated', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })

    const responseLogin = await request(App)
      .post('/api/sessions')
      .send({
        email: user.email,
        password: 'mypass123'
      })

    expect(responseLogin.status).toBe(200)

    await setInterval(() => {}, 5000);

    const responseUpdate = await request(App)
      .put(`/api/users/${user._id}`)
      .set('Authorization', 'Bearer ' + responseLogin.body.token)
      .send({
        fullName: 'Foo'
      })
  
      expect(responseUpdate.status).toBe(200)

    done()
  })

  it('should not be able to access private routes without jwt token', async done => {
    const user = await Factory.create({
      password: 'mypass123'
    })
    
    const response = await request(App)
    .put(`/api/users/${user._id}`)
    .send({
      fullName: 'Foo'
    })

    expect(response.status).toBe(401)

    done()
  })

  it('should not be able to access private routes with jwt token split error', async done => {
    const response = await request(App)
      .get('/api/app')
      .set('Authorization', '123 123 123')

    expect(response.status).toBe(401)

    done()
  })

  it('should not be able to access private routes when jwt token malformatted', async done => {
    const response = await request(App)
      .get('/api/app')
      .set('Authorization', '123123')

    expect(response.status).toBe(401)

    done()
  })

  it('should not be able to access private routes with invalid jwt token', async done => {
    const response = await request(App)
      .get('/api/app')
      .set('Authorization', 'Bearer 123123')

    expect(response.status).toBe(401)

    done()
  })
})
