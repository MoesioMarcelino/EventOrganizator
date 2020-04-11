class Secret {
  constructor () {
    this._secret = 'ab681ab35f8f6ee19b2c119406982b56'
  }

  getSecret () {
    return this._secret
  }
}

module.exports = new Secret()
