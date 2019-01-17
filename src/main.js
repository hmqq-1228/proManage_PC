// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import store from './store'
import router from './router'
import ajax from './assets/ajax/ajax.js'
import $ from 'jquery'
import App from './App'
Vue.config.productionTip = false

Vue.use(ajax)
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
Vue.component('button-counter', {
  props: ['title'],
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
Vue.component('blog-post', {
  props: ['post'],
  template: `
    <div class="blog-post">
      <h3>{{ post.title }}</h3>
      <button v-on:click="$emit('enlarge-text', 0.5)">
        Enlarge text
      </button>
      <div v-html="post.content"></div>
    </div>
  `
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  $,
  components: { App },
  template: '<App/>'
})
