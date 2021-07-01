<template>
  <h1>Logout</h1>
</template>

<script>
export default {
  mounted() {
    this.$store.dispatch('auth/logout').then(() => this.$router.push('/login'))
  },
}
</script>