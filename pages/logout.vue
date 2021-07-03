<template>
  <h1>Logout</h1>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mounted() {
    this.$store
      .dispatch('auth/logout')
      .then(() => this.$router.push(this.localePath('/login')))
  },
})
</script>