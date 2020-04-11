const User = require('../Models/UserModel')

class Administrator {
  async verifyTypeUser (req, res, next) {
    try {
      const user = await User.findById(req.userId)

      return user.role === 'admin'
        ? next()
        : res
          .status(401)
          .send({ error: 'operations restricted to administrators' })
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}

module.exports = new Administrator()
