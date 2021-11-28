<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app v-if="loggedIn">
      <v-list>
        <v-list-item
          v-for="(item, i) in items.filter((i) => i.enabled)"
          :key="i"
          :to="localePath(item.to)"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ $tc(item.title.key, item.title.plural ? 2 : 1) | capitalize }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app v-if="loggedIn">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-menu offset-y bottom open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>mdi-translate</v-icon>
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            :to="switchLocalePath(locale.code)"
            v-for="locale in availableLocales"
            :key="locale.code"
            nuxt
            exact
          >
            <v-list-item-content>
              <v-list-item-title v-text="locale.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn icon :to="localePath('/logout')">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-snackbar v-model="showAlert" :color="alert.type" top>
      {{ alert.message | capitalize }}
    </v-snackbar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { LocaleObject } from '@nuxtjs/i18n'
import { PageItem } from '../interfaces/PageItem.interface'

export default Vue.extend({
  data() {
    return {
      drawer: false,
      title: 'GoCommerce',
    }
  },

  computed: {
    ...mapState('auth', ['loggedIn']),
    ...mapState('config', ['config']),
    ...mapState('general', ['alert']),

    availableLocales(): LocaleObject[] {
      return (this.$i18n.locales as LocaleObject[]).filter(
        (i) => i.code !== this.$i18n.locale
      )
    },

    items(): PageItem[] {
      return [
        {
          title: { key: 'dashboard', plural: false },
          icon: 'mdi-view-dashboard',
          to: '/',
          enabled: true,
        },
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

    showAlert: {
      get(): Boolean {
        return Boolean(this.alert.message)
      },
      set() {
        this.$store.commit('general/CLEAR_ALERT')
      },
    },
  },
})
</script>
