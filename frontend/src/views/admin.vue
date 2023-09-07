<script>
import { mapActions, mapGetters } from 'vuex'
import GameCard from '@/components/game-card.vue'

export default {
  name: 'Home',
  components: {
    GameCard,
  },
  data() {
    return {
      newGame: {
        name: '',
      },
    }
  },
  async created() {
    await this.fetchGames()
  },
  methods: {
    ...mapActions(['fetchGames', 'createGame', 'startGame', 'stopGame', 'drawNumber']),
    async submitCreateGame() {
      await this.createGame(this.newGame)

      this.newGame.name = ''
    },
  },
  computed: {
    ...mapGetters(['adminGames']),
  },
}
</script>

<template lang="pug">
.home.container
  .row.games.g-6
    .col-12
      h1 Games
      p(v-if="adminGames.length === 0") No games
      ul(v-else)
        li(v-for="game in adminGames").mb-5
          .row
            h2 {{ game.name }} game
            .col-2
              h3 Participants: {{ game.participants.length }}
              button.btn.btn-primary(v-if="!game.active" @click="startGame(game._id)") Start
            .col-3(v-if="game.active")
              h3 Last drawn number:
                button.btn.btn-success.m-1.btn-lg {{ game.drawnNumbers[0] || '—' }}
            .col(v-if="game.active")
              h3 Drawn numbers ({{ game.drawnNumbers.length }}):
              p(v-if="game.drawnNumbers.length === 0") No numbers drawn
              p(v-else)
                button.btn.btn-warning.m-1(v-for="number in game.drawnNumbers") {{ number }}
              button(v-if="game.active").btn.btn-success(@click="drawNumber(game._id)") Draw new number
          .row(v-if="game.active")
            .col.mb-3
              h3 Cards:
              .row
                .col(v-for="card in game.cards").mb-3
                  p {{ card.user.name }} ({{ card.user.email }})
                  game-card(:card="card")

          .row(v-if="game.active")
            .col
              button.btn.btn-primary(v-if="game.active" @click="stopGame(game._id)") Stop
  .row.create-game.justify-content-center
    .col-4.text-center
      h1 Create New Game
      form.row.g-3(@submit.prevent="submitCreateGame()")
        input.form-control(type="text" v-model="newGame.name" placeholder="Game Name")
        button.btn.btn-primary(type="submit") Create Game
</template>
