<template>
  <v-container class="fill-height">
    <v-row>
      <v-col cols="4" offset="4">
        <v-card>
          <v-container fluid>
            <v-row>
              <v-col class="text-center" cols="10" offset="1">
                <v-form>
                  <v-text-field
                    :label="$tc('username') | capitalize"
                    prepend-icon="mdi-account"
                    v-model="login.username"
                  ></v-text-field>
                  <v-text-field
                    :label="$tc('password') | capitalize"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-model="login.password"
                  ></v-text-field>
                  <v-btn @click="loginWithLocal" color="primary"> Login </v-btn>
                </v-form>
              </v-col>
            </v-row>

            <v-divider class="mt-10" />

            <v-row class="my-3">
              <v-col class="text-center">
                <v-btn @click="loginWithSSO" color="primary">
                  Login with SSO
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
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

  data: () => ({
    login: {
      username: '',
      password: '',
    },
  }),

  methods: {
    async loginWithLocal() {
      try {
        await this.$auth.loginWith('local', { data: this.login })
        this.$router.push('/')
      } catch (e) {
        console.error('Failed to login', e)
      }
    },

    async loginWithSSO() {
      try {
        await this.$auth.loginWith('oidc')
        this.$router.push('/')
      } catch (e) {
        console.error('Failed to login with SSO', e)
      }
    },
  },
})
</script>
