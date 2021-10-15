<template>
  <h1>Logout</h1>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  async mounted() {
    await this.$auth.logout()
  },
})
</script>