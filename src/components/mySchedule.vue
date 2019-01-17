<template>
  <div class="mySchedule">
    <button v-on:click="toSchedule()">我的日程</button>
  </div>
</template>

<script>
export default {
  name: 'mySchedule',
  data () {
    return {
    }
  },
  watch: {
  },
  created: function () {
    this.$router.push('/Schedule')
  },
  mounted: function () {
    // j
  },
  methods: {
    toSchedule: function () {
      this.$router.push('/Schedule')
    }
  }
}
</script>

<style scoped>

</style>
