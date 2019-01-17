<template>
  <div class="treeWrap">
    <div class="compBox">
      <proDetailPlanTreeComp v-bind:childrenData="treeData" v-bind:permissions="permissions" v-on:modifyEmit="modifyEmitFuc" v-on:addEmit="addEmitFuc" v-on:chakanEmit="chakanEmitFuc" v-on:delEmit="delClick"></proDetailPlanTreeComp>
    </div>
    <!--bgcover开始 增加计划-->
    <div class="bgCover" v-if="bgCoverShow">
      <div class="bgCoverCnt" v-loading="loading">
        <div class="colose" @click="onPlanTaskCancel()">&#935;</div>
        <div class="bgCoverTabs">
          <el-tabs v-model="activeNameBgCover" @tab-click="handleClickPlanTask">
            <el-tab-pane label="增加计划" name="first" v-bind:disabled="panshow">
              <!--计划form-->
              <div class="planTaskBox">
                <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                  <el-form-item label="计划名称" prop="name" maxlength="100" width="100" style="margin-bottom: 30px;">
                    <el-input class="planNameIpt" v-model="form.name" style="width: 300px;" maxlength="20"></el-input>
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
                          v-model="form.date2" style="width: 300px;"
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
              <div class="planTaskBox" style="position: relative;padding-top: 0;">
                <el-form ref="taskForm" :rules="taskRules" :model="taskForm" label-width="80px">
                  <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                    <el-input class="planNameIpt" v-model="taskForm.jobName" style="width: 300px;" v-bind:disabled="isDisabled" maxlength="20"></el-input>
                  </el-form-item>
                  <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                    <div class="ratestar" style="padding-top: 6px;">
                      <el-rate v-model="taskForm.jobLevel" v-on:change="rateChange($event)" v-bind:disabled="isDisabled"></el-rate>
                    </div>
                  </el-form-item>
                  <!--<el-form-item label="任务指派" prop="state2" maxlength="100" width="100">-->
                    <!--&lt;!&ndash;<el-input class="planNameIpt" v-model="taskForm.userName"></el-input>&ndash;&gt;-->
                    <!--<el-col :span="6">-->
                      <!--<el-autocomplete-->
                        <!--v-bind:disabled="isDisabled"-->
                        <!--class="inline-input"-->
                        <!--v-model="taskForm.state2"-->
                        <!--:fetch-suggestions="querySearch"-->
                        <!--placeholder="请输入内容"-->
                        <!--:trigger-on-focus="false"-->
                        <!--@select="handleSelectUser"-->
                      <!--&gt;</el-autocomplete>-->
                    <!--</el-col>-->
                  <!--</el-form-item>-->
                  <!--指派人员多选 多人指派-->
                  <el-form-item label="任务指派" prop="userArr" maxlength="100">
                    <el-col :span="24">
                      <el-select v-model="value9" multiple filterable remote style="width: 300px"
                                 :reserve-keyword="false" placeholder="请输入关键词"
                                 :remote-method="remoteMethod" :loading="loading2">
                        <el-option v-for="item in options4" :key="item.ID" :label="item.Name + ' (' + item.jName + ')'"
                                   :value="item.Name + '(' + item.jName + ')' + '_' + item.ID">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                  <!--开始时间-->
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
                  <input type="file" id="myfile" name="myfile" placeholder="请选择文件" style="width: 200px;" />
                  <input type="hidden" name="formId" v-bind:value="formId">
                  <div style="padding-left: 70px;font-size: 12px;height: 16px;color: #409eff">{{upLoadName}}</div>
                </form>
              </div>
              <!---->
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <!---->
    <!--bgcover结束-->
    <div class="bgCover" v-if="detailformVisible">
      <div class="bgCoverCnt1">
        <h2>计划详情</h2>
        <div class="colose" @click="detailformVisible = false"><i class="el-icon-close"></i></div>
        <div class="bgCoverTabs">
          <!--计划form-->
          <div class="planTaskBox">
            <el-form ref="detailform" :model="detailform" label-width="80px">
              <el-form-item label="计划名称" maxlength="100" width="100">
                <el-input class="planNameIpt" readonly v-model="detailform.name"></el-input>
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
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </div>
      </div>
    </div>
    <!---->
    <!--修改计划、任务等-->
    <div class="bgCover" v-if="modifyVisible">
      <div class="bgCoverCnt1">
        <h2>修改计划</h2>
        <div class="colose" @click="modifyVisible = false"><i class="el-icon-close"></i></div>
        <div class="bgCoverTabs">
          <!--计划form-->
          <div class="planTaskBox">
            <el-form ref="modify" :model="detailform" :rules="planRules" label-width="80px">
              <el-form-item label="计划名称" prop="name" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="detailform.name" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="开始时间" prop="date1">
                <el-col :span="11">
                  <el-date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailform.date1"
                                  :picker-options="pickerOptionsPlanSt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="date2">
                <el-col :span="11">
                  <el-date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailform.date2"
                                  :picker-options="pickerOptionsPlanEt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="计划描述" maxlength="100" width="100">
                <el-input class="planNameIpt" type="textarea" :rows="2" v-model="detailform.description"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="modifySub('modify')">保存</el-button>
                <el-button @click="modifyVisible = false">关 闭</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!---->
        </div>
      </div>
    </div>
    <!---->
    <!--修改计划、任务等-->
    <div class="bgCover" v-if="modifyTaskVisible">
      <div class="bgCoverCnt2">
        <h2>修改任务</h2>
        <div class="colose" @click="modifyTaskVisible = false"><i class="el-icon-close"></i></div>
        <div class="bgCoverTabs">
          <!--修改任务form-->
          <div class="planTaskBox">
            <el-form ref="modifyTask" :model="detailTaskform" :rules="modifyTaskRules" label-width="80px">
              <el-form-item label="任务名称" prop="jobName" maxlength="100" width="100">
                <el-input class="planNameIpt" v-model="detailTaskform.jobName" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="任务级别" prop="jobLevel" maxlength="100" width="100">
                <div class="ratestar" style="padding-top: 6px;">
                  <el-rate v-model="detailTaskform.jobLevel" v-on:change="levelChange($event)"></el-rate>
                </div>
              </el-form-item>
              <el-form-item label="开始时间" prop="taskStartDate">
                <el-col :span="11">
                  <el-date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailTaskform.taskStartDate"
                                  :picker-options="pickerOptionsTaskSt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="结束时间" prop="taskFinishDate">
                <el-col :span="11">
                  <!--value-format="yyyy-MM-dd HH:mm:ss"-->
                  <!--format="yyyy-MM-dd HH:mm:ss"-->
                  <el-date-picker type="datetime"
                                  format="yyyy-MM-dd HH:mm:ss"
                                  value-format="yyyy-MM-dd HH:mm:ss"
                                  placeholder="选择日期"
                                  v-model="detailTaskform.taskFinishDate"
                                  :picker-options="pickerOptionsTaskEt"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
              <el-form-item label="任务描述" maxlength="100" width="100">
                <el-input class="planNameIpt" type="textarea" :rows="2" v-model="detailTaskform.description"></el-input>
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
    <!---->
  </div>
</template>

<script>
import proDetailPlanTreeComp from './proDetailPlanTreeComp.vue'
export default {
  name: 'proDetailPlanTree',
  props: ['proID'],
  components: {
    proDetailPlanTreeComp
  },
  data () {
    return {
      msg: '',
      token: '',
      treeData: '',
      defaultTime: '',
      // ceshi
      options4: [],
      value9: [],
      list: [],
      loading2: false,
      states: [
        'Alabama', 'Alaska', 'Arizona',
        'Arkansas', 'California', 'Colorado',
        'Connecticut', 'Delaware', 'Florida',
        'Georgia', 'Hawaii', 'Idaho', 'Illinois',
        'Indiana', 'Iowa'
      ],
      // ceshi
      bgCoverShow: false,
      loading: false,
      isDisabled: false,
      activeNameBgCover: 'first',
      panshow: false,
      pickerOptions0: {
        canSee: 'CanSee',
        canEdit: 'CanEdit'
      },
      pickerOptionsPlanSt: {},
      pickerOptionsPlanEt: {},
      pickerOptionsTaskSt: {},
      pickerOptionsTaskEt: {},
      formId: '',
      upLoadName: '',
      disabledStarTime: '',
      disabledEndTime: '',
      currentClickId: '',
      nodeType: '',
      detailformVisible: false,
      modifyVisible: false,
      permissions: {},
      beishu: 0,
      modifyTaskVisible: false,
      autoCompleteAddTaskPayload: {
        projectManager: ''
      },
      moreUserSelectPayload: {
        projectManager: ''
      },
      queryManagePlanPayload: {
        projectUID: ''
      },
      delPlanOrTaskPayload: {
        id: ''
      },
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
      editPlanPayload: {
        id: '1',
        name: '',
        start: '',
        finish: '',
        description: '',
        _jfinal_token: ''
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
      addTaskPayload: {
        projectUID: '1',
        users: [],
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
      // 增加计划 表单
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
      // 增加任务 表单
      taskForm: {
        jobName: '',
        userArr: [],
        userName: '',
        jobLevel: 1,
        date1: '',
        date2: '',
        state2: '',
        description: '',
        taskUserId: ''
      },
      detailform: {
        name: '',
        dataList: [],
        date1: '2018-10-10 00:00:00',
        date2: '2018-10-10 00:00:00',
        description: ''
      },
      // 修改任务表单
      detailTaskform: {
        id: '',
        jobName: '',
        jobLevel: 2,
        taskStartDate: '2018-10-10 00:00:00',
        taskFinishDate: '2018-10-10 00:00:00',
        description: ''
      },
      // 修改任务 验证
      modifyTaskRules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        jobLevel: [
          { required: true, message: '请选择任务等级', trigger: 'change' }
        ],
        taskStartDate: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        taskFinishDate: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ]
      },
      planRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        date1: [
          { type: 'string', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        date2: [
          { type: 'string', required: true, message: '请选择结束日期', trigger: 'change' }
        ]
      },
      // 增加计划 验证
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userArr: [
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
      // 增加任务 验证
      taskRules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        jobName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        userArr: [
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
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    value9: function (newValue, oldValue) {
      this.taskForm.userArr = newValue
      this.log('this.taskForm.state2:', this.taskForm.state2)
    }
  },
  created: function () {
    var that = this
    this.log(999999999999)
    var pid = that.$route.params.pid || that.proID
    this.$store.commit('setRouterName', {name: '项目计划管理', parentName: 'proDetails', url: '/proDetails/' + pid})
    this.queryManagePlan5()
  },
  updated: function () {
    this.getPos()
  },
  mounted: function () {
    this.list = this.states.map(item => {
      return { value: item, label: item }
    })
  },
  methods: {
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
    sortNumber: function (a, b) {
      return b - a
    },
    getPos: function () {
      var that = this
      var x = $('.item-line')
      var c = $('.compBox')
      var itemLeftArr = []
      for (var i = 0; i < x.length; i++) {
        itemLeftArr.push(x[i].offsetLeft)
      }
      var itemSort = itemLeftArr.sort(that.sortNumber)
      var chazhi = ((itemSort[0] - c[0].offsetLeft) / 50) - 4
      this.log('chazhi:', chazhi)
      if (chazhi > 0) {
        that.beishu = parseInt(chazhi)
        that.$emit('beishuEmit', that.beishu)
        // that.$store.state.beishu = parseInt(chazhi)
        this.log('beishu: ', that.$store.state.beishu)
      }
    },
    formDataClear: function () {
      this.taskForm.state2 = ''
      this.taskForm.jobName = ''
      this.taskForm.date1 = ''
      this.taskForm.date2 = ''
      this.taskForm.description = ''
      this.taskForm.jobLevel = 1
      this.upLoadName = ''
      // 计划
      this.form.name = ''
      this.form.date1 = ''
      this.form.date2 = ''
      this.form.description = ''
      // 多人
      this.addTaskPayload.users = []
      this.options4 = []
      this.value9 = []
    },
    handleClickPlanTask: function (tab) {
    },
    querySearch (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteAddTaskPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteAddTaskPayload).then(res => {
          // that.log('autoCompleteNames:', res)
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
    levelChange: function (rateval) {
      this.log('rateval:', rateval)
      this.detailTaskform.jobLevel = rateval
    },
    handleSelectUser (item) {
      this.addTaskPayload.userId = item.userId
      this.addTaskPayload.userName = item.value
    },
    forFuc: function (obj) {
      var that = this
      if (obj.member && obj.member.length > 0) {
        obj.children = obj.children.concat(obj.member)
      }
      var planIcon = parseInt(obj.projectType) < 2 ? 'plan-icon' : 'task-icon'
      obj.planIcon = planIcon
      if (obj.projectType === '0') {
        // j
      } else if (obj.projectType === '1') {
        // j
      } else if (obj.projectType === '2') {
        // taskLevelBg = 'taskLevelVal01'
        var taskLevelBg = ''
        var statusValColor = ''
        if (parseInt(obj.jobLevel) <= 2) {
          taskLevelBg = 'taskLevelVal01'
        } else if (parseInt(obj.jobLevel) >= 5) {
          taskLevelBg = 'taskLevelVal03'
        } else {
          taskLevelBg = 'taskLevelVal02'
        }
        // 任务状态 字体颜色
        if (parseInt(obj.statusCode) === 0) {
          statusValColor = 'taskStatus01'
        } else if (parseInt(obj.statusCode) === 1) {
          statusValColor = 'taskStatus02'
        } else {
          statusValColor = 'taskStatus03'
        }
        // if () {}
        obj.taskLevelBg = taskLevelBg
        obj.statusValColor = statusValColor
      }
      for (var i = 0; i < obj.children.length; i++) {
        // that.forFuc(obj.children[i])
        if (obj.children[i] !== null) {
          that.forFuc(obj.children[i])
        } else {
          obj.children = []
        }
      }
      return obj
    },
    // 计划管理 新的树形结构
    queryManagePlan5: function () {
      var that = this
      that.queryManagePlanPayload.projectUID = that.$route.params.pid || that.proID
      this.ajax('/general/managePlan', that.queryManagePlanPayload).then(res => {
        that.log('managePlan:', res)
        if (res.code === 200) {
          that.token = res._jfinal_token
          if (res.authority === 0) {
            that.permissions.canSee = 'notCanSee'
            that.permissions.canEdit = 'notCanEdit'
          } else if (res.authority === 1) {
            that.permissions.canSee = 'CanSee'
            that.permissions.canEdit = 'notCanEdit'
          } else if (res.authority === 2) {
            that.permissions.canSee = 'CanSee'
            that.permissions.canEdit = 'CanEdit'
          }
          that.treeData = that.forFuc(res.msg[0])
          // that.log('treeData:', that.treeData)
        } else {
          that.log('managePlan:', res.msg)
        }
      })
    },
    addBtnClickTest2: function (obj) {
      this.log(obj)
    },
    newCallDialog () {
      this.dialogVisible = true
    },
    showDetail (e) {
      var that = this
      this.detailformVisible = true
      this.ajax('/general/getPlanOrTaskDetail', {id: e}).then(res => {
        this.log('getPlanOrTaskDetail1111:', res)
        if (res.code === 200) {
          that.detailform.name = res.msg.name
          that.detailform.date1 = res.msg.start
          that.detailform.date2 = res.msg.finish
          that.detailform.description = res.msg.description
        }
      })
    },
    delClick: function (obj) {
      // console.log('TreeTest5:delClick:', obj)
      var that = this
      if (that.permissions.canEdit === 'CanEdit') {
        if (obj.proType === '0') {
          that.log('项目根节点不可删除！')
        } else {
          that.$confirm('删除本条会包括本条及其包含内容，确定删除？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 新的计划树 删除计划或者任务
            that.delPlanOrTaskPayload.id = obj.nodeid
            // console.log('delPlanOrTaskPayload.id:', that.delPlanOrTaskPayload.id)
            this.ajax('/general/delPlanOrTask', that.delPlanOrTaskPayload).then(res => {
              that.log('delPlanOrTask:', res)
              if (res.code === 200) {
                that.queryManagePlan5()
              }
            })
          }).catch(() => {
            // that.loading = false
          })
        }
      } else {
        this.$message('不具备相关操作权限')
      }
    },
    chakanEmitFuc: function (obj) {
      // console.log('eeeeee:', obj)
      var that = this
      if (that.permissions.canSee === 'CanSee') {
        var nodeid = obj.nodeid
        var proType = obj.proType
        if (parseInt(proType) === 1) {
          that.detailformVisible = true
          that.showDetail(nodeid)
        } else if (parseInt(proType) === 2) {
          that.$router.push('/taskDetailPage/' + nodeid)
        }
      } else {
        this.$message('不具备相关操作权限')
      }
    },
    addEmitFuc: function (obj) {
      var that = this
      that.getUserInfo()
      if (that.permissions.canEdit === 'CanEdit') {
        var nodeid = obj.nodeid
        var proType = obj.proType
        this.currentClickId = nodeid
        this.nodeType = proType
        if (proType === '2') {
          that.panshow = true
          that.activeNameBgCover = 'second'
        } else {
          that.panshow = false
          that.activeNameBgCover = 'first'
        }
        that.addPlanPayload.id = that.currentClickId
        that.addTaskPayload.id = that.currentClickId
        that.addPlanPayload.projectUID = that.$route.params.pid || that.proID
        that.addTaskPayload.projectUID = that.$route.params.pid || that.proID
        that.bgCoverShow = true
        this.ajax('/general/getParentTime', {parentId: nodeid, type: proType}).then(res => {
          that.log('getParentTime:', res)
          if (res.code === 200) {
            that.form.date1 = res.data.startDate
            that.form.date2 = res.data.endDate
            that.taskForm.date1 = res.data.startDate
            that.taskForm.date2 = res.data.endDate
            var st = ''
            if (res.data.startDate) {
              st = res.data.startDate.split(' ')[0] + ' 00:00:00'
            }
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
      } else {
        this.$message('不具备相关操作权限')
      }
    },
    onPlanTaskCancel () {
      var that = this
      that.isDisabled = false
      that.bgCoverShow = false
      that.formDataClear()
    },
    // 创建添加计划
    onPlanSubmit (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.addPlanPayload.name = this.form.name
          that.addPlanPayload.start = this.form.date1
          that.addPlanPayload.finish = this.form.date2
          that.addPlanPayload.description = this.form.description
          that.addPlanPayload._jfinal_token = this.token
          that.ajax('/general/addPlan', that.addPlanPayload).then(res => {
            that.log('addplan:', res)
            if (res.code === 200) {
              that.bgCoverShow = false
              that.token = res._jfinal_token
              that.loading = false
              that.formDataClear()
              that.queryManagePlan5()
              that.$message({
                message: '创建计划成功！',
                type: 'success'
              })
            } else {
              that.loading = false
              that.$message({
                message: res.msg
              })
            }
          })
        }
      })
    },
    // 创建添加任务
    onTaskSubmit: function (taskForm) {
      var that = this
      var fileV = $('#myfile').val()
      that.$refs[taskForm].validate((valid) => {
        this.log('valid:', valid)
        this.log('value9:', this.value9)
        if (valid) {
          this.log(123)
          var user = ''
          for (var i = 0; i < that.value9.length; i++) {
            var lian = i === (that.value9.length - 1) ? '' : '_'
            user = user + that.value9[i].split('_')[0] + '-' + that.value9[i].split('_')[1] + lian
          }
          this.log('user:', user)
          // this.addTaskPayload.users.
          that.loading = true
          this.addTaskPayload.jobName = this.taskForm.jobName
          this.addTaskPayload.users = user
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
                that.loading = false
                that.formId = ''
                that.bgCoverShow = false
                that.formDataClear()
                that.queryManagePlan5()
                that.$message({
                  message: '创建任务成功！',
                  type: 'success'
                })
              } else {
                that.delayfuc()
              }
            } else {
              that.$message({
                message: res.msg
              })
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
          if (data.code === 200) {
            that.$message({
              type: 'success',
              message: data.msg
            })
            that.formId = ''
            that.bgCoverShow = false
            that.isDisabled = false
            that.loading = false
            that.formDataClear()
            that.queryManagePlan5()
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
              that.formId = ''
              that.bgCoverShow = false
              that.loading = false
              that.formDataClear()
              that.queryManagePlan5()
            })
          }
          that.log(data)
        })
      }
    },
    modifyEmitFuc: function (obj) {
      var that = this
      // this.log('obj:', obj)
      that.currentClickId = obj.nodeid
      if (that.permissions.canEdit === 'CanEdit') {
        if (obj.proType === '0') {
          this.log('obj的type是0:', obj)
          this.$prompt('请输入新的项目名称', '修改项目名称', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: that.treeData.label,
            inputPattern: /^[^\s]*$/,
            inputErrorMessage: '格式不正确,不可输入空格'
          }).then(({value}) => {
            that.ajax('/general/editBaseInfo',
              {
                projectUID: that.$route.params.pid,
                projectName: value,
                _jfinal_token: this.token
              }).then(res => {
              if (res.code === 200) {
                that.$message.success(res.msg)
                that.token = res._jfinal_token
                that.queryManagePlan5()
                that.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                that.$message({
                  message: res.msg
                })
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            })
          })
        } else if (obj.proType === '1') {
          that.modifyShowDetail(obj.nodeid)
        } else if (obj.proType === '2') {
          that.modifyTaskShowDetail(obj.nodeid)
        }
      } else {
        that.$message('不具备相关操作权限')
      }
    },
    modifyShowDetail (e) {
      var that = this
      this.modifyVisible = true
      this.ajax('/general/getPlanOrTaskDetail', {id: e}).then(res => {
        this.log('getPlanOrTaskDetail222:', res)
        if (res.code === 200) {
          that.detailform.name = res.msg.name
          that.detailform.date1 = res.msg.start
          that.detailform.date2 = res.msg.finish
          that.detailform.description = res.msg.description
          var start = res.msg.start.split(' ')[0] + ' 00:00:00'
          var startMax = res.msg.parentSTime.split(' ')[0] + ' 00:00:00'
          var startTime = new Date(start)
          var startTimeMax = new Date(startMax)
          var disTimes = startTime.getTime()
          var disTimesMax = startTimeMax.getTime()
          this.pickerOptionsPlanSt.disabledDate = function (time) {
            return time.getTime() > disTimes || time.getTime() < disTimesMax
          }
          var end = res.msg.finish.split(' ')[0] + ' 00:00:00'
          var endMax = res.msg.parentETime.split(' ')[0] + ' 00:00:00'
          var endTime = new Date(end)
          var endTimeMax = new Date(endMax)
          var disTimeE = endTime.getTime()
          var disTimeEMax = endTimeMax.getTime()
          this.pickerOptionsPlanEt.disabledDate = function (time) {
            return time.getTime() < disTimeE || time.getTime() > disTimeEMax
          }
        }
      })
    },
    // 获取任务详情
    modifyTaskShowDetail: function (e) {
      var that = this
      this.modifyTaskVisible = true
      this.ajax('/general/getPlanOrTaskDetail', {id: e}).then(res => {
        this.log('getPlanOrTaskDetail333:', res)
        if (res.code === 200) {
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
        }
      })
    },
    // 修改点击了保存
    modifySub: function (formName) {
      // this.alert('计划点击了保存')
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.editPlanPayload.id = that.currentClickId
          that.editPlanPayload.name = this.detailform.name
          that.editPlanPayload.start = this.detailform.date1
          that.editPlanPayload.finish = this.detailform.date2
          that.editPlanPayload.description = this.detailform.description
          that.editPlanPayload._jfinal_token = this.token
          that.ajax('/general/editPlan', that.editPlanPayload).then(res => {
            that.log('editPlan:', res)
            if (res.code === 200) {
              that.$message('保存成功！')
              that.modifyVisible = false
              that.token = res._jfinal_token
              that.loading = false
              that.formDataClear()
              that.queryManagePlan5()
            } else {
              that.loading = false
            }
          })
        }
      })
    },
    modifyTaskSub: function (formName) {
      var that = this
      this.log('that.detailform.jobLevel:', that.detailform.jobLevel)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.loading = true
          that.editTaskPayload.id = that.currentClickId
          that.editTaskPayload.jobLevel = that.detailTaskform.jobLevel
          that.editTaskPayload.jobName = this.detailTaskform.jobName
          that.editTaskPayload.taskStartDate = this.detailTaskform.taskStartDate
          that.editTaskPayload.taskFinishDate = this.detailTaskform.taskFinishDate
          that.editTaskPayload.description = this.detailTaskform.description
          that.editTaskPayload._jfinal_token = this.token
          that.ajax('/general/editTask', that.editTaskPayload).then(res => {
            that.log('editTask:', res)
            if (res.code === 200) {
              that.$message('保存成功！')
              that.modifyTaskVisible = false
              that.token = res._jfinal_token
              that.loading = false
              that.formDataClear()
              that.queryManagePlan5()
            } else {
              that.loading = false
            }
          })
        }
      })
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
    }
  }
}
</script>

<style scoped>
  .treeWrap>.compBox>.child-item{
    margin-left:0
  }
  /* 以下是bgcover */
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
    _height: 460px;
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
  /* 以上是bgcover*/
</style>
