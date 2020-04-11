const request = require('supertest')
const App = require('../../src/App')
const Factory = require('./Factory')

class Session {
  async admin () {
    try {
      const user = await Factory.user({ password:'admin', role:'admin' })

      const response = await request(App)
        .post('/api/sessions')
        .send({
          email: user.email,
          password: 'admin'
        })

      return response.body
    } catch (error) {
      console.log(error)
    }
  }

  async user() {
    try{
      const user = await Factory.user({ password:'user' })

      const response = await request(App)
        .post('/api/sessions')
        .send({
          email: user.email,
          password: 'user'
        })

      return response.body
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new Session()
