export default class Winner {
  constructor (serial, giftId = null, createdAt = new Date().toISOString(), appearedAt = null) {
    this.serial = serial
    this.giftId = giftId
    this.createdAt = createdAt
    this.appearedAt = appearedAt
  }
}
