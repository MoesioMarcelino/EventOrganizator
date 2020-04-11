require('dotenv')
const Event = require('../Models/EventModel')
const User = require('../Models/UserModel')
const Email = require('../../Services/Email')

class SubscriptionController {
  async subscribe (req, res) {
    try {
      const event = await Event.findById(req.params.id)

      if (!event) {
        return res.status(400).send({ error: 'event not found' })
      }

      const user = await User.findById(req.userId)

      await event.enrolleds.map(enrolled => {
        // eslint-disable-next-line eqeqeq
        if (enrolled == user._id) {
          return res.status(400).send({ error: 'user already registered' })
        }
      })

      // eslint-disable-next-line eqeqeq
      if (process.env.NODE_ENV != 'test') {
        Email.send(user.email, `Confirm your event registration at ${event.name}`,
          `<h1>Hi, ${user.fullName}, <a target='_blank' href='${process.env.URL_APP}/confirm-registration/${event._id}/${user._id}'>clik here to confirm!!!<h1></a>`
        )
      }

      event.enrolleds.push(user)
      await event.save()

      req.io.emit('subscription')

      return res.send(event)
    } catch (error) {
      return res.status(500).send({ error })
    }
  }

  async confirmSubscribe (req, res) {
    try {
      const event = await Event.findById(req.params.idEvent)

      if (!event) {
        return res.status(400).send({ error: 'event not found' })
      }

      const user = await User.findById(req.params.idUser)

      await event.confirmedEnrolleds.map(enrolled => {
        // eslint-disable-next-line eqeqeq
        if (enrolled == user._id) {
          return res.status(400).send({ error: 'user already confirmed' })
        }
      })

      event.confirmedEnrolleds.push(user)
      await event.save()

      req.io.emit('subscription')

      return res.send(event)
    } catch (error) {
      return res.status(500).send({ error })
    }
  }

  async unsubscribe (req, res) {
    try {
      const event = await Event.findById(req.params.id)

      if (!event) {
        return res.status(400).send({ error: 'event not found' })
      }

      let enrolledIndex

      await event.enrolleds.map((enrolled, index) => {
        // eslint-disable-next-line eqeqeq
        if (enrolled == req.userId) {
          enrolledIndex = index
        }
      })

      // eslint-disable-next-line eqeqeq
      if (enrolledIndex == undefined) {
        return res.status(400).send({ error: 'user not registered' })
      }

      event.enrolleds.splice(enrolledIndex, 1)

      await event.save()

      req.io.emit('subscription')

      return res.send(event)
    } catch (error) {
      return res.status(500).send({ error })
    }
  }

  async presence (req, res) {
    try {
      const event = await Event.findById(req.params.idEvent)

      if (!event) {
        return res.status(400).send({ error: 'event not found' })
      }

      const user = await User.findById(req.params.idUser)

      await event.presents.map(enrolled => {
        // eslint-disable-next-line eqeqeq
        if (enrolled == user._id) {
          return res.status(400).send({ error: 'user already present' })
        }
      })

      event.presents.push(user)
      await event.save()

      req.io.emit('subscription')

      return res.send(event)
    } catch (error) {
      return res.status(500).send({ error })
    }
  }
}

module.exports = new SubscriptionController()
