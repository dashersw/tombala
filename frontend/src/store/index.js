import { createStore } from 'vuex'
import axios from 'axios'

axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH
axios.defaults.withCredentials = true

const store = createStore({
  state: {
    user: undefined,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
  },
  actions: {
    async fetchUsers() {
      return (await axios.get('/api/users')).data
    },

    async fetchSession({ commit }) {
      let user = null

      try {
        user = (await axios.get('/api/auth/me')).data
      } catch (e) {
        console.log(e)
      }

      commit('setUser', user)
    },
  },
  modules: {},
})

export default async function main() {
  await store.dispatch('fetchSession')

  return store
}
