<template>
  <div class="main">
    <h1 class="test">{{ msg }}</h1>
    <h3>{{$store.state.count}}</h3>
    <div><el-button @click="$store.commit('add')">add按钮</el-button></div>
    <div><el-button @click="$store.commit('reduce')">reduce按钮</el-button></div>
    <div><el-button @click="testAjax()">测试ajax</el-button></div>
    <div><el-button @click="testjquery($event)">测试$</el-button></div>
    <div class="testClickEvent" data-name="testevent" v-on:click="testEvent($event)">测试event</div>
    <div class="testAjaxVuex" v-on:click="testAjaxVuex($event)">测试异步请求走状态</div>
    <div class="testAjaxVuex" v-on:click="seeAjaxVuexData($event)">查询异步请求状态数据</div>
    <div class="testAjaxVuex" v-on:click="routerTest($event)">跳转至Test</div>
    <div class="testAjaxVuex" v-on:click="routerTaskPlan($event)">跳转至TaskPlan</div>
  </div>
</template>

<script>
// import $ from 'jquery'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: '通用项目管理',
      testData: 'Test Data',
      testAjaxData: {
        name: 'admin',
        pwd: 1234
      },
      testAjaxVuexData: {
        url: '/admin/zpLogin',
        actionName: 'zpLogin',
        postData: {
          name: 'admin',
          pwd: 1234
        }
      }
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    testData: function (newQuestion, oldQuestion) {
    }
  },
  beforeCreate: function () {},
  created: function () {
    this.testMethods()
  },
  beforeMount: function () {},
  mounted: function () {
    // this.testMethods2()
  },
  beforeUpdate: function () {},
  updated: function () {},
  beforeDestroy: function () {},
  destroyed: function () {},
  computed: {
  },
  methods: {
    testMethods: function () {
      // console.log('created:', $('.test').text())
      console.log(123)
    },
    // 测试全局 $
    testjquery: function (e) {
      console.log(e)
      console.log('jquery:', $('.test').text())
    },
    // 测试异步请求
    testAjax: function (e) {
      var that = this
      this.ajax('/admin/zpLogin', that.testAjaxData).then(res => {
        console.log(res)
      })
    },
    // 测试事件参数
    testEvent: function (e) {
      var obj = e.currentTarget
      console.log($(obj).attr('data-name'))
    },
    // 测试异步请求走状态
    testAjaxVuex: function () {
      var that = this
      var aaa = that.testAjaxVuexData
      console.log('aaa:', aaa)
      that.$store.commit('callService', that.testAjaxVuexData)
    },
    // 查看状态管理存储的数据
    seeAjaxVuexData: function () {
      console.log('zpLogin:', this.$store.state.zpLogin)
    },
    // 跳转至nTest
    routerTest: function () {
      this.$router.push('/Test')
    },
    // 跳转至taskplan
    routerTaskPlan: function () {
      this.$router.push('/TaskPlan')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .main{
    text-align: center;
  }
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
