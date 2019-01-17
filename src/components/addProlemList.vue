<template>
  <div class="main">
    <!--<div class="testDiv" v-on:click="testDiv()">TestDiv</div>-->
    <div class="cnt">
      <h3>问题反馈</h3>
      <!--<el-row :gutter="20">-->
      <!--<el-col :span="4"><div class="grid-content bg-purple">我的任务</div></el-col>-->
      <!--<el-col :span="4"><div class="grid-content bg-purple-light">我的计划</div></el-col>-->
      <!--</el-row>-->
      <div class="tabs">
        <el-tabs v-model="activeName2" type="border-card">
          <el-tab-pane label="我的问题" name="first">
            <el-button icon="el-icon-edit" @click="addNewProble()" type="primary" style="margin-top: 20px;margin-top: 20px;width: 140px;height: 40px;font-size: 15px;">提出问题</el-button>
            <!--列表-->
            <div class="listWrap">
              <el-container>
                <el-aside width="150px;" style="height: 553px;">
                  <el-row class="tac">
                    <el-col :span="12" style="width: 100%">
                      <el-menu :default-active="defaultSect" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" style="border: none" background-color="transparent">
                        <el-menu-item index="1" v-on:click="navMenuClick('')">
                          <i class="el-icon-setting"></i>
                          <span slot="title">全部问题 {{taskConditionData.allNum}}</span>
                        </el-menu-item>
                        <el-menu-item index="2" v-on:click="navMenuClick('today')">
                          <i class="el-icon-setting"></i>
                          <span slot="title">今日问题 {{taskConditionData.tNum}}</span>
                        </el-menu-item>
                        <!--<el-menu-item index="3" v-on:click="navMenuClick('week')">-->
                        <!--<i class="el-icon-setting"></i>-->
                        <!--<span slot="title">本周任务 {{taskConditionData.wNum}}</span>-->
                        <!--</el-menu-item>-->
                        <!--<el-menu-item index="4" v-on:click="navMenuClick('month')">-->
                        <!--<i class="el-icon-setting"></i>-->
                        <!--<span slot="title">本月任务 {{taskConditionData.mNum}}</span>-->
                        <!--</el-menu-item>-->
                        <el-menu-item index="5" v-on:click="navMenuClick('overtime')">
                          <i class="el-icon-setting"></i>
                          <span slot="title">已过期 {{taskConditionData.overtimeNum}}</span>
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
                      <el-table-column prop="jobName" width="200" label="问题标题"></el-table-column>
                      <!--<el-table-column prop="type" label="任务类型"></el-table-column>-->
                      <el-table-column prop="jobLevel"  width="80" label="紧急程度"></el-table-column>
                      <el-table-column prop="userName" width="180"  label="执行人员"></el-table-column>
                      <!--<el-table-column prop="createrName" width="100"  label="执行人"></el-table-column>-->
                      <el-table-column prop="createDate" width="180" label="创建时间"></el-table-column>
                      <el-table-column prop="taskFinishDate" width="180" label="结束时间"></el-table-column>
                      <el-table-column prop="statusStr" label="状态"></el-table-column>
                    </el-table>
                    <div style="padding: 0 1px">
                      <div class="block" style="background-color: #fff; padding: 10px;">
                        <el-pagination @current-change="changePage($event)" layout="prev, pager, next, total, jumper" :total="totalP">
                        </el-pagination>
                      </div>
                    </div>
                  </el-main>
                </el-container>
              </el-container>
            </div>
            <!---->
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="bgCover" v-if="detailformVisible">
        <div class="bgCoverCnt" v-loading="loading">
          <h3>提出问题</h3>
          <div class="planTaskBox">
            <el-form ref="taskForm" :rules="rules" :model="taskForm" label-width="80px">
              <el-form-item label="问题标题" prop="jobName" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="taskForm.jobName" style="width: 300px;" v-bind:disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="紧急程度" prop="jobLevel" maxlength="100" width="100">
                <div class="ratestar" style="padding-top: 6px;">
                  <el-rate v-model="taskForm.jobLevel" v-on:change="rateChange($event)" v-bind:disabled="isDisabled"></el-rate>
                </div>
              </el-form-item>
              <el-form-item label="解决人员" prop="state2" maxlength="100" width="100">
                <!--<el-input class="planNameIpt" v-model="taskForm.userName"></el-input>-->
                <el-col :span="24">
                  <el-autocomplete style="width: 300px;"
                    v-bind:disabled="isDisabled"
                    class="inline-input"
                    v-model="taskForm.state2"
                    :fetch-suggestions="querySearch"
                    placeholder="请搜索解决人员"
                    :trigger-on-focus="false"
                    @select="handleSelectUser"
                  ></el-autocomplete>
                </el-col>
              </el-form-item>
              <!--<el-form-item label="开始时间" prop="date1">-->
              <!--<el-col :span="20">-->
              <!--<el-date-picker type="datetime" v-bind:disabled="isDisabled" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="taskForm.date1" style="width: 300px;">-->
              <!--</el-date-picker>-->
              <!--</el-col>-->
              <!--</el-form-item>-->
              <el-form-item label="预计完成" prop="date2">
                <el-col :span="20">
                  <el-date-picker type="datetime" :picker-options="pickerOptions0" v-bind:disabled="isDisabled" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="taskForm.date2" style="width: 300px;"></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="问题描述" prop="description" maxlength="100" width="100">
                <el-input class="planNameIpt" v-bind:disabled="isDisabled" type="textarea" :rows="2" v-model="taskForm.description" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item style="height: 40px;"></el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onTaskSubmit('taskForm')">立即创建</el-button>
                <el-button @click="onPlanTaskCancel()">取消</el-button>
              </el-form-item>
            </el-form>
            <form id="mytaskForm" enctype="multipart/form-data" style="position: absolute;bottom:70px;padding-left: 12px;">
              <div style="font-size: 14px;color: #555;height: 30px;line-height: 30px;display: inline-block;">添加附件</div>&nbsp;&nbsp;
              <input type="file" id="myfile" name="myfile" placeholder="请选择文件" style="width: 200px;"/>
              <input type="hidden" name="formId" v-bind:value="formId">
              <!--<el-button style="background-color: #409EFF;color: #fff;border: none;border-radius: 4px;padding: 4px;" @click="uploadFile()">立即上传</el-button>-->
              <div style="padding-left: 70px;font-size: 12px;height: 16px;color: #409eff">{{upLoadName}}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
export default {
  name: 'addProlemList',
  data () {
    return {
      msg: '通用项目管理',
      taskId: '',
      detailformVisible: false,
      taskFormVisible: false,
      totalP: 0,
      typeValue: '',
      loading: false,
      totalProject: 0,
      defaultSect: '1',
      userId: this.$store.state.userId,
      activeName2: 'first',
      myProjectListPayload: {
        userId: this.$store.state.userId
      },
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      getTaskConditionPayload: {
        projectUID: this.$store.state.projectUID
      },
      taskDetailForm: {
        jobName: '',
        userName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        description: ''
      },
      // -----------------------
      isDisabled: false,
      upLoadName: '',
      formId: '',
      taskForm: {
        jobName: '',
        userName: '',
        jobLevel: 1,
        date1: '',
        date2: '',
        state2: '',
        description: '',
        taskUserId: ''
      },
      autoCompleteAddTaskPayload: {
        projectManager: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入问题名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入问题名称', trigger: 'blur' }
        ],
        state2: [
          { required: true, message: '请选择问题执行人', trigger: 'change' }
        ],
        jobLevel: [
          { required: true, message: '请选择紧急程度', trigger: 'change' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请填写项目介绍', trigger: 'blur' }
        ]
      },
      // ------------------
      myTaskViewPayload: {
        pageNum: '1',
        pageSize: '10',
        projectUID: this.$store.state.projectUID,
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
      addTaskPayload: {
        projectUID: this.$store.state.projectUID,
        planId: this.$store.state.planId,
        id: '1',
        formId: '',
        jobName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        userId: '',
        _jfinal_token: '',
        userName: ''
      },
      projectList: [],
      confirmFlag: false,
      finishedFlag: false,
      proBelongSelect: '',
      navIndex: '2',
      taskConditionData: {},
      projectConditionData: {},
      // 我的项目列表 返回数据（项目卡片）
      taskListData: []
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
    },
    activeName2: function (newValue, oldValue) {
      var that = this
      if (newValue === 'first') {
        that.$store.commit('setRouterName', {name: '我的问题', url: '/addProlemList'})
        // this.$store.state.routerName = '我的任务'
      }
    }
  },
  updated: function () {
    console.log('update:routerNameArr:', this.$store.state.routerNameArr)
  },
  created: function () {
    var that = this
    // console.log(this.$route.params.id)
    if (this.$route.params.id) {
      that.defaultSect = '0'
    } else {
      that.defaultSect = '1'
    }
    // 我的任务 侧边栏 任务统计
    this.queryGetTaskCondition()
    // 个人任务查看
    this.queryMyTaskView()
    // this.rowClass()
  },
  methods: {
    addNewProble: function () {
      this.detailformVisible = true
    },
    testDiv () {
      var routerNameArr = this.$store.state.routerNameArr
      var routerNameArr0 = this.$store.state.routerNameArr[0].name
      var routerName = this.$store.state.routerName
      console.log('routerName:', routerName)
      console.log('routerNameArr[0].name:', routerNameArr0)
      console.log('routerNameArr:', routerNameArr)
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    rowClass ({ row, column, rowIndex, columnIndex }) {
      // console.log(row)
      if (columnIndex === 0) {
        return 'fontStyle'
      } else if (columnIndex === 5) {
        if (row.status === '0') {
          return 'toStart'
        } else if (row.status === '1') {
          return 'noDone'
        } else if (row.status === '2') {
          return 'finished'
        }
      }
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    totaskDetail (row, column, cell, event) {
      var that = this
      var pID = row.projectUID
      console.log(row)
      var planid = row.uid
      if (column.label === '问题标题') {
        if (pID) {
          that.$router.push('/addProblemDetail/' + planid)
        }
      }
    },
    changePage: function (e) {
      var that = this
      that.myTaskViewPayload.pageNum = e
      that.queryMyTaskView()
    },
    // 任务侧边栏 任务统计情况查看
    queryGetTaskCondition () {
      var that = this
      // this.getTaskConditionPayload.projectUID = proId
      this.ajax('/general/getLaunchTaskCondition', that.getTaskConditionPayload).then(res => {
        if (res.code === 200) {
          that.taskConditionData = res.data
        }
      })
    },
    // 项目侧边栏 项目统计情况查看
    queryGetProjectCondition () {
      var that = this
      // this.getTaskConditionPayload.projectUID = proId
      this.ajax('/general/getProjectCondition', that.getProjectConditionPayload).then(res => {
        // console.log(res)
        if (res.code === 200) {
          that.projectConditionData = res.data
        }
      })
    },
    // 个人任务查看
    queryMyTaskView () {
      var that = this
      this.ajax('/general/myLaunchTaskView', that.myTaskViewPayload).then(res => {
        // console.log('个人任务', res)
        that.taskListData = res.data.list
        that.totalP = res.data.totalRow
      })
    },
    // 任务侧边栏 点击
    navMenuClick (args) {
      this.myTaskViewPayload.sType = args
      this.myTaskViewPayload.uid = ''
      this.queryMyTaskView()
    },
    // -------------
    querySearch (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteAddTaskPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteAddTaskPayload).then(res => {
          // console.log('autoCompleteNames:', res)
          if (res.code === 200) {
            var dddarr = []
            if (res.msg.length > 0) {
              for (var i = 0; i < res.msg.length; i++) {
                var obj = {}
                obj.value = res.msg[i].Name + ' (' + res.msg[i].jName + ')'
                obj.userId = res.msg[i].ID
                obj.position = res.msg[i].jName
                dddarr.push(obj)
              }
              // 调用 callback 返回建议列表的数据
              cb(dddarr)
            } else {
              var aaaddd = []
              that.$message('未能搜索到该人员')
              cb(aaaddd)
            }
          }
        })
      }
    },
    rateChange: function (rateval) {
      this.addTaskPayload.jobLevel = rateval
    },
    handleSelectUser (item) {
      this.addTaskPayload.userId = item.userId
      this.addTaskPayload.userName = item.value
    },
    onPlanTaskCancel () {
      var that = this
      that.isDisabled = false
      that.detailformVisible = false
      that.formDataClear()
    },
    formDataClear: function () {
      this.taskForm.state2 = ''
      this.taskForm.jobName = ''
      this.taskForm.date1 = ''
      this.taskForm.date2 = ''
      this.taskForm.description = ''
      this.taskForm.jobLevel = 0
      this.upLoadName = ''
    },
    onTaskSubmit: function (taskForm) {
      var that = this
      var fileV = $('#myfile').val()
      that.$refs[taskForm].validate((valid) => {
        if (valid) {
          that.loading = true
          this.addTaskPayload.jobName = this.taskForm.jobName
          this.addTaskPayload.taskStartDate = this.taskForm.date1
          this.addTaskPayload.taskFinishDate = this.taskForm.date2
          this.addTaskPayload.description = this.taskForm.description
          this.addTaskPayload._jfinal_token = this.token
          this.addTaskPayload.formId = this.formId
          this.ajax('/general/addTaskSingle', that.addTaskPayload).then(res => {
            if (res.code === 200) {
              that.formId = res.formId
              that.token = res._jfinal_token
              if (!fileV) {
                that.loading = false
                that.formId = ''
                that.detailformVisible = false
                that.queryMyTaskView()
                that.formDataClear()
              } else {
                that.delayfuc()
              }
            } else {
              that.loading = false
            }
          })
        }
      })
    },
    delayfuc () {
      var that = this
      setTimeout(function () {
        that.uploadFile()
      }, 500)
    },
    uploadFile () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#mytaskForm')[0])
      var fileV = $('#myfile').val()
      if (!fileV) {
        that.$message({
          type: 'error',
          message: '请选择上传文件！'
        })
      } else {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFile',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.formId = ''
            that.detailformVisible = false
            that.isDisabled = false
            that.loading = false
            that.queryMyTaskView()
            that.formDataClear()
          } else if (data.code === 300) {
            that.$confirm('是否重新上传附件?', '文件上传失败', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.isDisabled = true
              that.loading = false
              that.detailformVisible = false
            }).catch(() => {
              that.formId = ''
              that.detailformVisible = false
              that.loading = false
              that.formDataClear()
            })
          }
          console.log(data)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .cnt{
    width: 60%;
    margin: 0 auto;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .el-col-11 {
    width: 62.83333%;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 40px;
    line-height: 40px;
  }
  .selectIpt{
    text-align: left;
    margin-top: 20px;
  }
  .el-table .cell{
    text-align: center;
  }
  .listWrap{
    margin-top: 20px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
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

  .el-main {
    _background-color: #E9EEF3;
    color: #333;
    text-align: center;
    /*line-height: 160px;*/
  }

  .el-container {
    _margin-bottom: 40px;
  }

  /*项目卡片*/
  .proCardItem{
    color: #777;
    width: 180px;
    height: 180px;
    border-radius: 6px;
    float: left;
    margin-right: 20px;
    margin-top: 10px;
    box-shadow: 1px 1px 6px #ddd;
    background-color: #fafafa;
  }
  .proCardItem:hover{
    box-shadow: 1px 1px 6px #ccc;
  }
  .addItem{
    font-size: 36px;
    color: #aaa;
    text-align: center;
    line-height: 180px;
    cursor: pointer;
    background-color: #f5f5f5;
  }
  .proCardItemTit{
    font-size: 18px;
    text-align: center;
    padding: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .proLeader,.startTime,.endTime,.proLevel{
    font-size: 14px;
    margin-bottom: 5px;
  }
  /*.testclass{*/
  /*color: yellow;*/
  /*font-weight: bold;*/
  /*background-color: red;*/
  /*}*/
  /*.testclass2{*/
  /*color: green;*/
  /*font-weight: bold;*/
  /*background-color: red;*/
  /*}*/
  .bgCover{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }
  .bgCoverCnt{
    width: 400px;
    height: 420px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -250px;
    padding: 20px 35px;
  }
  .planNameIpt{
    width: 240px;
  }
  .el-col-11{
    width: 240px;
  }
  .el-progress{
    width: 84%;
  }
</style>
