const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const User = require('../Models/UserModel')
const secret = require('../../Config/Secret').getSecret()

function generateJWTToken (params = {}) {
  return jwt.sign(params, secret, { expiresIn: 86400 })
}

class SessionController {
  async store (req, res) {
    try {
      const { email, password } = req.body

      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(400).send({ error: 'user not found' })
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).send({ error: 'invalid password' })
      }

      res.send({ user, token: generateJWTToken({ id: user._id }) })
    } catch (error) {
      return res.status(500).send({ error })
    }
  }
}

module.exports = new SessionController()
