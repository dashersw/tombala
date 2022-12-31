<script>
import { mapActions, mapState } from 'vuex'

import GameCard from '../components/game-card.vue'
export default {
  name: 'Home',
  components: {
    GameCard,
  },
  data() {
    return {}
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
    ...mapState(['games']),
  },
}
</script>

<template lang="pug">
.home.container
  .games.container
    h1 Active Games
    p(v-if="games.length === 0") There are no active games 🙈
    .container(v-for="game in games")
      h2 {{ game.name }}
      .container(v-if="!game.self")
        p You are not participating in this game
        button.btn.btn-primary(@click="joinGame(game._id)") Join Game
      .container(v-else)
        h3 Last drawn number: {{  game.drawnNumbers[0] }}
        game-card(:card="game.ownCard")
      .container.mt-3
        p Not your game? Request a new card!
        .btn.btn-primary(@click="requestCard(game.ownCard)") Request a new card 🥳
</template>
