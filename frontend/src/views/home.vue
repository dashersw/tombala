<script>
import { mapActions, mapState } from 'vuex'
import GameCard from '../components/game-card.vue'

const { VUE_APP_BASE_PATH } = process.env

export default {
  name: 'Home',
  components: {
    GameCard,
  },
  data() {
    return {
      basePath: VUE_APP_BASE_PATH || '',
    }
  },
  created() {
    this.fetchGames()
  },
  methods: {
    ...mapActions(['fetchGames', 'joinGame', 'requestANewCard']),
    requestCard(card) {
      if (card.markedNumbers.length > 0) {
        const reply = confirm('You will get a new card, but you will lose your current card!')

        if (!reply) return
      }

      this.requestANewCard(card)
    },
  },
  computed: {
    ...mapState(['games', 'user']),
  },
}
</script>

<template lang="pug">
.home.container
  h1 Welcome to Nimble Tombala.
  div(v-if="!user")
    p Log in to join the game 🚀
    a.btn.btn-primary(:href="`${basePath}/api/auth/login/federated/google`") Log in with Google
  div(v-else)
    p Hello {{ user.name }}! 👋
    p(v-if="games.length == 0") There are no active games right now 🙈
    p(v-else-if="games.length == 1") There is {{ games.length }} active game right now 🚀
    p(v-else) There are {{ games.length }} active games right now 🚀
  .row
    .col-xl-6.col-xs-12.mb-5(v-for="game in games")
      h2 {{ game.name }}
      .container(v-if="!game.self")
        p You are not participating in this game
        button.btn.btn-primary(@click="joinGame(game._id)") Join Game
      .container(v-else)
        h3 Last drawn number: {{ game.drawnNumbers[0] || '—' }}
        game-card(:card="game.ownCard")
        .container.mt-3
          p Not your game? Request a new card!
          .btn.btn-primary(@click="requestCard(game.ownCard)") Request a new card 🥳
</template>
