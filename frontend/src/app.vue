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
    a.d-flex.align-items-center.mb-3.mb-md-0.me-auto.text-dark.text-decoration-none(href='/')
      span.fs-4 Nimble Tombala

    ul.nav.nav-pills
      li.nav-item
        router-link.nav-link.active(to="/") Home
      li.nav-item(v-if="user?.isAdmin")
        router-link.nav-link(to="/admin") Admin
      li.nav-item(v-if="user")
        a.nav-link(:href="`${basePath}/api/auth/logout`") Logout

  router-view
</template>

<style lang="scss">
@import '@/assets/theme.scss';
</style>
