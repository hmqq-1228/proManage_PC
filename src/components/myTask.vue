<template>
  <div class="myTask" v-loading="loading">
    <!--选择搜索-->
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
    <!--列表-->
    <div class="listWrap">
      <el-container>
        <el-aside width="150px" style="min-height: 500px;">
          <el-row class="tac">
            <el-col :span="12" style="width: 100%;height: 553px;">
              <!--:default-active="defaultSect"-->
              <el-menu :default-active="defaultSect" class="el-menu-vertical-demo" @open="handleOpen" @select="selectVal" @close="handleClose" style="border: none" background-color="transparent">
                <el-menu-item index="1" v-on:click="navMenuClick('today')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">今日任务 {{taskConditionData.tNum}}</span>
                </el-menu-item>
                <el-menu-item index="2" v-on:click="navMenuClick('')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">全部任务 {{taskConditionData.allNum}}</span>
                </el-menu-item>
                <el-menu-item index="3" v-on:click="navMenuClick('overtime')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">逾期任务 {{taskConditionData.overtimeNum}}</span>
                </el-menu-item>
                <el-menu-item index="4" v-on:click="navMenuClick('unstart')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">未开始任务 {{taskConditionData.unstartNum}}</span>
                </el-menu-item>
                <el-menu-item index="5" v-on:click="navMenuClick('unfinish')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">进行中任务 {{taskConditionData.unfinishNum}}</span>
                </el-menu-item>
                <el-menu-item index="6" v-on:click="navMenuClick('finish')">
                  <i class="el-icon-setting"></i>
                  <span slot="title">已完成任务 {{taskConditionData.finishNum}}</span>
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
              <el-table-column prop="jobName"  width="120" label="任务名称"></el-table-column>
              <!--<el-table-column prop="type" label="任务类型"></el-table-column>-->
              <el-table-column prop="jobLevel"  width="80" label="任务级别"></el-table-column>
              <el-table-column prop="createrName" width="100"  label="创建人"></el-table-column>
              <!--<el-table-column prop="createrName" width="100"  label="执行人"></el-table-column>-->
              <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
              <el-table-column prop="taskStartDate" label="开始时间"></el-table-column>
              <el-table-column prop="taskFinishDate" label="结束时间"></el-table-column>
              <el-table-column prop="statusStr" width="80" label="状态"></el-table-column>
              <el-table-column fixed="right" width="150" label="操作">
                <template slot-scope="scope">
                  <el-button v-bind:type="scope.row.isRestart?'primary':'primary'" v-if="scope.row.isRestart" @click="isReStartTask(scope)">重启</el-button>
                  <el-button v-bind:type="parseInt(scope.row.status)>0?'info':'danger'" v-if="parseInt(scope.row.status)===0?true:false" @click="confirm(scope)">确认</el-button>
                  <el-button v-bind:type="parseInt(scope.row.status)===2?'info':'primary'" v-if="parseInt(scope.row.status)===1?true:false" @click="finished(scope)">完成</el-button>
                </template>
              </el-table-column>
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
    <!---->
    <el-dialog title="任务完成" :visible.sync="taskFormVisible"  width="26%">
      <form id="uploadFileFinish" enctype="multipart/form-data">
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 添加评论：</div>
        <textarea name="remark" id="textAreaFinish" cols="60" rows="4" style="width: 98%;"></textarea>
        <div style="height: 30px;line-height: 30px">文件上传：</div>
        <input type="file" id="myfileFinish" name="myfile" placeholder="请选择文件"/><br><br>
        <input type="hidden" name="taskId" v-bind:value="taskId">
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="taskFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="taskFinished()">提 交</el-button>
        </div>
      </form>
    </el-dialog>
    <!---->
  </div>
</template>

<script>
export default {
  name: 'myTask',
  data () {
    return {
      loading: false,
      defaultSect: '1',
      ConditionType: '',
      taskListData: [],
      totalP: 0,
      // 所属项目
      proBelongSelect: '',
      projectList: [],
      taskId: '',
      taskFormVisible: false,
      taskConditionData: {},
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
      getTaskConditionPayload: {
        userId: this.$store.state.userId,
        projectUID: ''
      },
      myProjectListPayload: {
        userId: this.$store.state.userId
      }
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    proBelongSelect: function (newValue, oldValue) {
      // console.log('newValue:', newValue)
      this.getTaskConditionPayload.projectUID = newValue
      this.myTaskViewPayload.projectUID = newValue
      this.queryGetTaskCondition()
      this.queryMyTaskView()
    }
  },
  created: function () {
    var that = this
    /** 设置面包屑 */
    that.$store.commit('setRouterName', {name: '我的任务', parentName: 'TaskPlan', url: '/'})
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
    selectVal (e, p) {
      // this.log('selectVal-index:', e)
      // this.log('selectVal-path:', p)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    // 个人项目列表查看（精简版，项目id，项目名）
    queryMyProjectList () {
      var that = this
      this.ajax('/general/myProjectList', that.myProjectListPayload).then(res => {
        // this.log('选择所属项目:', res)
        if (res.code === 200) {
          that.projectList = res.data
        }
      })
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
    // 任务侧边栏 点击
    navMenuClick (args) {
      this.ConditionType = args
      this.myTaskViewPayload.pageNum = 1
      this.myTaskViewPayload.sType = args
      this.myTaskViewPayload.uid = ''
      // this.$router.push('/')
      this.queryMyTaskView()
    },
    // 个人任务查看
    queryMyTaskView () {
      var that = this
      this.ajax('/general/myTaskView', that.myTaskViewPayload).then(res => {
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
    // 任务侧边栏 任务统计情况查看
    queryGetTaskCondition () {
      var that = this
      this.ajax('/general/getTaskCondition', that.getTaskConditionPayload).then(res => {
        if (res.code === 200) {
          that.taskConditionData = res.data
        }
      })
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
    // 重启
    isReStartTask: function (arg) {
      var that = this
      this.$confirm('是否确定重启此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ajax('/general/restartTask', {taskId: arg.row.uid}).then(res => {
          if (res.code === 200) {
            that.$message.success('已重启')
            that.queryMyTaskView()
            that.queryGetTaskCondition()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    confirm (scope) {
      var that = this
      // console.log(scope)
      // this.confirmFlag = scope.row.btnText
      if (scope.row.status === '1') {
        this.$message.warning('您已经确认')
      } else if (scope.row.status === '2') {
        this.$message.warning('该项目已经完成')
      } else {
        this.ajax('/general/dealTask', {
          taskId: scope.row.uid,
          userId: scope.row.userId
        }).then(res => {
          if (res.code === 200) {
            that.$message.success('已确认')
            that.queryMyTaskView()
            that.queryGetTaskCondition()
          }
        })
      }
    },
    finished (scope) {
      if (scope.row.status === '0') {
        this.$message.warning('您还没有确认呦,请先确定~')
      } else if (scope.row.status === '2') {
        this.$message.warning('该项目已经完成')
      } else {
        this.taskFormVisible = true
        this.taskId = scope.row.uid
      }
    },
    taskFinished () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFileFinish')[0])
      var finishText = $('#textAreaFinish').val()
      if (finishText) {
        that.loading = true
        that.taskFormVisible = false
        $.ajax({
          type: 'post',
          url: url + '/general/finishTask',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          // that.log(data)
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.queryMyTaskView()
            that.queryGetTaskCondition()
            that.loading = false
            $('#textAreaFinish').val('')
            $('#myfileFinish').val('')
          } else {
            that.$message({
              type: 'error',
              message: data.msg
            })
            that.loading = false
          }
        })
      } else {
        that.$message({
          type: 'error',
          message: '备注不能为空！'
        })
        that.loading = false
      }
    },
    changePage: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = e
      that.queryMyTaskView()
    }
  }
}
</script>

<style scoped>
  .myTask{
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
