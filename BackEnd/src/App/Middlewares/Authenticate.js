const jwt = require('jsonwebtoken')
const secret = require('../../Config/Secret').getSecret()
const { promisify } = require('util')

class Authenticate {
  async verifyToken (req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).send({ error: 'no token provided' })
    }

    const [, token] = authHeader.split(' ')

    try {
      const decoded = await promisify(jwt.verify)(token, secret)

      req.userId = decoded.id

      return next()
    } catch (err) {
      return res.status(401).json({ error: 'Token invalid' })
    }
  }
}

module.exports = new Authenticate()
