import { createStore } from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'

const socket = io(process.env.VUE_APP_BASE_PATH, {
  withCredentials: true,
})

axios.defaults.baseURL = process.env.VUE_APP_BASE_PATH
axios.defaults.withCredentials = true

export const store = createStore({
  state: {
    user: undefined,
    games: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setGames(state, games) {
      state.games = games
    },
  },
  actions: {
    async init({ dispatch }) {
      const fetchGames = () => dispatch('fetchGames')

      socket.on('new participant', fetchGames)
      socket.on('new draw', fetchGames)
      socket.on('new user action', fetchGames)
      socket.on('new card', fetchGames)
      socket.on('new game', fetchGames)

      await store.dispatch('fetchSession')
    },

    async fetchGames({ commit }) {
      const games = (await axios.get('/games')).data

      commit('setGames', games)
    },

    async createGame(store, game) {
      await axios.post('/games', game)

      await this.dispatch('fetchGames')
    },

    async fetchSession({ commit }) {
      let user = null

      try {
        user = (await axios.get('/auth/me')).data

      } catch (e) {
        console.log(e)
      }

      commit('setUser', user)
    },

    async changeGameStatus(store, { id, status }) {
      await axios.post(`/games/${id}/status`, { status })
    },

    async startGame(store, id) {
      await this.dispatch('changeGameStatus', { id, status: 'start' })

      await this.dispatch('fetchGames')
    },

    async stopGame(store, id) {
      await this.dispatch('changeGameStatus', { id, status: 'stop' })

      await this.dispatch('fetchGames')
    },

    async drawNumber(store, id) {
      await axios.post(`/games/${id}/numbers`)

      await this.dispatch('fetchGames')
    },

    async joinGame(store, id) {
      await axios.post(`/games/${id}/participants`)

      await this.dispatch('fetchGames')
      await this.dispatch('fetchSession')
    },

    async markNumber(store, { gameId, cardId, number }) {
      await axios.put(`/games/${gameId}/cards/${cardId}/numbers/${number}?mark=true`)

      await this.dispatch('fetchGames')
    },

    async requestANewCard(store, card) {
      await axios.put(`/games/${card.game}/cards/${card._id}`)

      await this.dispatch('fetchGames')
    },
  },
  getters: {
    homeGames: state => {
      const filteredGame = state.games.filter(game => {
        return game.active == true && game.admin != state.user._id
      })

      return filteredGame
    },
    adminGames: state => {
      const filteredGame = state.games.filter(game => {
        return game.admin == state.user._id
      })

      filteredGame.forEach(game => {
        socket.emit('join-room', `admin-${game._id}`)
      })

      return filteredGame
    }
  },
  modules: {},
})

export default async function main() {
  await store.dispatch('init')

  return store
}
