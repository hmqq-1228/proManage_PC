<template>
  <div class="main" v-loading="loading">
    <!--<div class="testDiv" v-on:click="testDiv()">TestDiv</div>-->
    <div class="cnt">
      <h3 v-on:click="tteesstt()">任务和计划</h3>
      <!--<h3 v-on:click="tteesstt2()">任务和计划2</h3>-->
      <div class="tabs">
        <el-tabs v-model="activeName2" type="border-card" @tab-click="handleClick">
          <!--***********
          ***************** 我的任务 *****************
          ***************-->
          <el-tab-pane label="我的任务" name="first">
            <!--我的任务模块-->
            <!--选择搜索 1111111111111111111-->
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
          <!--***********
          ***************** 我的发起 *****************
          ***************-->
          <el-tab-pane label="我的发起" name="third">
            <!--选择搜索111111111111111111111111111111-->
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
            <!--列表-->
            <div class="listWrap">
              <el-container>
                <el-aside width="150px" style="min-height: 500px;">
                  <el-row class="tac">
                    <el-col :span="12" style="width: 100%;height: 553px;">
                      <!--:default-active="defaultSectLaunch"1111111111111111111111111111-->
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
                      <el-table-column prop="jobName"  width="120" label="任务名称"></el-table-column>
                      <!--<el-table-column prop="type" label="任务类型"></el-table-column>-->
                      <el-table-column prop="jobLevel"  width="80" label="任务级别"></el-table-column>
                      <el-table-column prop="userName" width="100"  label="执行人"></el-table-column>
                      <!--<el-table-column prop="createrName" width="100"  label="执行人"></el-table-column>-->
                      <el-table-column prop="createDate" width="150" label="创建时间"></el-table-column>
                      <el-table-column prop="taskStartDate" label="开始时间"></el-table-column>
                      <el-table-column prop="taskFinishDate" label="结束时间"></el-table-column>
                      <el-table-column prop="statusStr" width="80" label="状态"></el-table-column>
                      <!--<el-table-column fixed="right" width="150" label="操作">-->
                        <!--<template slot-scope="scope">-->
                          <!--<el-button v-bind:type="scope.row.isRestart?'primary':'primary'" v-if="scope.row.isRestart" @click="isReStartTask(scope)">重启</el-button>-->
                          <!--<el-button v-bind:type="parseInt(scope.row.status)>0?'info':'danger'" v-if="parseInt(scope.row.status)===0?true:false" @click="confirm(scope)">确认</el-button>-->
                          <!--<el-button v-bind:type="parseInt(scope.row.status)===2?'info':'primary'" v-if="parseInt(scope.row.status)===1?true:false" @click="finished(scope)">完成</el-button>-->
                        <!--</template>-->
                      <!--</el-table-column>-->
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
          </el-tab-pane>
          <!--***********
          ***************** 我的项目模块 *****************
          ***************-->
          <el-tab-pane label="我的项目" name="second">
            <!--列表-->
            <div class="listWrap" style="margin-top:10px;">
              <div class="selectIpt">项目类型
              <el-select v-model="typeValue" placeholder="请选择项目类型" @change="selectType($event)" style="margin-left: 10px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="集团战略" value="4"></el-option>
                <el-option label="公司项目" value="0"></el-option>
                <el-option label="部门项目" value="1"></el-option>
                <el-option label="小组项目" value="2"></el-option>
                <el-option label="个人项目" value="3"></el-option>
              </el-select>
              </div>
              <el-container style="margin-top: 40px;">
                <el-aside width="150px" style="height: 553px;">
                  <!--新增按钮-->
                  <div class="newAddPro">
                    <el-button v-on:click="newAddPro()">新增项目</el-button>
                  </div>
                  <el-row class="tac">
                    <el-col :span="12" style="width: 100%">
                      <!--:default-active="defaultSectPro"1111111111111111111111111111111-->
                      <el-menu :default-active="defaultSectPro" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" style="border: none" background-color="transparent">
                        <el-menu-item index="1" v-on:click="proSideNavClick('2')">
                          <i class="el-icon-menu"></i>
                          <span slot="title">进行中 {{projectConditionData.underwayP}}</span>
                        </el-menu-item>
                        <el-menu-item index="2" v-on:click="proSideNavClick('3')">
                          <i class="el-icon-setting"></i>
                          <span slot="title">已完成 {{projectConditionData.finishP}}</span>
                        </el-menu-item>
                        <el-menu-item index="3" v-on:click="proSideNavClick('0')">
                          <i class="el-icon-setting"></i>
                          <span slot="title">未开始 {{projectConditionData.unstartP}}</span>
                        </el-menu-item>
                      </el-menu>
                    </el-col>
                  </el-row>
                </el-aside>
                <el-container>
                  <!--<el-header>Header</el-header>-->
                  <el-main>
                    <!---->
                    <div class="proCard clear">
                      <!---->
                      <div class="proCardItem addItem" v-on:click="newAddPro()">
                        +
                      </div>
                      <div class="proCardItem" v-for="item in projectViewData.list" v-bind:key="item.projectUID" v-bind:id="item.projectUID" @click="toProDetail($event)">
                        <div class="proCardItemTit" v-bind:title="item.projectName">{{item.projectName}}</div>
                        <div class="proLeader" style="text-align: left;padding-left: 12%;">负 &nbsp;责 &nbsp;人: {{item.projectManager}}</div>
                        <div class="proLeader" style="text-align: left;padding-left: 12%;">项目类型: {{item.projectType}}</div>
                        <div class="startTime" style="text-align: left;padding-left: 12%;">开始日期: {{item.startDate}}</div>
                        <div class="endTime" style="text-align: left;padding-left: 12%;">结束日期: {{item.endDate}}</div>
                        <!--<div class="proLevel">项目级别: {{item.projectLevel}}</div>-->
                        <div class="progressBox" style="margin-top: 10px;">
                          <el-progress :text-inside="true" :stroke-width="16" :percentage="item.proportion" status="success"></el-progress>
                        </div>
                        <div class="proDelete" v-if="item.isDelProject" v-on:click="proDelete(item.projectUID)"><i class="el-icon-close"></i></div>
                      </div>
                      <!---->
                    </div>

                    <div style="padding: 0 1px;margin-top: 30px;">
                      <div class="block" style="background-color: #fff; padding: 10px;">
                        <el-pagination :page-size="myProjectViewPayload.pageSize" layout="prev, pager, next, total, jumper" :total="totalProject" @current-change="changeProjectPage($event)">
                        </el-pagination>
                      </div>
                    </div>
                  </el-main>
                </el-container>
              </el-container>
            </div>
            <!---->
          </el-tab-pane>
          <el-tab-pane label="我的日程" name="four">
            <!---->
          </el-tab-pane>
        </el-tabs>
      </div>
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
      <div class="bgCover" v-if="detailformVisible">
        <div class="bgCoverCnt">
          <div style="height: 50px;font-weight: bold;text-align: center">任务详情</div>
          <div class="bgCoverTabs">
                <!--任务form-->
                <div class="planTaskBox">
                  <el-form ref="taskDetailForm" :model="taskDetailForm" label-width="80px">
                    <el-form-item label="任务名称" maxlength="100" width="100">
                      <el-input class="planNameIpt" readonly v-model="taskDetailForm.jobName"></el-input>
                    </el-form-item>
                    <el-form-item label="任务级别" maxlength="100" width="100">
                      <div class="ratestar" style="padding-top: 6px;">
                        <el-rate disabled v-model="taskDetailForm.jobLevel" v-on:change="rateChange($event)"></el-rate>
                      </div>
                    </el-form-item>
                    <el-form-item label="任务指派" maxlength="100" width="100">
                      <el-input readonly class="planNameIpt" v-model="taskDetailForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间">
                      <el-col :span="11">
                        <el-date-picker readonly type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="taskDetailForm.taskStartDate" style="width: 100%;">
                        </el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="结束时间">
                      <el-col :span="11">
                        <el-date-picker readonly type="datetime" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" v-model="taskDetailForm.taskFinishDate" style="width: 100%;"></el-date-picker>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="任务描述" maxlength="100" width="100">
                      <el-input readonly class="planNameIpt" type="textarea" :rows="2" v-model="taskDetailForm.description"></el-input>
                    </el-form-item>
                    <el-form-item style="margin: 0;text-align: center;">
                      <el-button @click="detailformVisible = false" style="margin-right: 15%;">取 消</el-button>
                      <!--<el-button type="primary" @click="onTaskSubmit">立即创建</el-button>-->
                      <!--<el-button @click="onPlanTaskCancel()">取消</el-button>-->
                    </el-form-item>
                  </el-form>
                </div>
          </div>
        </div>
      </div>
      <div class="taskPlanModel">
        <el-dialog title="新建项目模板" :visible.sync="dialogTemplateVisible">
          <div>
            <el-row>
              <el-col style="width: 32%;margin-right: 1.33%;margin-top: 10px;">
                <el-card :body-style="{ padding: '0px' }" class="cartHover">
                  <div style="padding: 14px;" @click="toDefultAddProject()">
                    <div class="modelItem">
                      <span class="modelName">空白模板</span>
                      <el-tag type="danger" style="float: right">空白模板</el-tag>
                    </div>
                    <div class="modelPeo">
                      <!--<div class="modelTime">项目周期：<span style="font-size: 14px">自定义</span></div>-->
                      <div class="button">创建人：管理员</div>
                    </div>
                    <div class="bottom clearfix">
                      <time class="time"><i class="el-icon-time"></i> 2018-12-12 00:00:00</time>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col style="width: 32%;margin-right: 1.33%;margin-top: 10px;" v-for="(model, index) in modelList" v-bind:key="index">
                <el-card :body-style="{ padding: '0px' }" class="cartHover">
                  <div style="padding: 14px;" @click="toModelAddProject(model.id)">
                    <div class="modelItem">
                      <span class="modelName" v-bind:title="model.modelName">{{model.modelName}}</span>
                      <el-tag type="warning" style="float: right">{{model.modelType}}</el-tag>
                    </div>
                    <div class="modelPeo">
                      <!--<div class="modelTime">项目周期：<span>{{model.duration}}</span> 天</div>-->
                      <div class="button">创建人：{{model.creator}}</div>
                    </div>
                    <div class="bottom clearfix">
                      <time class="time"><i class="el-icon-time"></i> {{model.createDate}}</time>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div class="block" style="text-align: center">
              <el-pagination
                @current-change="modelCurrentChange($event)"
                :page-size="modelData.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalModelNum">
              </el-pagination>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="concelTemplate()">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// import $ from 'jquery'
export default {
  name: 'TaskPlan',
  data () {
    return {
      msg: '通用项目管理',
      taskId: '',
      modelList: [],
      modelData: {
        pageNum: '1',
        pageSize: 5
      },
      taskListActionName: 'myTaskView',
      proBelongListActionName: 'myProjectList',
      taskConditionActionName: 'getTaskCondition',
      totalModelNum: 0,
      detailformVisible: false,
      taskFormVisible: false,
      dialogTemplateVisible: false,
      totalP: 0,
      typeValue: '',
      loading: false,
      totalProject: 0,
      defaultSect: '2',
      defaultSectLaunch: '1',
      defaultSectPro: '1',
      ConditionType: '',
      userId: this.$store.state.userId,
      activeName2: 'first',
      myProjectListPayload: {
        userId: this.$store.state.userId
      },
      getTaskConditionPayload: {
        userId: this.$store.state.userId,
        projectUID: ''
      },
      taskDetailForm: {
        jobName: '',
        userName: '',
        jobLevel: 1,
        taskStartDate: '',
        taskFinishDate: '',
        description: ''
      },
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
      // 查询个人项目列表
      myProjectViewPayload: {
        userId: this.$store.state.userId,
        status: '2',
        pageNum: '1',
        projectType: '',
        pageSize: 17
      },
      // 项目统计情况查看
      getProjectConditionPayload: {
        userId: this.$store.state.userId,
        projectType: ''
      },
      projectList: [],
      confirmFlag: false,
      finishedFlag: false,
      // 所属项目
      proBelongSelect: '',
      // 所属项目 我的发起
      proBelongLaunchSelect: '',
      navIndex: '2',
      taskConditionData: {},
      projectConditionData: {},
      // 我的项目列表 返回数据（项目卡片）
      projectViewData: {},
      taskListData: [],
      tableData: [
        {
          proBelong: '通用项目',
          planBelong: '通用项目管理',
          taskName: '通用项目管理',
          taskType: '一般项目',
          taskLevel: '1',
          creater: 'admin',
          createTime: '2018-10-11',
          startTime: '2016-05-02',
          endTime: '2016-05-02',
          state: '进行中'
        }
      ]
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
        that.$store.commit('setRouterName', {name: '我的任务', url: '/'})
        // this.$store.state.routerName = '我的任务'
      } else if (newValue === 'second') {
        that.$store.commit('setRouterName', {name: '我的项目', url: '/'})
        // this.$store.state.routerName = '我的项目'
      } else if (newValue === 'four') {
        this.$router.push('/Schedule')
      }
    }
  },
  updated: function () {
    // console.log('update:routerNameArr:', this.$store.state.routerNameArr)
  },
  created: function () {
    var that = this
    // console.log(this.$route.params.id)
    if (this.$route.params.id) {
      that.defaultSect = '0'
    } else {
      that.defaultSect = '2'
    }
    // activeName2
    if (this.$store.state.routerNameArr[0].name === '我的项目') {
      that.$store.commit('setRouterName', {name: '我的项目', parentName: 'TaskPlan', url: '/'})
      that.activeName2 = 'second'
      // 项目统计情况查看
      that.queryGetProjectCondition()
      // 查询个人项目列表
      that.queryMyProjectView()
    } else if (this.$store.state.routerNameArr[0].name === '我的任务') {
      that.taskListActionName = 'myTaskView'
      that.proBelongListActionName = 'myProjectList'
      that.taskConditionActionName = 'getTaskCondition'
      that.$store.commit('setRouterName', {name: '我的任务', parentName: 'TaskPlan', url: '/'})
      that.activeName2 = 'first'
      // 个人项目列表查看（项目id，项目名）
      that.queryMyProjectList()
      // 我的任务 侧边栏 任务统计
      that.queryGetTaskCondition()
      // 个人任务查看
      that.queryMyTaskView()
    } else if (this.$store.state.routerNameArr[0].name === '我的发起') {
      that.taskListActionName = 'myLaunchTaskView'
      that.proBelongListActionName = 'myLaunchProjectList'
      that.taskConditionActionName = 'getLaunchTaskCondition'
      that.$store.commit('setRouterName', {name: '我的任务', parentName: 'TaskPlan', url: '/'})
      that.activeName2 = 'third'
      // 个人项目列表查看（项目id，项目名）
      that.queryMyProjectList()
      // 我的任务 侧边栏 任务统计
      that.queryGetTaskCondition()
      // 个人任务查看
      that.queryMyTaskView()
    } else {
      that.taskListActionName = 'myTaskView'
      that.proBelongListActionName = 'myProjectList'
      that.taskConditionActionName = 'getTaskCondition'
      // 个人项目列表查看（项目id，项目名）
      this.queryMyProjectList()
      // 我的任务 侧边栏 任务统计
      this.queryGetTaskCondition()
      // 个人任务查看
      this.queryMyTaskView()
      // this.rowClass()
    }
  },
  methods: {
    selectVal (e, p) {
      // this.log('selectVal-index:', e)
      // this.log('selectVal-path:', p)
    },
    tteesstt: function () {
      this.$router.push('/TaskPlan2')
      // this.defaultSect = '2'
    },
    // 重置左侧栏筛选条件
    resetCondition () {
      // 侧边栏激活状态设置 我的任务 我的发起 我的项目
      this.defaultSect = '2'
      this.defaultSectLaunch = '1'
      this.defaultSectPro = '1'
      // “我的项目”项目所属类型选择
      this.typeValue = ''
      // “我的任务”、“我的发起”项目所属类型选择
      this.proBelongSelect = ''
      // “我的任务”、“我的发起”侧边栏条件选择 默认“全部”
      this.myTaskViewPayload.sType = ''
      // 我的项目侧边栏条件选择 默认“进行中”
      this.myProjectViewPayload.status = '2'
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
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
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
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
    changeProjectPage: function (e) {
      var that = this
      that.myProjectViewPayload.pageNum = e
      that.queryMyProjectView()
    },
    // 点击切换
    handleClick (tab, event) {
      var that = this
      that.proBelongSelect = ''
      this.resetCondition()
      // this.tteesstt()
      setTimeout(function () {
        that.log(886)
      }, 1000)
      // this.defaultSect = '100'
      // this.tteesstt()
      // this.defaultSectLaunch = '1'
      // this.defaultSectPro = '1'
      this.log('defaultSect:', this.defaultSect)
      this.log('defaultSectLaunch:', this.defaultSectLaunch)
      this.log('defaultSectPro:', this.defaultSectPro)
      if (tab.name === 'second') {
        that.$store.state.routerName = '我的项目'
        that.$store.commit('setRouterName', {name: '我的项目', parentName: 'TaskPlan', url: '/'})
        // 项目统计情况查看
        that.queryGetProjectCondition()
        // 查询个人项目列表
        that.queryMyProjectView()
      } else if (tab.name === 'first') {
        that.taskListActionName = 'myTaskView'
        that.proBelongListActionName = 'myProjectList'
        that.taskConditionActionName = 'getTaskCondition'
        that.$store.state.routerName = '我的任务'
        that.$store.commit('setRouterName', {name: '我的任务', parentName: 'TaskPlan', url: '/'})
        // 个人项目列表查看（项目id，项目名）
        that.queryMyProjectList()
        // 我的任务 侧边栏 任务统计
        that.queryGetTaskCondition()
        // 个人任务查看
        that.queryMyTaskView()
      } else if (tab.name === 'third') {
        that.taskListActionName = 'myLaunchTaskView'
        that.proBelongListActionName = 'myLaunchProjectList'
        that.taskConditionActionName = 'getLaunchTaskCondition'
        that.$store.state.routerName = '我的发起'
        that.$store.commit('setRouterName', {name: '我的发起', parentName: 'TaskPlan', url: '/'})
        // 个人项目列表查看（项目id，项目名）
        that.queryMyProjectList()
        // 我的任务 侧边栏 任务统计
        that.queryGetTaskCondition()
        // 个人任务查看
        that.queryMyTaskView()
      }
      this.resetCondition()
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
    toProDetail (e) {
      var pid = e.target.parentNode.id
      if (pid) {
        this.$router.push('/proDetails/' + pid)
      }
    },
    selectType (e) {
      // this.log('type', e)
      // this.typeValue = e
      this.myProjectViewPayload.projectType = e
      this.getProjectConditionPayload.projectType = e
      this.queryMyProjectView()
      this.queryGetProjectCondition()
    },
    // 个人项目列表查看（精简版，项目id，项目名）
    queryMyProjectList () {
      var that = this
      this.ajax('/general/' + that.proBelongListActionName, that.myProjectListPayload).then(res => {
        // this.log('选择所属项目:', res)
        if (res.code === 200) {
          that.projectList = res.data
        }
      })
    },
    // 查询个人项目列表 (项目卡片)
    queryMyProjectView () {
      var that = this
      this.ajax('/general/myProjectView', that.myProjectViewPayload).then(res => {
        // console.log('项目卡片', res)
        if (res.code === 200) {
          // res.data.list
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i].startDate = res.data.list[i].startDate.split(' ')[0]
            res.data.list[i].endDate = res.data.list[i].endDate.split(' ')[0]
          }
          that.projectViewData = res.data
          that.totalProject = res.data.totalRow
        }
        // console.log(res.code)
      })
    },
    // 任务侧边栏 任务统计情况查看
    queryGetTaskCondition () {
      var that = this
      this.ajax('/general/' + that.taskConditionActionName, that.getTaskConditionPayload).then(res => {
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
      this.ajax('/general/' + that.taskListActionName, that.myTaskViewPayload).then(res => {
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
    // 任务侧边栏 点击
    navMenuClick (args) {
      this.ConditionType = args
      this.myTaskViewPayload.pageNum = 1
      this.myTaskViewPayload.sType = args
      this.myTaskViewPayload.uid = ''
      this.$router.push('/')
      this.queryMyTaskView()
    },
    // 我的项目 侧边栏 点击
    proSideNavClick (args) {
      this.ConditionType = args
      this.myProjectViewPayload.pageNum = 1
      this.myProjectViewPayload.status = args
      this.queryMyProjectView()
    },
    // 选择模板
    newAddPro () {
      var that = this
      that.dialogTemplateVisible = true
      // this.$router.push('/NewAddPro')
      that.ajax('/model/getModelList', that.modelData).then(res => {
        if (res.code === 200) {
          that.log('getModelList:', res)
          that.modelList = res.data.list
          that.totalModelNum = res.data.totalRow
        }
        // console.log('个人任务:', that.taskListData)
      })
    },
    chooseTemplate: function () {
      // this.$router.push('/NewAddPro')
    },
    modelCurrentChange: function (e) {
      // this.log('page', e)
      this.modelData.pageNum = e
      this.newAddPro()
    },
    toDefultAddProject: function () {
      this.$router.push('/NewAddPro')
    },
    toModelAddProject: function (mId) {
      this.$router.push('/modelAddProject/' + mId)
    },
    concelTemplate: function () {
      this.dialogTemplateVisible = false
    },
    proDelete: function (proId) {
      var that = this
      this.$confirm('确定要删除该项目及其下所有计划和任务?', '删除项目', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        that.ajax('/general/delProjectById', {projectUID: proId}).then(res => {
          if (res.code === 200) {
            // 项目统计情况查看
            that.queryGetProjectCondition()
            // 查询个人项目列表
            that.queryMyProjectView()
            that.loading = false
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        that.loading = false
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
  .el-row {
    margin-bottom: 20px;
    &:last-child {
     margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .el-col:hover{
    box-shadow: 1px 1px 4px #ccc;
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
    margin-top: 40px;
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
  .newAddPro{
    padding-top: 15px;
    padding-bottom: 10px;
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
    position: relative;
    float: left;
    margin-right: 20px;
    margin-top: 10px;
    box-shadow: 1px 1px 6px #ddd;
    background-color: #fafafa;
  }
  .proCardItem:hover{
    box-shadow: 1px 1px 6px #ccc;
  }
  .proCardItem:hover .proDelete{
    display: block;
  }
  .proDelete{
    width: 20px;
    height: 20px;
    border-radius: 10px;
    line-height: 20px;
    text-align: center;
    background: rgba(0,0,0,0.1);
    position: absolute;
    top: 5px;
    right: 5px;
    display: none;
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
    width: 340px;
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
  /*-----------*/
  .time {
    font-size: 14px;
    color: #999;
  }
  .bottom {
    margin-top: 20px;
    line-height: 12px;
    color: #666;
    font-family: '黑体';
  }
  .button {
    padding: 0;
    _float: right;
    color: #888;
    font-size: 13px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
  .cartHover:hover{
    background-color: #f5f8f8;
  }
  .modelTime{
    color: #888;
    font-size: 14px;
    font-family: 黑体;
    display: inline-block;
  }
  .modelTime span{
    color: chocolate;
    font-size: 18px;
    font-weight: bold;
  }
  .modelItem{
    display: inline-block;
    width: 100%;
  }
  .modelName{
    font-size: 18px;
    font-family: 黑体;
    width: 72%;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .modelPeo{
    height: 24px;
    line-height: 24px;
    margin-top: 10px;
  }
</style>
