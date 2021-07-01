<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" clipped fixed app v-if="isLoggedIn">
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app v-if="isLoggedIn">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer></v-spacer>
      <v-btn icon to="/logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-snackbar v-model="showAlert" :color="alert.type" top>
      {{ alert.message }}
    </v-snackbar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      drawer: false,
      title: 'GoCommerce',
      items: [
        {
          title: 'Overzicht',
          icon: 'mdi-view-dashboard',
          to: '/',
        },
        {
          title: 'Producten',
          icon: 'mdi-hand-wash',
          to: '/products',
        },
        {
          title: 'Categorieën',
          icon: 'mdi-tag',
          to: '/categories',
        },
        {
          title: 'Merken',
          icon: 'mdi-factory',
          to: '/manufacturers',
        },
      ],
    };
  },

  computed: {
    ...mapState('auth', ['isLoggedIn']),
    ...mapState('general', ['alert']),

    showAlert: {
      get() {
        return Boolean(this.alert.message);
      },
      set() {
        this.$store.commit('general/CLEAR_ALERT');
      },
    },
  },
};
</script>
