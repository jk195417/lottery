export default class Winner {
  constructor (serial, giftId = null) {
    this.serial = serial
    this.giftId = giftId
    this.createdAt = new Date().toISOString()
    this.appearedAt = null
  }

  appear (boolean) {
    if (boolean) {
      this.appearedAt = new Date().toISOString()
    } else {
      this.appearedAt = null
    }
  }
}
