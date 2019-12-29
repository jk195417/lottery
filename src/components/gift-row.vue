<template lang="html">
  <tr
    :class="{ 'table-active': selected }"
    @click="$store.commit('gifts/select', { id: gift.id })"
  >
    <td v-show="!editMode">
      {{ name }}<br>
      <img
        onerror="this.src=''"
        style="object-fit: cover;"
        :src="gift.imageUrl"
      >
    </td>
    <td v-show="editMode">
      <div class="form-group">
        <label>禮物名稱</label>
        <input
          v-model="name"
          type="text"
          class="form-control"
        >
      </div>
      <div class="form-group">
        <label>照片連結</label>
        <input
          v-model="imageUrl"
          type="text"
          class="form-control"
        >
      </div>
    </td>
    <td v-show="!editMode">
      已抽出 {{ winners.length }}<br>
      剩下 {{ number - winners.length }}<br>
    </td>
    <td v-show="editMode">
      <div class="form-group">
        <label>禮物數量</label>
        <input
          v-model.number="number"
          type="text"
          class="form-control"
        >
      </div>
    </td>
    <td>
      <div
        v-for="(winner, wIndex) in winners"
        :key="wIndex"
        class="btn btn-sm btn-warning m-2"
        :class="{ appeared: winner.appearedAt }"
        @click.stop="$store.commit('winners/appear', { serial: winner.serial })"
      >
        {{ winner.serial }} 號
        <i
          v-show="editMode"
          class="fas fa-times"
          @click.stop="$store.commit('winners/delete', { serial: winner.serial })"
        />
      </div>
    </td>
    <td v-show="!editMode">
      <div
        class="btn btn-sm"
        @click="editMode = true"
      >
        <i class="fas fa-cog" />
      </div>
    </td>
    <td v-show="editMode">
      <div
        class="btn btn-outline-success m-2"
        @click="editMode = false"
      >
        <i class="fas fa-check" />
      </div>
      <div
        class="btn btn-outline-danger m-2"
        @click="$store.commit('gifts/delete', { id })"
      >
        <i class="fas fa-trash-alt" />
      </div>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    gift: { type: Object, required: true },
    index: { type: Number, required: true }
  },
  data: () => ({
    editMode: false
  }),
  computed: {
    selected () {
      return this.gift.id === this.$store.state.gifts.selectedId
    },
    winners () {
      return this.$store.getters['winners/belongsToGift'](this.gift.id)
    },
    name: {
      get () {
        return this.gift.name
      },
      set (name) {
        this.$store.commit('gifts/updateName', { id: this.gift.id, name })
      }
    },
    number: {
      get () {
        return this.gift.number
      },
      set (number) {
        this.$store.commit('gifts/updateNumber', { id: this.gift.id, number })
      }
    },
    imageUrl: {
      get () {
        return this.gift.imageUrl
      },
      set (imageUrl) {
        this.$store.commit('gifts/updateImageUrl', { id: this.gift.id, imageUrl })
      }
    }
  }
}
</script>

<style lang="css">
.gift {
  width: 200px;
  text-align: left;
}

.appeared {
  border-color: gray;
  background-color: gray;
  text-decoration-line: line-through;
}

.appeared:hover {
  border-color: #333333;
  background-color: #cccccc;
}
</style>
