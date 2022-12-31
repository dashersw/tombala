<script>
import { mapActions } from 'vuex'

import HelloWorld from '@/components/hello-world.vue'

const { VUE_APP_BASE_PATH } = process.env

export default {
  name: 'Home',
  components: {
    HelloWorld,
  },
  data() {
    return {
      basePath: VUE_APP_BASE_PATH || '',
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    ...mapActions(['fetchUsers']),
  },
}
</script>

<template lang="pug">
.home
  hello-world(msg="Welcome to your stack.")
  a(:href="`${basePath}/api/auth/login/federated/google`") Login with Google
</template>
