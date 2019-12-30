import store from '../stores/modules/gifts'

export default class Gift {
  static autoIncrementId () {
    const ids = store.state.gifts.map(gift => gift.id)
    if (ids.length === 0) return 0
    return Math.max(...ids) + 1
  }

  constructor (name, number, imageUrl) {
    this.id = Gift.autoIncrementId()
    this.name = name
    this.number = number
    this.imageUrl = imageUrl
  }
}
