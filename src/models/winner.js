export default class Winner {
  constructor (serial, giftId = null) {
    this.serial = serial
    this.giftId = giftId
    this.createdAt = new Date().toISOString()
    this.appearedAt = null
  }

  appear () {
    if (this.appearedAt) {
      this.appearedAt = null
    } else {
      this.appearedAt = new Date().toISOString()
    }
  }
}
