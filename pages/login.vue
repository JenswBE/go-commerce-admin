<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="general">
            <v-toolbar-title>Beheerspaneel</v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                ref="username"
                v-model="username"
                :rules="[() => !!username || 'Gebruikersnaam is verplicht']"
                prepend-icon="mdi-account"
                label="Gebruikersnaam"
                required
                @keydown.enter="login"
              />
              <v-text-field
                ref="password"
                v-model="password"
                :rules="[() => !!password || 'Wachtwoord is verplicht']"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                label="Wachtwoord"
                required
                @keydown.enter="login"
                @click:append="showPassword = !showPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn align-center justify-center color="general" @click="login"
              >Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  head: { title: 'Login' },

  data: function () {
    return {
      username: '',
      password: '',
      showPassword: false,
    }
  },

  // Sends action to Vuex that will log you in and redirect to the dash otherwise, error
  methods: {
    login: function () {
      const plainCreds = `${this.username}:${this.password}`
      this.$store
        .dispatch('auth/login', plainCreds)
        .then(() => this.$router.push('/'))
        .catch((e) => {})
    },
  },
}
</script>
