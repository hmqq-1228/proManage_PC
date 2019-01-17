<template>
  <div>
    <Loading v-bind:text="keykey" v-on:click="ccChange"></Loading>
    <h3>Test</h3>
    <div>{{managePlanData}}</div>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
    </el-row>

    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light"></div></el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
    <div class="interfaceTest" v-on:click="queryMyProjectList()">查询个人项目列表</div>
    <div class="interfaceTest" v-on:click="queryMyTaskView()">查询个人任务</div>
    <div class="interfaceTest" v-on:click="queryMyProjectView()">查看个人项目</div>
    <div class="interfaceTest" v-on:click="queryGetProjectCondition()">项目统计情况查看</div>
    <div class="interfaceTest" v-on:click="queryGetTaskCondition()">任务统计情况查看</div>
    <div class="interfaceTest" v-on:click="queryManagePlan()">计划管理-任务书查询</div>
  </div>
</template>

<script>
import Loading from '../common/load.vue'
// import Loading from './HelloWorld.vue'
export default {
  name: 'Test',
  components: {
    Loading
  },
  data () {
    return {
      keykey: 'vvvvvvvv',
      posts: [
        { id: 1, title: 'My journey with Vue' },
        { id: 2, title: 'Blogging with Vue' },
        { id: 3, title: 'Why Vue is so fun' }
      ],
      post: {
        title: '这个是title',
        content: '这个是content'
      },
      postFontSize: 1,
      managePlanData: '',
      msg: '通用项目管理',
      activeName: 'second',
      myProjectListPayload: {
        userId: 'M40B35D9312396059'
      },
      myTaskViewPayload: {
        pageNum: '1',
        pageSize: '10',
        userId: 'M40B35D9312396059'
      },
      myProjectViewPayload: {
        status: '1',
        pageNum: '1',
        pageSize: '10',
        userId: 'M40B35D9312396059'
      },
      getProjectConditionPayload: {
        userId: 'M40B35D9312396059'
      },
      getTaskConditionPayload: {
        userId: 'M40B35D9312396059',
        projectUID: '1'
      },
      managePlanPayload: {
        projectUID: 'S0cca9b0cd1fa4000af240c889ac9d7c0'
      }
    }
  },
  created () {
    this.queryManagePlan()
  },
  methods: {
    ccChange (num) {
      this.keykey = num
    },
    handleChangeTest: function (res) {
      console.log('key:', res)
      console.log('key:', res)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 个人项目列表查看（项目id，项目名）
    queryMyProjectList () {
      var that = this
      this.ajax('/general/myProjectList', that.myProjectListPayload).then(res => {
        console.log('个人项目列表查看（项目id，项目名）:', res)
        console.log(res.code)
      })
    },
    // 个人任务查看
    queryMyTaskView () {
      var that = this
      this.ajax('/general/myTaskView', that.myTaskViewPayload).then(res => {
        console.log('个人任务查看:', res)
        console.log(res.code)
      })
    },
    // 个人项目查看 (项目卡片)
    queryMyProjectView () {
      var that = this
      this.ajax('/general/myProjectView', that.myProjectViewPayload).then(res => {
        console.log('个人项目查看 (项目卡片):', res)
        console.log(res.code)
      })
    },
    // 项目统计情况查看
    queryGetProjectCondition () {
      var that = this
      this.ajax('/general/getProjectCondition', that.getProjectConditionPayload).then(res => {
        console.log('项目统计情况查看:', res)
        console.log('code:', res.code)
      })
    },
    // 任务统计情况查看
    queryGetTaskCondition () {
      var that = this
      this.ajax('/general/getTaskCondition', that.getTaskConditionPayload).then(res => {
        console.log('任务统计情况查看:', res)
        console.log('code:', res.code)
      })
    },
    // 计划管理-计划任务树查询
    queryManagePlan () {
      var that = this
      this.ajax('/general/managePlan', that.managePlanPayload).then(res => {
        that.managePlanData = res
        console.log('计划管理-计划任务树查询:', res)
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
