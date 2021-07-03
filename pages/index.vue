<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1>{{ $t('dashboard') }}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  head() {
    return { title: this.$t('dashboard') }
  },
}
</script>