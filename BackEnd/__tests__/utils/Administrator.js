const request = require('supertest')
const App = require('../../src/App')

class Administrator {
  async Login () {
    try {
      const response = await request(App)
        .post('/api/users')
        .send({
          fullName: 'admin',
          email: 'admin@email.com',
          password: 'admin'
        })

      console.log(response.body)

      return response.body.token
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new Administrator()
