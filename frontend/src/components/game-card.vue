<script>
import { mapActions } from 'vuex'
export default {
  name: 'GameCard',
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  methods: {
    ...mapActions(['markNumber']),
  },
}
</script>

<template lang="pug">
.game-card-container
  .game-card(:class="'color-' + (card.numbers[0] % 14 + 1)")
    .card-row(v-for="row in 3")
      .block(v-for="number in card.numbers.slice((row - 1) * 5, (row - 1) * 5 + 5)"
        @click="markNumber({ gameId: card.game, cardId: card._id, number})")
          .marked-bg(v-if="card.markedNumbers.includes(number)")
          span {{ number }}
</template>

<style scoped lang="scss">
.game-card-container {
  padding: 1px;
  border: 1px solid black;
  display: inline-block;
}

.game-card {
  display: inline-block;
  border: 1px solid black;
  margin: 0.5rem;
  width: 30rem;
  height: 9rem;
  box-sizing: content-box;
}

.block {
  position: relative;
  background: white;
  display: inline-block;
  height: 3rem;
  width: 3rem;
  line-height: 3rem;
  text-align: center;
  font-weight: 700;
  cursor: pointer;
}

.block:not(:last-child) {
  margin-right: 3rem;
}

.card-row:nth-child(2) {
  margin-left: 3rem;
}

.marked-bg {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: black;
  & + span {
    color: white;
    position: relative;
    z-index: 1;
  }
}

.color-1 {
  background-color: red;
}

.color-2 {
  background-color: orange;
}

.color-3 {
  background-color: yellow;
}

.color-4 {
  background-color: green;
}

.color-5 {
  background-color: blue;
}

.color-6 {
  background-color: indigo;
}

.color-7 {
  background-color: violet;
}

.color-8 {
  background-color: pink;
}

.color-9 {
  background-color: purple;
}

.color-10 {
  background-color: maroon;
}

.color-11 {
  background-color: olive;
}

.color-12 {
  background-color: navy;
}

.color-13 {
  background-color: teal;
}

.color-14 {
  background-color: aqua;
}
</style>
