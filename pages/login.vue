<template>
  <v-container class="fill-height">
    <v-row>
      <v-col class="text-center">
        <v-btn
          x-large
          fab
          @click="login"
          width="30vh"
          height="30vh"
          style="font-size: 5vh"
          color="primary"
        >
          Login
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { MetaInfo } from 'vue-meta'

export default Vue.extend({
  head(): MetaInfo {
    return { title: 'Login' }
  },

  methods: {
    async login() {
      try {
        await this.$auth.loginWith('token')
        this.$router.push('/')
      } catch (e) {
        console.error('Failed to login', e)
      }
    },
  },
})
</script>
