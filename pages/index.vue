<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1>{{ $tc('dashboard') | capitalize }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-btn :to="localePath('/products')" x-large block>
          <v-icon>mdi-package-variant-closed</v-icon>
          {{ $tc('product', 2) | capitalize }}
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn :to="localePath('/categories')" x-large block>
          <v-icon>mdi-tag</v-icon>
          {{ $tc('category', 2) | capitalize }}
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-btn :to="localePath('/manufacturers')" x-large block>
          <v-icon>mdi-factory</v-icon>
          {{ $tc('manufacturer', 2) | capitalize }}
        </v-btn>
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