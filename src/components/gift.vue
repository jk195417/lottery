<template lang="html">
  <div>
    <h3>{{ name }}</h3>
    <winner
      v-for="w in winners"
      v-bind:luckNumber="w.luckNumber"
      v-bind:key="w.luckNumber"
      v-bind:gift="gift.name"></winner>
  </div>
</template>

<script>
import winner from './winner.vue'
export default {
  props: ['min', 'max', 'selectedNumbers', 'name', 'limit', 'winners'],
  components: {
    'winner': winner
  }
}
</script>
