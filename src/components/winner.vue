<template lang="html">
  <button class="btn btn-lg btn-warning m-2" v-on:click="cancel()">
    {{ serial }}號<span class="close ml-2">&times;</span>
  </button>
</template>

<script>
  export default {
    props: {
      serial: Number,
      gift: String
    },
    methods: {
      cancel: ()=>{

      }
    }
  }
</script>
