<template>
  <div v-on:click="onClick()">{{test}}hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh</div>
</template>

<script>
export default {
  name: 'mycomp',
  props: {
    text: {
      type: 'String',
      default: 'This is default Text'
    }
  },
  methods: {
    onClick: function () {
      this.$emit('click', this.text + 'z')
    }
  }
}
</script>

<style scoped>

</style>
