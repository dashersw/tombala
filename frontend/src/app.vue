<script>
const { VUE_APP_BASE_PATH } = process.env

import { mapState } from 'vuex'

export default {
  name: 'Home',
  data() {
    return {
      basePath: VUE_APP_BASE_PATH || '',
    }
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<template lang="pug">
#app.container
  header.d-flex.flex-wrap.justify-content-center.py-3.mb-4.border-bottom
    a.d-flex.align-items-center.mb-3.mb-md-0.me-md-auto.text-dark.text-decoration-none(href='/')
      span.fs-4 Nimble Tombala

  .container(v-if="!user")
    h1 Welcome to Nimble Tombala.
    p Log in to join the game 🚀
    a.btn.btn-primary(:href="`${basePath}/api/auth/login/federated/google`") Log in with Google

  router-view
</template>

<style lang="scss">
@import '@/assets/theme.scss';
</style>
