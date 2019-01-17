<template>
  <div class="main">
    <div class="cnt" v-bind:style="{ width: cntWidth}">
      <h3>任务和计划</h3>
      <el-tabs v-model="currentTab" type="border-card">
        <el-tab-pane v-for="tab in tabs" v-bind:label="tab.tabName" v-bind:name="tab.tabComp" v-bind:key="tab.tabComp"></el-tab-pane>
        <component v-bind:is="currentTabComponent" v-on:setWidthEmit="setWidthFuc"></component>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
import MyTask from './myTask.vue'
import MyProject from './myProject.vue'
import MyLaunch from './myLaunch.vue'
import MySchedule from './mySchedule.vue'
export default {
  name: 'TaskPlan',
  components: {
    MyTask,
    MyProject,
    MyLaunch,
    MySchedule
  },
  data () {
    return {
      msg: '通用项目管理',
      cntWidth: '',
      taskId: '',
      // routerNameArr: [],
      currentTab: this.$store.state.TaskPlanCurrentTab,
      tabs: [
        {tabName: '我的任务', tabComp: 'MyTask'},
        {tabName: '我的项目', tabComp: 'MyProject'},
        {tabName: '我的发起', tabComp: 'MyLaunch'},
        {tabName: '我的日程', tabComp: 'MySchedule'}
      ]
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    currentTab: function (newValue, oldValue) {
      this.$store.state.TaskPlanCurrentTab = newValue
    }
  },
  computed: {
    currentTabComponent: function () {
      return this.currentTab
    }
  },
  updated: function () {
    // console.log('update:routerNameArr:', this.$store.state.routerNameArr)
  },
  created: function () {
    // this.routerNameArr = this.$store.state.routerNameArr
  },
  methods: {
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    setWidthFuc (width) {
      this.cntWidth = width
      this.log('width:', width)
    }
  }
}
</script>

<style lang="less" scoped>
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .cnt{
    width: 82%;
    margin: 0 auto;
  }
</style>
