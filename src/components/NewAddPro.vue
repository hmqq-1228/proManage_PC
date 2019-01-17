<template>
  <div id="dynamic-component-demo" class="main">
    <div class="cnt" v-bind:style="styleObject">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">{{routerName}}</el-breadcrumb-item>
        <el-breadcrumb-item>项目详情</el-breadcrumb-item>
      </el-breadcrumb>
      <h3>新增项目</h3>
      <el-tabs v-model="currentTab">
        <el-tab-pane v-bind:label="tab.tabName" v-bind:name="tab.tabComp" v-for="tab in tabs" v-bind:key="tab.tabComp" v-bind:disabled="tab.disabled"></el-tab-pane>
      </el-tabs>
      <component v-bind:is="currentTabComponent" v-bind:proID="pID" v-on:beishuEmit="getBeishu" v-on:postProjectId="ccChange" v-on:paneDisabled="paneDisabledFuc" v-on:paneCurrent="paneCurrentFuc" class="tab"></component>
    </div>
  </div>
</template>

<script>
import NewAddBase from './NewAddBase.vue'
import NewAddMember from './NewAddMember.vue'
import proDetailPlanTree from './proDetailPlanTree.vue'
// import NewAddPlanTree from './NewAddPlanTree.vue'
export default {
  name: 'NewAddPro',
  components: {
    NewAddBase,
    NewAddMember,
    proDetailPlanTree
  },
  data () {
    return {
      msg: '通用项目管理',
      pID: '',
      styleObject: {
        width: '1200px'
      },
      beiVal: 0,
      routerName: '',
      currentTab: 'NewAddBase',
      tabs: [
        {tabName: '基本信息', tabComp: 'NewAddBase', disabled: false},
        {tabName: '成员管理', tabComp: 'NewAddMember', disabled: true},
        {tabName: '计划管理', tabComp: 'proDetailPlanTree', disabled: true}
      ],
      panekk: false
    }
  },
  created: function () {
    this.routerName = this.$store.state.routerName
  },
  methods: {
    ccChange (num) {
      this.pID = num
    },
    getBeishu (beinum) {
      this.styleObject.width = 1200 + (beinum * 50) + 'px'
      this.beiVal = beinum
    },
    paneDisabledFuc (argArr) {
      // 接收到的参数是 打开项 disabled = false
      var that = this
      for (var i = 0; i < argArr.length; i++) {
        for (var t = 0; t < that.tabs.length; t++) {
          if (that.tabs[t].tabComp === argArr[i]) {
            that.tabs[t].disabled = false
          }
        }
      }
    },
    paneCurrentFuc (tab) {
      this.log('tab:', tab)
      this.currentTab = tab
    }
  },
  computed: {
    currentTabComponent: function () {
      // return 'tab-' + this.currentTab.toLowerCase()
      return this.currentTab
    }
  }
}
</script>

<style scoped>
  .cnt{
    width: 1200px;
    margin: 0 auto;
    transition:width 0.5s;
  }
</style>
