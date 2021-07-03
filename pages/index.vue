<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1>{{ $tc('dashboard') | capitalize }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  head() {
    return { title: this.$capitalize(this.$tc('dashboard')) }
  },
})
</script>