<template>
  <div class="main" v-loading="loading" style="min-height: 930px">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!--<el-breadcrumb-item :to="{ path: '/' }">我的任务</el-breadcrumb-item>-->
      <el-breadcrumb-item
        v-on:click="$store.state.routerNameArr[index].isBack = true"
        :to="{ path: routerNameItem.url }"
        v-bind:id="routerNameItem.url"
        v-for="(routerNameItem, index) in routerNameArr"
        v-bind:key="routerNameItem.name">{{routerNameItem.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cnt">
      <div class="taskHeader">
        <h2>{{taskDetail.jobName}}</h2>
      </div>
      <div class="cont">
        <div class="contLeft">
          <div class="discription msg">
            <h3>任务描述</h3>
            <div v-bind:title="taskDetail.description">{{taskDetail.description}}</div>
          </div>
          <div class="discription">
            <h3>任务附件</h3>
            <div class="imgCon">
              <div class="imgBox" @click="showBigImage(taskDetail.previewUrl, taskDetail.showName)" v-if="taskDetail.showName && taskDetail.imageOrNot === 1" v-bind:style="{backgroundImage: 'url('+taskDetail.downloadUrl+')'}"></div>
              <div style="padding-left: 30px;font-size: 14px;" v-if="taskDetail.showName && taskDetail.imageOrNot === 0">
                <a v-bind:href="taskDetail.downloadUrl" download="附件文档">{{taskDetail.showName}}</a>
              </div>
              <div style="padding-left: 30px;font-size: 14px;color: #999;" v-if="!taskDetail.showName">暂无附件</div>
            </div>
            <div class="line1"></div>
          </div>
          <div class="discription lis">
            <h3>历史记录</h3>
            <div class="add" @click="addRemark()">
              <div class="addRemarkPicBox"><img src="../../static/img/msg.png" alt=""></div>
              <div class="addRemarkText">添加评论</div>
            </div>
            <div class="logBox">
              <ul>
                <li v-bind:key="logs.index" class="contentHide" v-for="(logs,index) in taskLogs"><span>{{(index + 1) + '. ' + logs.oTime}}，</span><span v-if="logs.oTitle">{{logs.oTitle}}</span><span style="font-weight: bold;" v-if="logs.oName">【{{logs.oName}}】</span><span>{{logs.oContent}}。</span>&nbsp;&nbsp;
                  <span v-if="logs.comment" style="position: relative" @click="showContentLog($event)"><i style="color: chocolate" class="el-icon-circle-plus-outline"></i></span>
                  <div class="contBoxContent">{{logs.comment}}</div>
                  <div v-if="logs.uploads && logs.uploads.length > 0" class="contBoxContent">
                    <span @click="showBigImage(logs.uploads[0].previewUrl, logs.uploads[0].showName)" class="filepre">附件: {{logs.uploads[0].showName}}</span>
                    <a v-bind:href="logs.uploads[0].downloadUrl">下载:<i class="el-icon-download"></i></a>
                  </div>
                </li>
              </ul>
            </div>
            <el-pagination
              @current-change = "getPageNum($event)"
              layout="prev, pager, next, total"
              :page-size="5"
              :total="totalData">
            </el-pagination>
          </div>
        </div>
        <div class="contRight">
          <div class="rightTop">
            <h3>基本信息</h3>
            <div v-if="taskDetail.showMenu===0?false:true" class="modifyTaskBtn" v-on:click="modifyTask()">修改任务</div>
            <div>所属项目：<span class="probelong" v-bind:class="taskDetail.projectUID===$store.state.projectUID?'otherPro':''" @click="toProjectDetail(taskDetail.projectUID)">{{taskDetail.projectName}}</span></div>
            <div>创 建 人：{{taskDetail.createrName}}</div>
            <div>指 派 给：{{taskDetail.userName}}</div>
            <div>任务状态：<span v-bind:class="'stateStyle'+ taskDetail.status">{{taskDetail.field1}}</span></div>
            <div><span style="float: left">优 先 级：</span> <el-rate style="float: left" disabled v-model="getjobLevel"></el-rate></div>
            <div class="taskBottom">
              <el-row v-if="taskDetail.showMenu===0?false:true">
                <el-button v-bind:disabled="canStart" @click="confirmTaskStart()">确认开始</el-button>
                <el-button type="primary" v-bind:disabled="canTransfor" @click="taskDevide()">任务分解</el-button>
                <el-button type="primary" @click="transferTask()" v-bind:disabled="canTransfor">移交</el-button>
                <el-button type="success" @click="finishedTask()" v-bind:disabled="canDone">完成</el-button>
              </el-row>
              <el-row>
                <el-button style="" v-if="taskDetail.isRestart" @click="isReStartTask()">重启</el-button>
              </el-row>
            </div>
          </div>
          <div class="rightBot">
            <h3>工时信息</h3>
            <div style="color: darkred">预计开始：{{taskDetail.taskStartDate}}</div>
            <div style="color: #28558c">实际开始：<span v-if="taskDetail.dealWithDate">{{taskDetail.dealWithDate}}</span><span v-if="!taskDetail.dealWithDate">暂未开始</span></div>
            <div style="color: darkred">截止日期：{{taskDetail.taskFinishDate}}</div>
            <div style="color: #28558c">实际结束：<span v-if="taskDetail.realFinishDate">{{taskDetail.realFinishDate}}</span><span v-if="!taskDetail.realFinishDate">暂未完成</span></div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <!--// 添加备注-->
      <el-dialog title="添加评论" :visible.sync="dialogFormVisible"  width="26%">
        <form id="uploadFile" enctype="multipart/form-data">
          <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 添加评论：</div>
          <textarea name="content" id="textArea" cols="60" rows="4" style="width: 98%;"></textarea>
          <div style="height: 30px;line-height: 30px">文件上传：</div>
          <input type="file" id="myfile" name="myfile" placeholder="请选择文件"/><br><br>
          <input type="hidden" name="rid" v-bind:value="rid">
          <input type="hidden" name="rtype" v-bind:value="3">
        <div slot="footer" class="dialog-footer" style="text-align: center;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMarkInfo()">提 交</el-button>
        </div>
        </form>
      </el-dialog>
      <!--// 确定-->
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
      <!--// 分解任务-->
      <div class="bgCover" v-if="bgCoverShow">
        <div class="bgCoverCnt" v-loading="Dloading">
          <div class="colose" @click="onPlanTaskCancel()">&#935;</div>
          <div class="planTaskBox" style="position: relative;padding-top: 0;">
            <el-form ref="taskForm" :rules="rules" :model="taskForm" label-width="80px">
              <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="taskForm.jobName" style="width: 300px;" v-bind:disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                <div class="ratestar" style="padding-top: 6px;">
                  <el-rate v-model="taskForm.jobLevel" v-on:change="rateChange($event)" v-bind:disabled="isDisabled"></el-rate>
                </div>
              </el-form-item>
              <el-form-item label="任务指派" prop="value9" maxlength="100">
                <el-col :span="24">
                  <el-select v-model="taskForm.value9" multiple filterable remote style="width: 300px"
                             :reserve-keyword="false" placeholder="请输人员姓名或拼音(如'张三'或 'zs')"
                             :remote-method="remoteMethod" :loading="loading2">
                    <el-option v-for="item in options4" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                               :value="item.Name + '(' + item.jName + ')' + '_' + item.ID">
                    </el-option>
                  </el-select>
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
              <el-form-item style="height: 40px;"></el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onTaskSubmit('taskForm')">立即创建</el-button>
                <el-button @click="onPlanTaskCancel()">取消</el-button>
              </el-form-item>
            </el-form>
            <form id="mytaskForm" enctype="multipart/form-data" style="position: absolute;bottom:40px;padding-left: 12px;">
              <div style="font-size: 14px;color: #555;height: 30px;line-height: 30px;display: inline-block;">添加附件</div>&nbsp;&nbsp;
              <input type="file" id="devidemyfile" name="myfile" placeholder="请选择文件" style="width: 200px;"/>
              <input type="hidden" name="formId" v-bind:value="formId">
              <!--<el-button style="background-color: #409EFF;color: #fff;border: none;border-radius: 4px;padding: 4px;" @click="uploadFile()">立即上传</el-button>-->
              <div style="padding-left: 70px;font-size: 12px;height: 16px;color: #409eff">{{upLoadName}}</div>
            </form>
          </div>
        </div>
      </div>
      <!--任务移交-->
      <el-dialog title="任务移交" :visible.sync="taskTransferVisible"  width="26%">
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 任务移交人：</div>
        <el-autocomplete style="width: 300px"
           v-model="projectManager"
           :fetch-suggestions="querySearchAsync"
           placeholder="请输入移交人姓名"
           :trigger-on-focus="false"
           @select="handleSelect"
        ></el-autocomplete>
        <form id="taskTransfer" enctype="multipart/form-data">
          <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 移交备注：</div>
          <textarea name="remark" id="Transfer" cols="60" rows="4" style="width: 98%;"></textarea>
          <div style="height: 30px;line-height: 30px">移交附件：</div>
          <input type="file" id="myfileTransfer" name="myfile" placeholder="请选择文件"/><br><br>
          <input type="hidden" name="taskId" v-bind:value="taskId">
          <input type="hidden" name="transferUserId" v-bind:value="transferUserId">
          <input type="hidden" name="transferUserName" v-bind:value="transferUserName">
          <div slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button @click="taskTransferVisible = false">取 消</el-button>
            <el-button type="primary" @click="taskTransfer()">提 交</el-button>
          </div>
        </form>
      </el-dialog>
      <!--预览图片-->
      <el-dialog title="预览图片" :visible.sync="showBigImageVisible">
        <img v-bind:src="preImageUrl" alt="">
      </el-dialog>
    </div>
    <!---->
    <!--修改计划、任务等-->
    <div class="bgCoverModifyTask" v-if="modifyTaskVisible">
      <div class="bgCoverCnt2">
        <h2>修改任务</h2>
        <div class="colose" @click="modifyTaskVisible = false"><i class="el-icon-close"></i></div>
        <div class="bgCoverTabs">
          <!--修改任务form-->
          <div class="planTaskBox">
            <el-form ref="modifyTask" :model="detailTaskform" :rules="modifyTaskRules" label-width="80px">
              <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="detailTaskform.jobName"></el-input>
              </el-form-item>
              <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                <div class="ratestar" style="padding-top: 6px;">
                  <el-rate v-model="detailTaskform.jobLevel" v-on:change="levelChange($event)"></el-rate>
                </div>
              </el-form-item>
              <el-form-item label="开始时间" prop="taskStartDate">
                <el-col :span="24">
                  <el-date-picker style="width: 100%" type="datetime"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailTaskform.taskStartDate"
                                  :picker-options="pickerOptionsTaskSt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="taskFinishDate">
                <el-col :span="24">
                  <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                  <!--format="yyyy-MM-dd HH:mm:ss"-->
                  <el-date-picker type="datetime" style="width: 100%"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailTaskform.taskFinishDate"
                                  :picker-options="pickerOptionsTaskEt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="任务描述" maxlength="100" width="100">
                <el-input class="planNameIpt" type="textarea" style="height: 100px; resize:none;" :rows="2" v-model="detailTaskform.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifyTaskSub('modifyTask')">保存</el-button>
                <el-button @click="modifyTaskVisible = false">关 闭</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'taskDetailPage',
  data () {
    return {
      routerNameArr: '',
      rid: '',
      user: '',
      taskId: '',
      userId: '',
      token: '',
      loading2: false,
      options4: [],
      bgCoverShow: false,
      defaultTime: '',
      formId: '',
      upLoadName: '',
      planid: this.$route.params.planid,
      canDone: false,
      canStart: false,
      canTransfor: false,
      loading: false,
      Dloading: false,
      loading1: false,
      isDisabled: false,
      pagenum: 1,
      totalData: 0,
      taskDetail: '',
      preImageUrl: '',
      taskLogs: '',
      getjobLevel: 0,
      transferUserId: '',
      transferUserName: '',
      showContent: false,
      dialogFormVisible: false,
      // 修改任务弹窗
      modifyTaskVisible: false,
      taskFormVisible: false,
      taskTransferVisible: false,
      showBigImageVisible: false,
      projectManager: '',
      pickerOptions0: {},
      pickerOptionsTaskSt: {},
      pickerOptionsTaskEt: {},
      form: {
        desc: ''
      },
      // 任务修改表单
      detailTaskform: {
        id: '',
        jobName: '',
        jobLevel: 2,
        taskStartDate: '2018-10-10 00:00:00',
        taskFinishDate: '2018-10-10 00:00:00',
        description: ''
      },
      modifyTaskRules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        taskStartDate: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        taskFinishDate: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      taskForm: {
        jobName: '',
        userName: '',
        jobLevel: 1,
        date1: '',
        date2: '',
        state2: '',
        value9: [],
        description: '',
        taskUserId: ''
      },
      addTaskPayload: {
        projectUID: '1',
        id: '1',
        users: [],
        formId: '',
        jobName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        userId: '',
        _jfinal_token: '',
        userName: ''
      },
      moreUserSelectPayload: {
        projectManager: ''
      },
      editTaskPayload: {
        id: '1',
        jobName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        description: '',
        _jfinal_token: ''
      },
      disabledStarTime: '',
      disabledEndTime: '',
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        value9: [
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
      }
    }
  },
  created: function () {
    var that = this
    this.$store.commit('setRouterName', {name: '任务详情', parentName: '', url: '/taskDetailPage/' + that.$route.params.planid})
    this.routerNameArr = this.$store.state.routerNameArr
    // console.log('this.routerNameArr:', this.routerNameArr)
    this.settoken()
    this.getTaskDetail()
    this.getHistoryCont()
    this.getUserInfo()
  },
  destroyed: function () {
    // console.log('distroyed:', this.$store.state.routerNameArr)
  },
  methods: {
    modifyTaskSub: function (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.editTaskPayload.id = that.taskId
          that.editTaskPayload.jobLevel = this.detailTaskform.jobLevel
          that.editTaskPayload.jobName = this.detailTaskform.jobName
          that.editTaskPayload.taskStartDate = this.detailTaskform.taskStartDate
          that.editTaskPayload.taskFinishDate = this.detailTaskform.taskFinishDate
          that.editTaskPayload.description = this.detailTaskform.description
          that.editTaskPayload._jfinal_token = this.token
          that.ajax('/general/editTask', that.editTaskPayload).then(res => {
            that.log('editTask:', res)
            if (res.code === 200) {
              that.$message({
                message: '保存成功！',
                type: 'success'
              })
              that.modifyTaskVisible = false
              that.token = res._jfinal_token
              that.loading = false
              that.formDataClear()
              that.getTaskDetail()
            } else {
              that.loading = false
            }
          })
        }
      })
    },
    levelChange: function (rateval) {
      this.detailTaskform.jobLevel = rateval
    },
    modifyTask: function () {
      this.modifyTaskVisible = true
    },
    settoken: function () {
      this.ajax('/general/setToken', {}).then(res => {
        this.token = res._jfinal_token
      })
    },
    getTaskDetail () {
      var that = this
      var planid = this.$route.params.planid
      this.planid = planid
      // console.log('planid', planid)
      that.ajax('/general/getPlanOrTaskDetail', {id: planid}).then(res => {
        that.log('getPlanOrTaskDetail:', res)
        if (res.code === 200) {
          if (res.msg.realUrl) {
            var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.msg.realUrl + '&showName=' + res.msg.showName
            that.log('downurl:', downurl)
            res.msg.downloadUrl = downurl
          } else {
            that.log('bucunzai')
          }
          that.taskDetail = res.msg
          that.getjobLevel = parseInt(res.msg.jobLevel)
          that.taskForm.date1 = res.msg.taskStartDate
          that.taskForm.date2 = res.msg.taskFinishDate
          that.addTaskPayload.projectUID = res.msg.projectUID
          that.addTaskPayload.id = res.msg.uid
          // 修改
          that.detailTaskform.jobName = res.msg.jobName
          that.detailTaskform.jobLevel = parseInt(res.msg.jobLevel)
          that.detailTaskform.taskStartDate = res.msg.taskStartDate
          that.detailTaskform.taskFinishDate = res.msg.taskFinishDate
          that.detailTaskform.description = res.msg.description
          var start = res.msg.taskStartDate.split(' ')[0] + ' 00:00:00'
          var startMax = res.msg.parentSTime.split(' ')[0] + ' 00:00:00'
          var startTime = new Date(start)
          var startTimeMax = new Date(startMax)
          var disTimes = startTime.getTime()
          var disTimesMax = startTimeMax.getTime()
          this.pickerOptionsTaskSt.disabledDate = function (time) {
            return time.getTime() > disTimes || time.getTime() < disTimesMax
          }
          var end = res.msg.taskFinishDate.split(' ')[0] + ' 00:00:00'
          var endMax = res.msg.parentETime.split(' ')[0] + ' 00:00:00'
          var endTime = new Date(end)
          var endTimeMax = new Date(endMax)
          var disTimeE = endTime.getTime()
          var disTimeEMax = endTimeMax.getTime()
          this.pickerOptionsTaskEt.disabledDate = function (time) {
            return time.getTime() < disTimeE || time.getTime() > disTimeEMax
          }
          // ---------修改结束------------
          var st = ''
          if (res.msg.taskStartDate) {
            st = res.msg.taskStartDate.split(' ')[0] + ' 00:00:00'
          }
          var et = res.msg.taskFinishDate
          var sT = new Date(st)
          var eT = new Date(et)
          that.defaultTime = sT
          that.disabledStarTime = sT.getTime()
          that.disabledEndTime = eT.getTime()
          this.pickerOptions0.disabledDate = function (time) {
            return time.getTime() < that.disabledStarTime || time.getTime() > that.disabledEndTime
          }
          that.taskId = res.msg.uid
          that.userId = res.msg.userId
          if (res.msg.status === '0') {
            that.canDone = true
            that.canStart = false
            that.canTransfor = false
          } else if (res.msg.status === '1') {
            that.canStart = true
            that.canDone = false
            that.canTransfor = false
          } else if (res.msg.status === '2') {
            that.canStart = true
            that.canDone = true
            that.canTransfor = true
          }
        } else {
          that.log('res', res)
        }
      })
    },
    getHistoryCont () {
      var that = this
      var planid = this.$route.params.planid
      that.ajax('/general/getLogAndComment', {rid: planid, rtype: 3, pageSize: 5, pageNum: that.pagenum}).then(res => {
        that.log('getLogAndComment:', res)
        if (res.code === 200) {
          for (var i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].uploads.length > 0) {
              var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.data.list[i].uploads[0].realUrl + '&showName=' + res.data.list[i].uploads[0].showName
              res.data.list[i].uploads[0].downloadUrl = downurl
            }
          }
          that.taskLogs = res.data.list
          that.totalData = res.data.totalRow
        }
      })
    },
    toProjectDetail (pid) {
      if (pid && pid !== this.$store.state.projectUID) {
        this.$router.push('/proDetails/' + pid)
      }
    },
    addMarkInfo () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#uploadFile')[0])
      var taxtV = $('#textArea').val()
      if (taxtV) {
        that.loading = true
        that.dialogFormVisible = false
        $.ajax({
          type: 'post',
          url: url + '/general/addOrEditComment',
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
            that.getHistoryCont()
            that.loading = false
            $('#textArea').val('')
            $('#myfile').val('')
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
        that.loading1 = false
      }
    },
    // 重启
    isReStartTask: function () {
      this.$confirm('是否确定重启此任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ajax('/general/restartTask', {taskId: this.addTaskPayload.id}).then(res => {
          if (res.code === 200) {
            this.log('restartTask', res)
            this.getTaskDetail()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 分解
    getUserInfo: function () {
      // var that = this
      this.ajax('/general/getUserInfo', {}).then(res => {
        if (res.code === 200) {
          // that.taskForm.value9.push(res.data.Name + '(' + res.data.jName + ')-' + res.data.ID)
          // that.addTaskPayload.userName = res.data.Name + ' (' + res.data.jName + ')'
          // that.addTaskPayload.userId = res.data.ID
          // that.user = res.data.Name + '(' + res.data.jName + ')-' + res.data.ID
          // that.log('getUserInfo', that.user)
        }
      })
    },
    // 点击任务分解按钮
    taskDevide () {
      this.bgCoverShow = true
    },
    onPlanTaskCancel () {
      var that = this
      that.isDisabled = false
      that.bgCoverShow = false
      that.formDataClear()
    },
    formDataClear: function () {
      this.taskForm.state2 = ''
      this.taskForm.jobName = ''
      this.taskForm.date1 = ''
      this.taskForm.date2 = ''
      this.taskForm.description = ''
      this.taskForm.jobLevel = 1
      this.upLoadName = ''
      this.options4 = []
      this.taskForm.value9 = []
    },
    rateChange: function (rateval) {
      this.addTaskPayload.jobLevel = rateval
    },
    // querySearch (queryString, cb) {
    //   var that = this
    //   if (queryString) {
    //     that.autoCompleteAddTaskPayload.projectManager = queryString
    //     this.ajax('/general/autoCompleteNames', that.autoCompleteAddTaskPayload).then(res => {
    //       // console.log('autoCompleteNames:', res)
    //       if (res.code === 200) {
    //         var dddarr = []
    //         if (res.msg.length > 0) {
    //           for (var i = 0; i < res.msg.length; i++) {
    //             var obj = {}
    //             obj.value = res.msg[i].Name + ' (' + res.msg[i].jName + ')'
    //             obj.userId = res.msg[i].ID
    //             obj.position = res.msg[i].jName
    //             dddarr.push(obj)
    //           }
    //           // 调用 callback 返回建议列表的数据
    //           cb(dddarr)
    //         } else {
    //           var aaaddd = []
    //           that.$message('未能搜索到该人员')
    //           cb(aaaddd)
    //         }
    //       }
    //     })
    //   }
    // },
    // handleSelectUser (item) {
    //   this.addTaskPayload.userId = item.userId
    //   this.addTaskPayload.userName = item.value
    // },
    // 创建添加任务
    onTaskSubmit: function (taskForm) {
      var that = this
      var fileV = $('#devidemyfile').val()
      that.$refs[taskForm].validate((valid) => {
        if (valid) {
          that.user = ''
          console.log('value9', that.taskForm.value9)
          for (var i = 0; i < that.taskForm.value9.length; i++) {
            var lian = i === (that.taskForm.value9.length - 1) ? '' : '_'
            that.user = that.user + that.taskForm.value9[i].split('_')[0] + '-' + that.taskForm.value9[i].split('_')[1] + lian
          }
          that.Dloading = true
          this.addTaskPayload.users = that.user
          this.addTaskPayload.jobName = this.taskForm.jobName
          this.addTaskPayload.taskStartDate = this.taskForm.date1
          this.addTaskPayload.taskFinishDate = this.taskForm.date2
          this.addTaskPayload.description = this.taskForm.description
          this.addTaskPayload._jfinal_token = this.token
          this.addTaskPayload.formId = this.formId
          this.ajax('/general/addTask', that.addTaskPayload).then(res => {
            if (res.code === 200) {
              that.formId = res.formId
              that.token = res._jfinal_token
              if (!fileV) {
                that.Dloading = false
                that.formId = ''
                that.bgCoverShow = false
                that.$message.success('任务分解成功！')
                that.formDataClear()
              } else {
                // alert('1111')
                that.delayfuc()
              }
            } else {
              that.Dloading = false
            }
          })
        }
      })
    },
    delayfuc () {
      // alert('2222')
      var that = this
      setTimeout(function () {
        // alert('3333')
        that.uploadFile()
      }, 500)
    },
    uploadFile () {
      var that = this
      // alert('4444')
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#mytaskForm')[0])
      var fileV = $('#devidemyfile').val()
      if (!fileV) {
        that.$message({
          type: 'error',
          message: '请选择上传文件！'
        })
      } else {
        $.ajax({
          type: 'post',
          url: url + '/file/uploadFileList',
          data: formData,
          cache: false,
          processData: false,
          contentType: false,
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }).then(function (data) {
          that.log('data:', data)
          if (data.code === 200) {
            // alert('5555')
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.formId = ''
            that.bgCoverShow = false
            that.isDisabled = false
            that.Dloading = false
            that.formDataClear()
          } else if (data.code === 300) {
            that.$confirm('是否重新上传附件?', '文件上传失败', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.isDisabled = true
              that.Dloading = false
              that.bgCoverShow = true
            }).catch(() => {
              that.formId = ''
              that.bgCoverShow = false
              that.Dloading = false
              that.formDataClear()
              that.$message.success('任务分解成功！')
            })
          }
          that.log(data)
        })
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
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.getHistoryCont()
            that.getTaskDetail()
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
          message: '备注不能为空'
        })
        that.loading = false
      }
    },
    taskTransfer () {
      var that = this
      var url = that.$store.state.baseServiceUrl
      var formData = new FormData($('#taskTransfer')[0])
      var transText = $('#Transfer').val()
      if (transText && that.projectManager) {
        that.loading = true
        that.taskTransferVisible = false
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
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.getHistoryCont()
            that.getTaskDetail()
            that.loading = false
            $('#Transfer').val('')
            $('#myfileTransfer').val('')
            that.projectManager = ''
            that.$router.push('/')
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
          message: '移交人和备注不能为空！'
        })
        that.loading = false
      }
    },
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.projectManager = queryString
        this.ajax('/general/autoCompleteNames', {projectManager: that.projectManager}).then(res => {
          if (res.code === 200) {
            var dddarr = []
            if (res.msg.length > 0) {
              for (var i = 0; i < res.msg.length; i++) {
                var obj = {}
                obj.value = res.msg[i].Name + ' (' + res.msg[i].jName + ')'
                obj.userId = res.msg[i].ID
                // obj.jName = res.msg[i].jName
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
    confirmTaskStart () {
      var that = this
      this.ajax('/general/dealTask', {
        taskId: that.taskId,
        userId: that.userId
      }).then(res => {
        if (res.code === 200) {
          that.$message({
            type: 'success',
            message: res.msg
          })
          that.getTaskDetail()
        }
      })
    },
    handleSelect (item) {
      this.transferUserId = item.userId
      this.transferUserName = item.value
    },
    remoteMethod (query) {
      var that = this
      this.log('query:', query)
      if (query !== '') {
        this.loading2 = true
        that.moreUserSelectPayload.projectManager = query
        this.ajax('/general/autoCompleteNames', that.moreUserSelectPayload).then(res => {
          that.log('autoCompleteNames:', res)
          if (res.code === 200) {
            that.options4 = res.msg
            this.loading2 = false
          }
        })
      } else {
        this.options4 = []
      }
    },
    addRemark () {
      this.dialogFormVisible = true
      this.rid = this.$route.params.planid
    },
    showContentLog (e) {
      var obg = e.currentTarget
      if ($(obg).parent().hasClass('contentHide')) {
        $(obg).children().eq(0).removeClass('el-icon-circle-plus-outline').addClass('el-icon-remove-outline')
        $(obg).parent().removeClass('contentHide').addClass('contentShow')
      } else {
        $(obg).children().eq(0).removeClass('el-icon-remove-outline').addClass('el-icon-circle-plus-outline')
        $(obg).parent().removeClass('contentShow').addClass('contentHide')
      }
    },
    getPageNum (e) {
      this.pagenum = e
      this.getHistoryCont()
    },
    showBigImage (url, imgName) {
      if (url) {
        if (this.isImage(imgName)) {
          this.preImageUrl = url
          this.showBigImageVisible = true
        }
      } else {
        this.$message('文件未找到')
      }
    },
    transferTask () {
      this.taskTransferVisible = true
    },
    finishedTask () {
      this.taskFormVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
  *{
    /**/
  }
  div img{
    width: 100%;
  }
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .main{
    width: 80%;
    margin: 0 auto;
  }
  .contentHide .contBoxContent{
    display: none;
  }
  .contentShow .contBoxContent{
    display: block;
  }
  .cnt{
    width: 100%;
    margin: 0 auto;
  }
  .el-breadcrumb{
    height: 10px;
  }
  .taskHeader{
    height: 60px;
    line-height: 60px;
    background-color: #f5f5f5;
    padding-left: 40px;
  }
  .taskHeader h2{
    font-size: 18px;
    color: #666;
    font-family: '黑体';
  }
  .cont{
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #f5f5f5;
  }
  .contLeft{
    width: 66%;
    height: 99.6%;
    margin-left: 20px;
    background-color: #fff;
    box-shadow: 2px 2px 6px #ccc;
  }
  .contRight{
    width: 30%;
    height: 100%;
    margin-right: 20px;
  }
  .line{
    width: 100%;
    height: 8px;
    background-color: #f5f5f5;
  }
  .line1{
    width: 100%;
    height: 2px;
    background-color: #f5f5f5;
    margin: 0 auto;
    margin-top: 10px;
  }
  .contRight .rightTop{
    height: 58%;
    width: 100%;
    background-color: #fff;
    box-shadow: 2px 2px 6px #ccc;
    position: relative;
  }
  .modifyTaskBtn{
    position: absolute;
    right: 15px;
    top: 20px;
    padding: 0 !important;
    color: #3a8ee6 !important;
    border-bottom: 1px solid #3a8ee6;
    cursor: pointer;
  }
  .contRight .rightBot{
    margin-top: 2%;
    height: 40.2%;
    width: 100%;
    background-color: #fff;
    padding-bottom: 20px;
    box-shadow: 2px 2px 6px #ccc;
  }
  .discription{
    padding: 0 20px;
  }
  .discription h3{
    color: #888;
    font-size: 16px;
    font-family: '黑体';
  }
  .discription.msg div{
    color: #666;
    max-height: 260px;
    font-family: '\9ED1\4F53';
    text-indent: 2em;
    font-size: 14px;
    line-height: 20px;
    overflow: scroll;
    width: 98%;
    overflow-x: hidden;
  }
  .imgCon{
    height: 225px;
  }
  .imgBox{
    height: 200px;
    width: 400px;
    padding: 10px;
    margin-left: 30px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    background-color: #f5f5f5;
  }
  .imgBox img{
    width: 100%;
    height: 100%;
    text-align: center;
  }
  ul{
    list-style: none;
  }
  ul li{
    list-style-position: inside;
    font-size: 14px;
    text-indent: 0;
    color: #666;
  }
  .discription.lis{
    position: relative;
  }
  .add{
    color: #3a8ee6;
    position: absolute;
    top: 0;
    right: 20px;
    width: 100px;
    font-size: 14px;
    cursor: pointer;
    display: flex;
  }
  .addRemarkPicBox{
    width: 20px;
    margin-right: 4px;
  }
  .addRemarkPicBox img{
    width: 100%;
  }
  .logBox{
    height: 130px;
    overflow: scroll;
    overflow-x: hidden;
  }
  .logBox li:nth-of-type(1) {
    color: #988106;
  }
  /*.logBox li:nth-of-type(1) span:nth-of-type(1){*/
    /*color: #13ce66;*/
  /*}*/
  .contBoxContent{
    color: #999;
    font-size: 12px;
    padding-left: 20px;
    /*height: 22px;*/
    /*border-bottom: 1px dashed #eee;*/
    background-color: #f5f5f5;
    line-height: 22px;
  }
  /*::-webkit-scrollbar {*/
    /*width: 16px;*/
    /*height: 16px;*/
    /*background-color: #ccc;*/
  /*}*/
  .rightTop h3,.rightBot h3{
    margin: 0;
    color: #888;
    font-size: 16px;
    padding: 20px;
    font-family: '黑体';
  }
  .rightTop>div,.rightBot>div{
    padding:10px 30px;
    font-size: 14px;
    color: #888;
    clear: both;
  }
  .rightTop .taskBottom{
    margin-top: 40px;
    text-align: center;
    padding-bottom: 25px;
  }
  .el-input--small{
    width: 80%;
  }
  .stateStyle0{
    color: #DC1E4A;
  }
  .stateStyle1{
    color: #409EFF;
  }
  .stateStyle2{
    color: #13ce66;
  }
  .stateStyle3{
    color: #ffb400;
  }
  .el-pagination{
    margin-top: 20px;
    text-align: center;
  }
  .probelong{
    color: #3a8ee6;cursor: pointer;text-decoration:underline
  }
  .probelong.otherPro{
    color: #aaa;
  }
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
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -250px;
    padding: 50px;
  }
  .colose {
    float: right;
    margin: -40px -33px;
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
  .el-autocomplete{
    width: 300px;
  }
  .filepre{
    color: #3a8ee6;
    margin-right: 10px;
    cursor: pointer;
  }
  /*任务修改的弹窗*/
  .bgCoverModifyTask{
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }
  .bgCoverCnt2{
    width: 350px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -250px;
    padding: 20px 50px 50px 30px;
  }
  .bgCoverCnt2 h2{
    font-size: 16px;
    color: #666;
    font-family: '黑体';
  }

  .planNameIpt{
    width: 100%;
  }
</style>
