<template>
  <div class="myLaunch">
    <div class="selectIpt">所属项目
      <el-select v-model="proBelongSelect" clearable placeholder="请选择" style="margin-left: 10px;">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in projectList"
          :key="item.projectUID"
          :label="item.projectName"
          :value="item.projectUID">
        </el-option>
      </el-select>
    </div>
    <!---->
    <div class="listWrap">
      <el-container>
        <el-aside width="150px" style="min-height: 500px;">
          <el-row class="tac">
            <el-col :span="12" style="width: 100%;height: 553px;">
              <!--:default-active="defaultSectLaunch"-->
              <el-menu :default-active="defaultSectLaunch" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" style="border: none" background-color="transparent">
                <el-menu-item index="1" v-on:click="navMenuClick('')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">全部发起 {{taskConditionData.allNum}}</span>
                </el-menu-item>
                <el-menu-item index="2" v-on:click="navMenuClick('today')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">今日发起 {{taskConditionData.tNum}}</span>
                </el-menu-item>
                <el-menu-item index="5" v-on:click="navMenuClick('overtime')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">已逾期 {{taskConditionData.overtimeNum}}</span>
                </el-menu-item>
                <el-menu-item index="6" v-on:click="navMenuClick('unstart')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">未开始 {{taskConditionData.unstartNum}}</span>
                </el-menu-item>
                <el-menu-item index="7" v-on:click="navMenuClick('unfinish')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">进行中 {{taskConditionData.unfinishNum}}</span>
                </el-menu-item>
                <el-menu-item index="8" v-on:click="navMenuClick('finish')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">已完成 {{taskConditionData.finishNum}}</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-container>
          <!--<el-header>Header</el-header>-->
          <el-main>
            <el-table :cell-class-name="rowClass" :header-cell-style="{background:'#337ab7',color:'#fff',textAlign:'center',fontSize:'14px'}" :data="taskListData" border style="width: 100%" @cell-click="totaskDetail">
              <el-table-column prop="projectName" label="所属项目"></el-table-column>
              <el-table-column prop="planName" width="120" label="所属计划"></el-table-column>
              <el-table-column prop="jobName"  width="180" label="任务名称"></el-table-column>
              <!--<el-table-column prop="type" label="任务类型"></el-table-column>-->
              <el-table-column prop="jobLevel"  width="80" label="任务级别"></el-table-column>
              <el-table-column prop="userName" width="150"  label="执行人"></el-table-column>
              <!--<el-table-column prop="createrName" width="100"  label="执行人"></el-table-column>-->
              <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
              <el-table-column prop="taskStartDate" width="150" label="开始时间"></el-table-column>
              <el-table-column prop="taskFinishDate" width="150" label="结束时间"></el-table-column>
              <el-table-column prop="statusStr" width="80" label="状态"></el-table-column>
            </el-table>
            <div style="padding: 0 1px">
              <div class="block" style="background-color: #fff; padding: 10px;text-align: center">
                <el-pagination @current-change="changePage($event)" layout="prev, pager, next, total, jumper" :total="totalP">
                </el-pagination>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myLaunch',
  data () {
    return {
      msg: '',
      // 所属项目
      proBelongSelect: '',
      // 所属项目 我的发起
      proBelongLaunchSelect: '',
      projectList: [],
      defaultSectLaunch: '1',
      taskConditionData: {},
      taskListData: [],
      totalP: 0,
      ConditionType: '',
      myTaskViewPayload: {
        pageNum: '1',
        pageSize: '10',
        projectUID: '',
        uid: this.$route.params.id,
        userId: this.$store.state.userId,
        startTime: '',
        endTime: '',
        projectName: '',
        planName: '',
        jobName: '',
        type: '',
        jobLevel: '',
        createrName: '',
        status: '',
        cStartTime: '',
        cEndTime: '',
        sType: ''
      },
      myProjectListPayload: {
        userId: this.$store.state.userId
      },
      getTaskConditionPayload: {
        userId: this.$store.state.userId,
        projectUID: ''
      }
    }
  },
  created: function () {
    var that = this
    /** 设置面包屑 */
    that.$store.commit('setRouterName', {name: '我的发起', parentName: 'TaskPlan', url: '/'})
    /** 设置父级组件 TaskPlan2 的 cnt 宽度 */
    // that.$emit('setWidthEmit', '1500px')
    // 个人项目列表查看（项目id，项目名）
    that.queryMyProjectList()
    // 我的任务 侧边栏 任务统计
    that.queryGetTaskCondition()
    // 个人任务查看
    that.queryMyTaskView()
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    // 任务侧边栏 点击
    navMenuClick (args) {
      this.ConditionType = args
      this.myTaskViewPayload.pageNum = 1
      this.myTaskViewPayload.sType = args
      this.myTaskViewPayload.uid = ''
      // this.$router.push('/')
      this.queryMyTaskView()
    },
    rowClass ({ row, column, rowIndex, columnIndex }) {
      // console.log('rowStyle', row.projectUID)
      if (columnIndex === 0 && row.projectUID !== this.$store.state.projectUID) {
        return 'fontStyle'
      } else if (columnIndex === 2) {
        return 'btnStyle'
      } else if (columnIndex === 8) {
        if (row.status === '0') {
          return 'toStart'
        } else if (row.status === '1') {
          return 'noDone'
        } else if (row.status === '2') {
          return 'finished'
        }
      }
    },
    totaskDetail (row, column, cell, event) {
      var that = this
      var pID = row.projectUID
      // this.log(row)
      var planid = row.uid
      if (column.label === '所属项目') {
        if (pID && pID !== that.$store.state.projectUID) {
          this.$router.push('/proDetails/' + pID)
        }
      } else if (column.label === '任务名称') {
        if (pID) {
          that.$router.push('/taskDetailPage/' + planid)
        }
      }
    },
    changePage: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = e
      that.queryMyTaskView()
    },
    // 个人任务查看
    queryMyTaskView () {
      var that = this
      this.ajax('/general/myLaunchTaskView', that.myTaskViewPayload).then(res => {
        if (res.code === 200) {
          res.data.list.testBool = true
          that.taskListData = res.data.list
          that.totalP = res.data.totalRow
        } else {
          that.log('myTaskView:', res.msg)
        }
        // console.log('个人任务:', that.taskListData)
      })
    },
    // 个人项目列表查看（精简版，项目id，项目名）
    queryMyProjectList () {
      var that = this
      this.ajax('/general/myLaunchProjectList', that.myProjectListPayload).then(res => {
        // this.log('选择所属项目:', res)
        if (res.code === 200) {
          that.projectList = res.data
        }
      })
    },
    // 任务侧边栏 任务统计情况查看
    queryGetTaskCondition () {
      var that = this
      this.ajax('/general/getLaunchTaskCondition', that.getTaskConditionPayload).then(res => {
        if (res.code === 200) {
          that.taskConditionData = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
  .myLaunch{
    width: 100%;
    margin: 0 auto;
    padding-top: 20px;
  }
  .selectIpt{
    text-align: left;
    _margin-top: 20px;
  }
  .listWrap{
    margin-top: 40px;
  }
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    _line-height: 200px;
  }
  .el-menu-item:hover{
    background-color: #E9EEF3 !important;
  }
</style>
