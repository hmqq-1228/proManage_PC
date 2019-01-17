<template>
  <div id="dynamic-component-demo" class="main">
    <div class="cnt" v-bind:style="styleObject">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: routerNameItem.url }" v-for="routerNameItem in routerNameArr" v-bind:key="routerNameItem.name">{{routerNameItem.name}}</el-breadcrumb-item>
      </el-breadcrumb>
      <h3>项目详情</h3>
      <el-tabs v-model="currentTab">
        <el-tab-pane v-bind:label="tab.tabName" v-bind:name="tab.tabComp" v-for="tab in tabs" v-bind:key="tab.tabComp"></el-tab-pane>
      </el-tabs>
      <component v-bind:is="currentTabComponent" v-on:beishuEmit="getBeishu" v-on:paneCurrent="paneCurrentFuc" text="school" class="tab"></component>
    </div>
  </div>
</template>

<script>
import ProDetailBase from './proDetailBase.vue'
import ProDetailMember from './proDetailMember.vue'
import ProDetailPlanTree from './proDetailPlanTree.vue'
import ProDetailHistory from './proDetailHistory.vue'
export default {
  name: 'proDetails',
  components: {
    ProDetailBase,
    ProDetailMember,
    ProDetailPlanTree,
    ProDetailHistory
  },
  data () {
    return {
      msg: '通用项目管理',
      styleObject: {
        width: '1200px'
      },
      routerName: '',
      routerNameArr: [],
      currentTab: this.$store.state.currentTab,
      tabs: [
        {tabName: '基本信息', tabComp: 'ProDetailBase'},
        {tabName: '成员管理', tabComp: 'ProDetailMember'},
        {tabName: '计划管理', tabComp: 'ProDetailPlanTree'},
        {tabName: '历史记录', tabComp: 'ProDetailHistory'}
      ]
    }
  },
  watch: {
    currentTab: function (newQuestion, oldQuestion) {
      this.$store.state.currentTab = newQuestion
      this.log('newQuestion:', newQuestion)
    }
  },
  created: function () {
    // var that = this
    this.routerName = this.$store.state.routerName
    this.routerNameArr = this.$store.state.routerNameArr
  },
  computed: {
    currentTabComponent: function () {
      return this.currentTab
    }
  },
  methods: {
    getBeishu (beinum) {
      this.log('beinum:', beinum)
      this.styleObject.width = 1200 + (beinum * 50) + 'px'
    },
    paneCurrentFuc (tab) {
      this.currentTab = tab
    }
  }
}
</script>

<style scoped>
  .cnt{
    width: 1200px;
    margin: 0 auto;
    transition: width 0.5s;
  }
  .tab-button {
    padding: 6px 10px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border: 1px solid #ccc;
    cursor: pointer;
    background: #f0f0f0;
    margin-bottom: -1px;
    margin-right: -1px;
  }
  .tab-button:hover {
    background: #e0e0e0;
  }
  .tab-button.active {
    background: #e0e0e0;
  }
  .tab {
    _border: 1px solid #ccc;
    padding: 10px;
    padding-right: 21px;
    padding-top: 0;
  }
</style>
