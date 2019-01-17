<template>
  <div class="proDetailPlanTree">
    <div>
      <div>{{getCankanObj?'':''}}</div>
      <div>{{getAddPlanTaskObj?'':''}}</div>
      <div>{{getDelPlanTaskObj ? '' : ''}}</div>
      <!--<h3>这个是proDetailPlanTree</h3>-->
      <div id="treeNodeBox"></div>
      <!--dialog对话框-->
      <el-dialog title="确认要删除？" :visible.sync="dialogVisible" width="30%">
        <span>删除本条会包括本条及其包含内容</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" @click="newDialogOk()">确 定</el-button>
      </span>
      </el-dialog>
      <!--bgcover开始-->
      <div class="bgCover" v-if="bgCoverShow">
        <div class="bgCoverCnt"  v-loading="loading">
          <div class="colose" @click="onPlanTaskCancel()">&#935;</div>
          <div class="bgCoverTabs">
            <el-tabs v-model="activeNameBgCover" @tab-click="handleClickPlanTask">
              <el-tab-pane label="增加计划" name="first" v-bind:disabled="panshow">
                <!--计划form-->
                <div class="planTaskBox">
                  <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                    <el-form-item label="计划名称" prop="name" maxlength="100" width="100" style="margin-bottom: 30px;">
                      <el-input class="planNameIpt" v-model="form.name" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="date1" style="margin-bottom: 30px;">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                                        :picker-options="pickerOptions0"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        :default-value="defaultTime"
                                        v-model="form.date1" style="width: 300px;"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="date2" style="margin-bottom: 30px;">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                                        :picker-options="pickerOptions0"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        :default-value="defaultTime"
                                        v-model="form.date2"
                                        style="width: 300px;"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="计划描述" prop="description" maxlength="100" width="100" style="margin-bottom: 30px;">
                      <el-input class="planNameIpt" type="textarea" :rows="2" v-model="form.description" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onPlanSubmit('form')">立即创建</el-button>
                      <el-button @click="onPlanTaskCancel()">取消</el-button>
                    </el-form-item>
                  </el-form>
                </div>
                <!---->
              </el-tab-pane>
              <el-tab-pane label="增加任务" name="second">
                <!--任务form-->
                <div class="planTaskBox" style="height: 400px;position: relative;padding-top: 0;">
                  <el-form ref="taskForm" :rules="rules" :model="taskForm" label-width="80px">
                    <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                      <el-input class="planNameIpt" v-model="taskForm.jobName" style="width: 300px;" v-bind:disabled="isDisabled"></el-input>
                    </el-form-item>
                    <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                      <div class="ratestar" style="padding-top: 6px;">
                        <el-rate v-model="taskForm.jobLevel" v-on:change="rateChange($event)" v-bind:disabled="isDisabled"></el-rate>
                      </div>
                    </el-form-item>
                    <el-form-item label="任务指派" prop="state2" maxlength="100" width="100">
                      <!--<el-input class="planNameIpt" v-model="taskForm.userName"></el-input>-->
                      <el-col :span="6">
                        <el-autocomplete
                          v-bind:disabled="isDisabled"
                          class="inline-input"
                          v-model="taskForm.state2"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入内容"
                          :trigger-on-focus="false"
                          @select="handleSelectUser"
                        ></el-autocomplete>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="开始时间" prop="date1">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                                        v-bind:disabled="isDisabled"
                                        :picker-options="pickerOptions0"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        :default-value="defaultTime"
                                        v-model="taskForm.date1" style="width: 300px;"
                        >
                        </el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="date2">
                      <el-col :span="20">
                        <el-date-picker type="datetime"
                                        v-bind:disabled="isDisabled"
                                        :picker-options="pickerOptions0"
                                        format="yyyy-MM-dd HH:mm:ss"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        placeholder="选择日期"
                                        :default-value="defaultTime"
                                        v-model="taskForm.date2" style="width: 300px;"
                        ></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="任务描述" prop="description" maxlength="100" width="100">
                      <el-input class="planNameIpt" v-bind:disabled="isDisabled" type="textarea" :rows="2" v-model="taskForm.description" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item style="height: 40px;">
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="onTaskSubmit('taskForm')">立即创建</el-button>
                      <el-button @click="onPlanTaskCancel()">取消</el-button>
                    </el-form-item>
                  </el-form>
                  <form id="mytaskForm" enctype="multipart/form-data" style="position: absolute;bottom:40px;padding-left: 12px;">
                    <div style="font-size: 14px;color: #555;height: 30px;line-height: 30px;display: inline-block;">添加附件</div>&nbsp;&nbsp;
                    <input type="file" id="myfile" name="myfile" placeholder="请选择文件" style="width: 200px;"/>
                    <input type="hidden" name="formId" v-bind:value="formId">
                    <!--<el-button style="background-color: #409EFF;color: #fff;border: none;border-radius: 4px;padding: 4px;" @click="uploadFile()">立即上传</el-button>-->
                    <div style="padding-left: 70px;font-size: 12px;height: 16px;color: #409eff">{{upLoadName}}</div>
                  </form>
                </div>
                <!---->
              </el-tab-pane>
            </el-tabs>
          </div>
          <!---->
          <!---->
        </div>
      </div>
      <!--bgcover结束-->
      <!--bgcover计划详情-->
      <div class="bgCover" v-if="detailformVisible">
        <div class="bgCoverCnt1">
          <h2>计划详情</h2>
          <div class="colose" @click="detailformVisible = false">&#935;</div>
          <div class="bgCoverTabs">
            <!--计划form-->
            <div class="planTaskBox">
              <el-form ref="detailform" :model="detailform" label-width="80px">
                <el-form-item label="计划名称" maxlength="100" width="100">
                  <el-input class="planNameIpt" v-model="detailform.name" readonly></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                  <el-col :span="11">
                    <el-date-picker readonly type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="detailform.date1"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="结束时间">
                  <el-col :span="11">
                    <el-date-picker readonly type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="detailform.date2"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-form-item label="计划描述" maxlength="100" width="100">
                  <el-input class="planNameIpt" readonly type="textarea" :rows="2" v-model="detailform.description"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="detailformVisible = false">关 闭</el-button>
                  <!--<el-button type="primary" @click="onPlanSubmit('form')">立即创建</el-button>-->
                  <!--<el-button @click="onPlanTaskCancel('form')">取消</el-button>-->
                </el-form-item>
              </el-form>
            </div>
            <!---->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store'
$(document).on('click', '.chakan', function () {
  if ($(this).hasClass('projectType0')) {
    store.state.kk = false
  } else {
    store.state.kk = true
    var nodeId = $(this).attr('id')
    var type = $(this).attr('data-projectType')
    var clickNum = store.state.chakanClickObj.clickNum + 1
    var chakanClickObj = {
      clickNum: clickNum,
      type: type,
      id: nodeId
    }
    store.state.chakanClickObj = chakanClickObj
  }
})
$(document).on('click', '.addPlanTaskClick', function () {
  var nodeid = $(this).attr('data-id')
  var nodeProjectType = $(this).attr('data-projectType')
  var clickNum = store.state.addPlanTaskClickObj.clickNum + 1
  var addPlanTaskClickObj = {
    clickNum: clickNum,
    id: nodeid,
    projectType: nodeProjectType
  }
  store.state.addPlanTaskClickObj = addPlanTaskClickObj
})
$(document).on('click', '.delPlanTaskClick', function () {
  if ($(this).hasClass('projectType0')) {
    store.state.kk = false
  } else {
    store.state.kk = true
    var nodeid = $(this).attr('data-id')
    var clickNum = store.state.delPlanTaskClickObj.clickNum + 1
    var delPlanTaskClickObj = {
      clickNum: clickNum,
      id: nodeid
    }
    store.state.delPlanTaskClickObj = delPlanTaskClickObj
  }
})
export default {
  name: 'NewAddPlanTree',
  props: ['proID'],
  data () {
    return {
      msg: '通用项目管理',
      formId: '',
      attachmentId: '',
      upLoadName: '',
      defaultTime: '',
      isDisabled: false,
      detailformVisible: false,
      chakanClickObj: {
        clickNum: 0,
        type: '',
        id: ''
      },
      queryManagePlanPayload: {
        projectUID: ''
      },
      dialogVisible: false,
      token: '',
      childArr: [],
      childIndexArr: [],
      lock: -1,
      addPlanTaskClickObj: {
        clickNum: 0,
        id: '',
        projectType: ''
      },
      delPlanTaskClickObj: {
        clickNum: 0,
        id: ''
      },
      delPlanOrTaskPayload: {
        id: ''
      },
      detailform: {
        name: '',
        dataList: [],
        date1: '',
        date2: '',
        description: ''
      },
      autoCompleteAddTaskPayload: {
        projectManager: ''
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        description: '',
        resource: '',
        desc: ''
      },
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
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        state2: [
          { required: true, message: '请选择任务指派人', trigger: 'change' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      projectUID: '',
      currentClickId: '',
      nodeType: '',
      loading: false,
      panshow: false,
      planshow: false,
      taskshow: false,
      bgCoverShow: false,
      activeNameBgCover: 'first',
      addPlanPayload: {
        projectUID: '1',
        id: '1',
        name: '',
        start: '',
        finish: '',
        description: '',
        _jfinal_token: '',
        duration: '2'
      },
      addTaskPayload: {
        projectUID: '1',
        id: '1',
        formId: '',
        jobName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        userId: '',
        _jfinal_token: '',
        // attachmentId: '',
        userName: ''
      },
      disabledStarTime: '',
      disabledEndTime: '',
      pickerOptions0: {}
    }
  },
  created: function () {
    this.projectUID = this.proID
    this.queryManagePlan2()
    this.getUserInfo()
  },
  watch: {
    addPlanTaskClickObj: function (newQuestion, oldQuestion) {
      var that = this
      if (newQuestion.clickNum !== oldQuestion.clickNum) {
        this.newAddPlanTaskBtn(that.addPlanTaskClickObj.id, that.addPlanTaskClickObj.projectType)
      }
    },
    chakanClickObj: function (newQuestion, oldQuestion) {
      var that = this
      if ((newQuestion.clickNum !== oldQuestion.clickNum) && store.state.kk) {
        if (parseInt(newQuestion.type) === 1) {
          that.detailformVisible = true
          that.showDetail(newQuestion.id)
        } else if (parseInt(newQuestion.type) === 2) {
          that.$router.push('/taskDetailPage/' + newQuestion.id)
        }
      }
    },
    // addPlanTaskClickObj:
    delPlanTaskClickObj: function (newQuestion, oldQuestion) {
      var that = this
      if ((newQuestion.clickNum !== oldQuestion.clickNum) && store.state.kk) {
        that.newCallDialog()
        // this.newAddPlanTaskBtn(that.addPlanTaskClickObj.id, that.addPlanTaskClickObj.projectType)
      }
    }
  },
  computed: {
    // 添加计划/任务
    getAddPlanTaskObj () {
      var that = this
      that.addPlanTaskClickObj = store.state.addPlanTaskClickObj
      return store.state.addPlanTaskClickObj
    },
    getCankanObj () {
      var that = this
      that.chakanClickObj = store.state.chakanClickObj
      return store.state.chakanClickObj
    },
    // 删除计划/任务
    getDelPlanTaskObj () {
      var that = this
      that.delPlanTaskClickObj = store.state.delPlanTaskClickObj
      return store.state.delPlanTaskClickObj
    }
  },
  destroyed: function () {
    // store.state.chakanClickObj.clickNum = 0
    // store.state.chakanClickObj.type = ''
    // store.state.chakanClickObj.id = ''
    this.stateReset()
  },
  methods: {
    stateReset () {
      this.addPlanTaskClickObj = {clickNum: 0, id: '', projectType: ''}
      this.delPlanTaskClickObj = {clickNum: 0, id: ''}
      this.chakanClickObj = {clickNum: 0, type: '', id: ''}

      store.state.addPlanTaskClickObj = {clickNum: 0, id: '', projectType: ''}
      store.state.delPlanTaskClickObj = {clickNum: 0, id: ''}
      store.state.chakanClickObj = {clickNum: 0, type: '', id: ''}
    },
    // 新的树形结构 唤起dialog
    newCallDialog () {
      this.dialogVisible = true
    },
    // 查询人员基本信息
    getUserInfo: function () {
      var that = this
      this.ajax('/general/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          that.log('getUserInfo', res)
          that.taskForm.state2 = res.data.Name + ' (' + res.data.jName + ')'
          that.addTaskPayload.userName = res.data.Name + ' (' + res.data.jName + ')'
          that.addTaskPayload.userId = res.data.ID
        }
      })
    },
    formDataClear: function () {
      this.taskForm.state2 = ''
      this.taskForm.jobName = ''
      this.taskForm.date1 = ''
      this.taskForm.date2 = ''
      this.taskForm.description = ''
      this.taskForm.jobLevel = 1
      this.upLoadName = ''
    },
    newTreeDataClear: function () {
      var that = this
      that.childArr = []
      that.childIndexArr = []
      that.lock = -1
      that.planIcon = 'planIcon'
      $('#treeNodeBox').empty()
    },
    // 计划管理 新的树形结构
    queryManagePlan2: function () {
      var that = this
      // proID $route.params.pid
      that.queryManagePlanPayload.projectUID = that.proID
      this.ajax('/general/managePlan', that.queryManagePlanPayload).then(res => {
        that.log('queryManagePlan2:', res)
        if (res.code === 200) {
          that.token = res._jfinal_token
          if (res.msg[0].member.length > 0) {
            res.msg[0].children = res.msg[0].children.concat(res.msg[0].member)
            res.msg[0].member = []
          }
          if (res.msg[0]) {
            that.xxxFuc('treeNodeBox', res.msg)
          }
        }
      })
    },
    // 计划管理 新的树形结构 函数
    xxxFuc: function (parentId, noteArrData) {
      var that = this
      var result = ''
      for (var i = 0; i < noteArrData.length; i++) {
        if (noteArrData[i].member && noteArrData[i].member.length > 0) {
          noteArrData[i].children = noteArrData[i].children.concat(noteArrData[i].member)
        }
        if (noteArrData[i].children.length > 0) {
          that.childArr.push(noteArrData[i].children)
          that.childIndexArr.push(noteArrData[i].id)
        }
        var projectTypeInt = parseInt(noteArrData[i].projectType)
        var planIcon = parseInt(noteArrData[i].projectType) < 2 ? 'planIcon' : 'taskIcon'
        var isProTit = parseInt(noteArrData[i].projectType) === 0 ? 'proTit' : ''
        var workerName = parseInt(noteArrData[i].projectType) === 2 ? noteArrData[i].userName : ''
        var timeLimitStart = parseInt(noteArrData[i].projectType) === 2 ? noteArrData[i].taskStartDate + ' -- ' : ''
        var timeLimitEnd = parseInt(noteArrData[i].projectType) === 2 ? noteArrData[i].taskFinishDate : ''
        var taskLevelVal = parseInt(noteArrData[i].projectType) === 2 ? noteArrData[i].jobLevel : ''
        var statusVal = parseInt(noteArrData[i].projectType) === 2 ? noteArrData[i].status : ''
        var taskLevelBg = ''
        var statusValColor = ''
        if (parseInt(noteArrData[i].projectType) === 2) {
          // 任务级别 背景色
          if (parseInt(noteArrData[i].jobLevel) <= 2) {
            taskLevelBg = 'taskLevelVal01'
          } else if (parseInt(noteArrData[i].jobLevel) >= 5) {
            taskLevelBg = 'taskLevelVal03'
          } else {
            taskLevelBg = 'taskLevelVal02'
          }
          // 任务状态 字体颜色
          if (parseInt(noteArrData[i].statusCode) === 0) {
            statusValColor = 'taskStatus01'
          } else if (parseInt(noteArrData[i].statusCode) === 1) {
            statusValColor = 'taskStatus02'
          } else {
            statusValColor = 'taskStatus03'
          }
        }

        result += '<div class="childItem ' + isProTit + '" id="' + noteArrData[i].id + '">' +
          '<div class="itemCnt">' +
          '<div class="line">' +
          '<div class="tttt"></div>' +
          '<div class="ganggang"></div>' +
          '<div class="' + planIcon + '"></div>' +
          '<div class="itemCntTit ' + isProTit + '">' + noteArrData[i].label + '</div>' +
          '</div>' +
          '<div class="handleWrap">' +
          '<div class="handleBox">' +
          '<div class="worker">' + workerName + '</div>' +
          '<div class="timeLimit">' + timeLimitStart + timeLimitEnd + '</div>' +
          '<div class="taskLevel"><div class="taskLevelVal ' + taskLevelBg + '">' + taskLevelVal + '</div></div>' +
          '<div class="taskStatus ' + statusValColor + '">' + statusVal + '</div>' +
          '</div>' +
          '<div class="editBox">' +
          '<div class="chakan projectType' + noteArrData[i].projectType + '" data-projectType="' + projectTypeInt + '" id="' + noteArrData[i].id + '">查看详情</div>' +
          '<div class="addPlanTaskClick" data-id="' + noteArrData[i].id + '" data-projectType="' + projectTypeInt + '">添加</div>' +
          '<div class="delPlanTaskClick projectType' + noteArrData[i].projectType + '" data-id="' + noteArrData[i].id + '">删除</div>' +
          '</div>' +
          '</div>' +
          '</div>' +
          '</div>'
      }
      $('#' + parentId).append(result)
      if (that.childArr.length > 0) {
        that.lock = that.lock + 1
        if (that.lock < that.childArr.length) {
          that.xxxFuc(that.childIndexArr[that.lock], that.childArr[that.lock])
        }
      }
    },
    // 新的点击添加
    newAddPlanTaskBtn: function (nodeid, proType) {
      var that = this
      this.currentClickId = nodeid
      this.nodeType = proType
      if (this.nodeType === '2') {
        that.panshow = true
        that.activeNameBgCover = 'second'
      } else {
        that.panshow = false
        that.activeNameBgCover = 'first'
      }
      that.addPlanPayload.id = that.currentClickId
      that.addTaskPayload.id = that.currentClickId
      that.addPlanPayload.projectUID = that.proID
      that.addTaskPayload.projectUID = that.proID
      that.bgCoverShow = true
      this.ajax('/general/getParentTime', {parentId: nodeid, type: proType}).then(res => {
        if (res.code === 200) {
          that.form.date1 = res.data.startDate
          that.form.date2 = res.data.endDate
          that.taskForm.date1 = res.data.startDate
          that.taskForm.date2 = res.data.endDate
          var st = res.data.startDate.split(' ')[0] + ' 00:00:00'
          var et = res.data.endDate
          var sT = new Date(st)
          var eT = new Date(et)
          that.defaultTime = sT
          that.disabledStarTime = sT.getTime()
          that.disabledEndTime = eT.getTime()
          this.pickerOptions0.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
          }
        }
      })
    },
    onPlanTaskCancel () {
      var that = this
      that.isDisabled = false
      that.bgCoverShow = false
      that.form.name = ''
      that.form.date1 = ''
      that.form.date2 = ''
      that.form.description = ''
      that.taskForm.jobName = ''
      that.taskForm.date1 = ''
      that.taskForm.date2 = ''
      that.taskForm.state2 = ''
      that.taskForm.description = ''
      that.taskForm.jobLevel = 0
    },
    // 表单 计划 任务切换
    handleClickPlanTask (tab, event) {
      var that = this
      if (tab.name === 'second') {
        that.addTaskPayload.id = that.currentClickId
      } else if (tab.name === 'first') {
        that.addPlanPayload.id = that.currentClickId
      }
    },
    // 创建添加计划
    onPlanSubmit (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          this.addPlanPayload.name = this.form.name
          this.addPlanPayload.start = this.form.date1
          this.addPlanPayload.finish = this.form.date2
          this.addPlanPayload.description = this.form.description
          this.addPlanPayload._jfinal_token = this.token
          this.ajax('/general/addPlan', that.addPlanPayload).then(res => {
            that.log('addPlan:', res)
            if (res.code === 200) {
              that.bgCoverShow = false
              that.token = res._jfinal_token
              that.newTreeDataClear()
              that.queryManagePlan2()
              // that.queryManagePlan()
              that.loading = false
              that.form.name = ''
              that.form.date1 = ''
              that.form.date2 = ''
              that.form.description = ''
            } else {
              that.loading = false
            }
          })
        }
      })
    },
    // 创建添加任务
    onTaskSubmit: function (taskForm) {
      var that = this
      // var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#mytaskForm')[0])
      var fileV = $('#myfile').val()
      that.log('fileV:', fileV)
      this.$refs[taskForm].validate((valid) => {
        if (valid) {
          that.loading = true
          this.addTaskPayload.jobName = this.taskForm.jobName
          this.addTaskPayload.taskStartDate = this.taskForm.date1
          this.addTaskPayload.taskFinishDate = this.taskForm.date2
          this.addTaskPayload.description = this.taskForm.description
          this.addTaskPayload._jfinal_token = this.token
          this.addTaskPayload.formId = this.formId
          this.ajax('/general/addTask', that.addTaskPayload).then(res => {
            that.log('addTask:', res)
            if (res.code === 200) {
              that.formId = res.formId
              // that.log('that.formId1:', that.formId)
              that.token = res._jfinal_token
              if (!fileV) {
                // console.log('file为空')
                that.bgCoverShow = false
                that.loading = false
                that.formId = ''
                // console.log('that.formId2:', that.formId)
                that.formDataClear()
                that.newTreeDataClear()
                that.queryManagePlan2()
              } else {
                that.log('file不为空')
                // console.log('onTaskSubmit=>formData:', formData)
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
      var url = this.$store.state.baseServiceUrl
      var formData = new FormData($('#mytaskForm')[0])
      // this.log('uploadFile=>formData:', formData)
      var that = this
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
        // that.log('uploadFile:', data)
        if (data.code === 200) {
          that.$message({
            type: 'success',
            message: data.msg
          })
          that.bgCoverShow = false
          that.formId = ''
          that.loading = false
          that.upLoadName = data.data.showName
          that.formDataClear()
          that.newTreeDataClear()
          that.queryManagePlan2()
        } else if (data.code === 300) {
          that.$confirm('是否重新上传附件?', '文件上传失败', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.isDisabled = true
            that.loading = false
            that.bgCoverShow = true
          }).catch(() => {
            that.bgCoverShow = false
            that.formId = ''
            that.loading = false
            that.formDataClear()
            that.newTreeDataClear()
            that.queryManagePlan2()
          })
        }
      })
    },
    showDetail (e) {
      var that = this
      this.detailformVisible = true
      this.ajax('/general/getPlanOrTaskDetail', {id: e}).then(res => {
        if (res.code === 200) {
          that.detailform.name = res.msg.name
          that.detailform.date1 = res.msg.start
          that.detailform.date2 = res.msg.finish
          that.detailform.description = res.msg.description
          // that.detailform.dataList.push(res.msg.start)
          // that.detailform.dataList.push(res.msg.finish)
        }
      })
    },
    // dialogCancel 对话框选择取消
    dialogCancel () {
      this.dialogVisible = false
    },
    // dialogCancel 对话框选择取消
    newDialogOk () {
      // var that = this
      this.dialogVisible = false
      this.newRemovePlanTask()
    },
    // 新的计划树 删除计划或者任务
    newRemovePlanTask: function () {
      var that = this
      that.delPlanOrTaskPayload.id = that.delPlanTaskClickObj.id
      this.ajax('/general/delPlanOrTask', that.delPlanOrTaskPayload).then(res => {
        if (res.code === 200) {
          that.newTreeDataClear()
          that.queryManagePlan2()
        }
      })
    },
    // 计划任务管理 页面 添加  结束
    rateChange: function (rateval) {
      this.addTaskPayload.jobLevel = rateval
    },
    querySearch (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteAddTaskPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteAddTaskPayload).then(res => {
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
    handleSelectUser (item) {
      this.addTaskPayload.userId = item.userId
      this.addTaskPayload.userName = item.value
    }
  }
}
</script>

<style scoped>
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
    height: 460px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -250px;
    padding: 50px;
  }
  .bgCoverCnt1{
    width: 350px;
    height: 300px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -250px;
    padding: 20px 50px 50px 30px;
  }
  .bgCoverCnt1 h2{
    font-size: 16px;
    color: #666;
    font-family: '黑体';
  }
  .colose {
    float: right;
    margin: -40px -45px;
    font-size: 20px;
    color: #409EFF;
    height: 20px;
    width: 20px;
    text-align: center;
    cursor: pointer;
  }
  .planTaskBox{
    padding-top: 30px;
  }
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 16px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 270px;
  }
  .el-col-6{
    width: 300px;
  }
  .el-autocomplete{
    width: 300px;
  }
</style>
