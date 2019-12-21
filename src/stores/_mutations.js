function sortWinnerNumber (state, giftIndex) {
  let hasTaken = []
  let hasNotTaken = []
  state.Gifts[giftIndex].winners.forEach(
    winner => {
      if (winner.hasTakenGift) {
        hasTaken.push(winner)
      } else {
        hasNotTaken.push(winner)
      }
    }
  )
  state.Gifts[giftIndex].winners = hasNotTaken.concat(hasTaken)
}


export default {
  

  m_addGift (state, gift) {
    state.Gifts.push(gift)
  },

  m_addWinnerToGift (state, { selectedGiftID, winner }) {
    state.Gifts[selectedGiftID].winners.push(winner)
    sortWinnerNumber(state, selectedGiftID)
  },

  m_deleteGift (state, giftIndex) {
    state.Gifts.splice(giftIndex, 1)
  },

  m_deleteWinnerFromGift (state, { giftIndex, winnerIndex }) {
    state.Gifts[giftIndex].winners.splice(winnerIndex, 1)
  },

  m_setWinnerHasTakenGift (state, { winnerID, giftIndex }) {
    let gID = giftIndex
    let wID = winnerID
    let winnerNum = state.Gifts[gID].winners[wID].serial
    let hasTaken = state.Gifts[gID].winners[wID].hasTakenGift

    try {
      state.Gifts[gID].winners[wID].hasTakenGift = !hasTaken

      if (hasTaken) {
        window.alert(`已更改 ${winnerNum} 號為「未領取」`)
      }

      sortWinnerNumber(state, giftIndex)

    } catch (error) {
      console.log(error)
      window.alert('Error: this number has been deleted')
    }
  },

  m_sortWinnerNumber () {
    sortWinnerNumber(state, giftIndex)
  },

  m_updateGiftName (state, { giftIndex, name }) {
    state.Gifts[giftIndex].name = name
  },

  m_updateGiftNumber (state, { giftIndex, number }) {
    state.Gifts[giftIndex].number = number
  },

  m_updateGiftImageURL (state, { giftIndex, imageUrl }) {
    state.Gifts[giftIndex].imageUrl = imageUrl
  },

  m_updateGiftWinners (state, { giftIndex, newWinners }) {
    state.Gifts[giftIndex].winners = newWinners
  }
}
