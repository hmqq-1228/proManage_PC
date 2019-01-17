<template>
  <div v-on:click="onClick()">6666666 {{text}}</div>
</template>

<script>
export default {
  name: 'load',
  props: ['text'],
  // props: {
  //   text: {
  //     type: 'String',
  //     default: 'This is default'
  //   }
  // },
  data () {
    return {
      msg: '通用项目管理'
    }
  },
  methods: {
    onClick () {
      console.log(123456789)
      console.log('text:', this.text)
      this.$emit('click', this.text + 'z')
    }
  }
}
</script>

<style scoped>

</style>
