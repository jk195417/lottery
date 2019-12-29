export default class Gift {
  static generatedId = 0;

  static autoIncrementId () {
    this.generatedId += 1
    return this.generatedId
  }

  constructor (name, number, imageUrl) {
    this.id = Gift.autoIncrementId()
    this.name = name
    this.number = number
    this.imageUrl = imageUrl
  }
}
