<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="general">
            <v-toolbar-title>GoCommerce</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-actions>
            <v-spacer />
            <v-btn align-center justify-center color="general" @click="login">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

export default Vue.extend({
  head(): MetaInfo {
    return { title: 'Login' }
  },

  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
    }
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith('authentik')
        this.$router.push('/')
      } catch (e) {
        this.error = e.response.data.message
      }
    },
  },
})
</script>
