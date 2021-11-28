<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1>{{ $tc('dashboard') | capitalize }}</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="4"
        v-for="(item, i) in items.filter((i) => i.enabled)"
        :key="i"
      >
        <v-btn :to="localePath(item.to)" x-large block>
          <v-icon>{{ item.icon }}</v-icon>
          {{ $tc(item.title.key, item.title.plural ? 2 : 1) | capitalize }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { MetaInfo } from 'vue-meta'
import { PageItem } from '../interfaces/PageItem.interface'

export default Vue.extend({
  head(): MetaInfo {
    return { title: this.$capitalize(this.$tc('dashboard')) }
  },

  computed: {
    ...mapState('config', ['config']),

    items(): PageItem[] {
      return [
        {
          title: { key: 'product', plural: true },
          icon: 'mdi-package-variant-closed',
          to: '/products',
          enabled: this.config.features?.products?.enabled,
        },
        {
          title: { key: 'category', plural: true },
          icon: 'mdi-tag',
          to: '/categories',
          enabled: this.config.features?.categories?.enabled,
        },
        {
          title: { key: 'manufacturer', plural: true },
          icon: 'mdi-factory',
          to: '/manufacturers',
          enabled: this.config.features?.manufacturers?.enabled,
        },
        {
          title: { key: 'event', plural: true },
          icon: 'mdi-calendar',
          to: '/events',
          enabled: this.config.features?.events?.enabled,
        },
        {
          title: { key: 'content', plural: false },
          icon: 'mdi-format-font',
          to: '/content',
          enabled: this.config.features?.content?.enabled,
        },
      ]
    },
  },
})
</script>