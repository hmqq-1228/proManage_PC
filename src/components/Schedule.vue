<template>
  <div class="Schedule">
    <div class="header">
      <!-- 临时性 返回我的任务 c1e2fa -->
      <div class="BackToTask" v-on:click="backTask()"><i class="el-icon-caret-left"></i>我的任务</div>
      <div class="headerCnt">
        <div class="headerCntTit">
          <div>
            <i class="el-icon-caret-left" v-on:click="monBefore()"></i>
            <span>{{year}}年{{month}}月</span>
            <i class="el-icon-caret-right" v-on:click="monNext()"></i>
          </div>
          <div class="radioSelect">
            <!--<el-radio style="margin-left: 15px;" v-model="radio" label="1">我的日程</el-radio>-->
            <!--<el-radio style="margin-left: 15px;" v-model="radio" label="2">我的任务</el-radio>-->
            <!--<el-radio style="margin-left: 15px;" v-model="radio" label="3">我的发起</el-radio>-->
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="我的日程"></el-checkbox>
              <el-checkbox label="我的任务"></el-checkbox>
              <el-checkbox label="我的发起"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="typeSelect">
          <!--<el-button-group>-->
            <!--<el-button size="small" type="primary">年</el-button>-->
            <!--<el-button size="small" type="primary">月</el-button>-->
            <!--<el-button size="small" type="primary">日</el-button>-->
          <!--</el-button-group>-->
          <div class="newAddSchedule">
            <el-button type="primary" v-on:click="createSchedule()">新建日程</el-button>
            <!--<div class="newScheduleForm" v-if="newScheduleFormShow">-->
              <!--<div class="formArrow"></div>-->
              <!--<div class="newScheduleIpt"><el-input v-model="newScheduleTit" placeholder="请输入要做什么"></el-input></div>-->
              <!--<div class="newScheduleDate">-->
                <!--<el-date-picker style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="value1" :picker-options="pickerOptions" type="datetime" placeholder="选择开始时间"></el-date-picker>-->
                <!--<el-date-picker style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="value2" :picker-options="pickerOptions2" type="datetime" placeholder="选择结束时间"></el-date-picker>-->
              <!--</div>-->
              <!--<div class="durationSelect">-->
                <!--<el-select v-model="durationValue" placeholder="请选择提醒时间">-->
                  <!--<el-option-->
                    <!--v-for="item in durationOptions"-->
                    <!--:key="item.value"-->
                    <!--:label="item.label"-->
                    <!--:value="item.value">-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</div>-->
              <!--<div class="formBtnBox">-->
                <!--<div class="formBtn formBtnCancel" v-on:click="newScheduleCancel()">取消</div>-->
                <!--<div class="formBtn formBtnOk" v-on:click="newScheduleOk()">确定</div>-->
              <!--</div>-->
            <!--</div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="weekHeader">
        <div class="weekItem">日</div>
        <div class="weekItem">一</div>
        <div class="weekItem">二</div>
        <div class="weekItem">三</div>
        <div class="weekItem">四</div>
        <div class="weekItem">五</div>
        <div class="weekItem">六</div>
      </div>
      <div class="grids">
        <div class="grid" v-for="(day, index) in monGrids" :key="day.id" v-on:dblclick="gridDoubleClick(day, index, $event)">
          <div class="dayDate" v-bind:class="day.light?'light2':''">{{day.date===0?'':day.date}}</div>
          <div class="taskBox" v-if="day.date===0?'':day.date">
            <div class="taskItem" v-bind:class="taskItem.light?'light':''" v-for="taskItem in day.dayTaskList" :key="taskItem.mark_id"
                 v-on:mouseover="mouseover(taskItem.id, $event)" v-on:mouseleave="mouseout(taskItem.id)">
              {{taskItem.title}}
            </div>
            <div class="taskItemMore" v-bind:class="day.moreLight?'light':''" v-if="day.totalNum > 4"><span v-on:click="moreClick(index, day.date, $event)">+{{day.totalNum - 4}}更多</span></div>
          </div>
        </div>
      </div>
      <!-- 新建日程 悬浮窗 -->
      <div class="newScheduleForm" v-if="newScheduleFormShow" v-bind:style="{ top: newScheduleTop + 'px', left: newScheduleLeft + 'px' }">
        <div class="formArrow"></div>
        <div class="newScheduleIpt"><el-input v-model="newScheduleTit" placeholder="请输入要做什么"></el-input></div>
        <div class="newScheduleDate">
          <el-date-picker style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="value1" :picker-options="pickerOptions" type="datetime" placeholder="选择开始时间"></el-date-picker>
          <el-date-picker style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="value2" :picker-options="pickerOptions2" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </div>
        <div class="durationSelect">
          <el-select v-model="durationValue" placeholder="请选择提醒时间">
            <el-option
              v-for="item in durationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="formBtnBox">
          <div class="formBtn formBtnCancel" v-on:click="newScheduleCancel()">取消</div>
          <div class="formBtn formBtnOk" v-on:click="newScheduleOk()">确定</div>
        </div>
      </div>
      <!-- 点击更多 悬浮窗出来 -->
      <div class="taskItemMoreList" v-if="moreListShow" v-on:mouseleave="moreMouseout()" v-bind:style="{ top: moreDetailTop + 'px', left: moreDetailLeft + 'px' }">
        <div class="taskItemMoreDate">{{month}}月{{currentGridData.currentDate}}日</div>
        <div class="MoreTitleBox">
          <div class="taskItemMoreTitle" v-for="moreItem in moreTaskList" :key="moreItem.markId" v-on:mouseover="mouseover(moreItem.id, $event)" v-on:mouseleave="mouseout(moreItem.id)">{{moreItem.title}}</div>
        </div>
        <div class="morePagination">
          <el-pagination small layout="prev, pager, next" :page-size="5" :total="totalRow" @current-change="currentChange($event)"></el-pagination>
        </div>
        <div class="close" v-on:click="close()"><i class="el-icon-close"></i> </div>
      </div>
      <!--简易详情悬浮窗-->
      <div class="ScheduleDetail" v-on:mouseover="detailMouseOver()" v-on:mouseleave="detailMouseOut()" v-if="ScheduleDetailShow" v-bind:style="{ top: detailTop + 'px', left: detailLeft + 'px' }">
        <div class="detailFormArrow" v-bind:style="{ top: detailArrowTop + 'px', left: detailArrowLeft + 'px'}"></div>
        <div class="detailTit">{{titleType}}</div>
        <div class="newScheduleIpt"><el-input v-bind:disabled="detailCanEdit" v-model="detailScheduleTit" placeholder="请输入要做什么"></el-input></div>
        <div class="newScheduleDate">
          <el-date-picker v-bind:disabled="detailCanEdit" style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="detailValue1" type="datetime" placeholder="选择开始时间"></el-date-picker>
          <el-date-picker v-bind:disabled="detailCanEdit" style="width: 170px; padding-right: 15px;" value-format="yyyy-MM-dd HH:mm:ss" v-model="detailValue2" type="datetime" placeholder="选择结束时间"></el-date-picker>
        </div>
        <div class="durationSelect" v-if="currentTargetType===1?true:false">
          <el-select v-bind:disabled="detailCanEdit" v-model="detailDurationValue" placeholder="请选择提醒时间">
            <el-option
              v-for="item in durationOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="formBtnBox">
          <div class="formBtn formBtnCancel" v-if="currentTargetType<=1?true:false" v-on:click="detailDel()">{{detailEditBtn?'取消':'删除'}}</div>
          <div class="formBtn formBtnOk" v-if="currentTargetType<=1?true:false" v-on:click="detailEdit()">{{detailEditBtn?'保存':'编辑'}}</div>
          <div class="formBtn toTaskDetail" v-else v-on:click="toTaskDetail()">查看详情</div>
        </div>
        <!--<div class="DetailCnt">-->
          <!--<div class="detailTit"><span>任务：</span>这个是任务标题</div>-->
        <!--</div>-->
        <!---->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Schedule',
  data () {
    return {
      /** 点击更多 显示/隐藏 */
      moreListShow: false,
      pickerOptions: {},
      pickerOptions2: {},
      /** 大开关 */
      kk: true,
      /** 详情悬浮窗 “编辑”点击状态开关 */
      detailEditBtn: false,
      /** 详情悬浮窗 是否禁用 */
      detailCanEdit: true,
      /** 详情悬浮窗类型（任务或者日程） **/
      titleType: '',
      ScheduleDetailShow: false,
      detailTop: 0,
      detailLeft: 0,
      moreDetailLeft: 0,
      moreDetailTop: 0,
      detailArrowTop: 22,
      detailArrowLeft: -5,
      newScheduleTop: 0,
      newScheduleLeft: 0,
      /** 当前格子传值数据 */
      currentGridData: {
        currGridIndex: 1,
        currentDate: ''
      },
      /** 鼠标经过 当前日程/任务id */
      currentTargetId: '',
      /** 鼠标经过 当前日程/任务类型 */
      currentTargetType: 1,
      totalRow: 1,
      newScheduleFormShow: false,
      /** 新建日程 多少分钟前提醒 */
      durationValue: 0,
      /** 新建日程 开始时间 结束时间 */
      value1: '',
      value2: '',
      /** 新建日程 输入标题 */
      newScheduleTit: '',
      radio: '1',
      checkList: ['我的日程'],
      year: 2018,
      month: 1,
      weekDay: 0, // 某月的一号是周几
      dateOneFormart: '', // 某月1号的格式化日期
      monthMax: 31,
      monGrids: [],
      scheduleList: [],
      allScheduleTaskId: [],
      /** 点击查看更多 */
      moreTaskList: [],
      scheduleListPayload: {
        sStartTime: '2018-12-01 00:00:00',
        /** 查询结束时间 */
        sEndTime: '2018-12-31 00:00:00',
        /** 是否查询我的日程 */
        schedule: true,
        /** 是否查询我的任务 */
        task: false,
        /** 是否查询我发起的任务 */
        launchTask: false
      },
      /** 查看更多 */
      getScheduleDetailListPayload: {
        pageNum: 1,
        pageSize: 5,
        date: '2018-12-27',
        schedule: true,
        task: false,
        launchTask: false
      },
      /** 新建日程 */
      addSchedulePayload: {
        title: '',
        startTime: '',
        endTime: '',
        minute: 15
      },
      /** 编辑日程 sdId */
      editSchedulePayload: {
        title: '',
        startTime: '',
        endTime: '',
        minute: 15,
        sdId: ''
      },
      /** 删除日程 */
      delSchedulePayload: {
        sdId: ''
      },
      durationOptions: [{
        value: 5,
        label: '开始前五分钟(默认)'
      }, {
        value: 15,
        label: '开始前十五分钟'
      }, {
        value: 30,
        label: '开始前半小时'
      }, {
        value: 60,
        label: '开始前一小时'
      }, {
        value: 1440,
        label: '开始前一天'
      }, {
        value: 0,
        label: '不提醒'
      }],
      /** 日程详情 多少分钟前提醒 */
      detailDurationValue: '',
      /** 日程详情标题 */
      detailScheduleTit: '',
      /** 日程详情 开始时间 结束时间 */
      detailValue1: '',
      detailValue2: ''
    }
  },
  watch: {
    // 如果 `testData` 发生改变，这个函数就会运行
    radio: function (newValue, oldValue) {
      var that = this
      if (newValue === '1') {
        that.scheduleListPayload.schedule = true
        that.scheduleListPayload.task = false
        that.scheduleListPayload.launchTask = false
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = true
        that.getScheduleDetailListPayload.task = false
        that.getScheduleDetailListPayload.launchTask = false
      } else if (newValue === '2') {
        that.scheduleListPayload.schedule = false
        that.scheduleListPayload.task = true
        that.scheduleListPayload.launchTask = false
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = false
        that.getScheduleDetailListPayload.task = true
        that.getScheduleDetailListPayload.launchTask = false
      } else if (newValue === '3') {
        that.scheduleListPayload.schedule = false
        that.scheduleListPayload.task = false
        that.scheduleListPayload.launchTask = true
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = false
        that.getScheduleDetailListPayload.task = false
        that.getScheduleDetailListPayload.launchTask = true
      }
      that.dateMountInit(that.monDateOneFormart())
    },
    durationValue: function (newValue, oldValue) {
      // this.alert('newValue:' + newValue)
    },
    checkList: function (newValue, oldValue) {
      var that = this
      // this.log('checkbox=>newValue:', newValue)
      if (newValue.length === 1) {
        if (newValue[0] === '我的日程') {
          that.scheduleListPayload.schedule = true
          that.scheduleListPayload.task = false
          that.scheduleListPayload.launchTask = false
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = true
          that.getScheduleDetailListPayload.task = false
          that.getScheduleDetailListPayload.launchTask = false
        }
        if (newValue[0] === '我的任务') {
          that.scheduleListPayload.schedule = false
          that.scheduleListPayload.task = true
          that.scheduleListPayload.launchTask = false
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = false
          that.getScheduleDetailListPayload.task = true
          that.getScheduleDetailListPayload.launchTask = false
        }
        if (newValue[0] === '我的发起') {
          that.scheduleListPayload.schedule = false
          that.scheduleListPayload.task = false
          that.scheduleListPayload.launchTask = true
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = false
          that.getScheduleDetailListPayload.task = false
          that.getScheduleDetailListPayload.launchTask = true
        }
      } else if (newValue.length === 2) {
        if (newValue[0] === '我的日程' && newValue[1] === '我的任务') {
          that.scheduleListPayload.schedule = true
          that.scheduleListPayload.task = true
          that.scheduleListPayload.launchTask = false
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = true
          that.getScheduleDetailListPayload.task = true
          that.getScheduleDetailListPayload.launchTask = false
        } else if (newValue[0] === '我的日程' && newValue[1] === '我的发起') {
          that.scheduleListPayload.schedule = true
          that.scheduleListPayload.task = false
          that.scheduleListPayload.launchTask = true
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = true
          that.getScheduleDetailListPayload.task = false
          that.getScheduleDetailListPayload.launchTask = true
        } else {
          that.scheduleListPayload.schedule = false
          that.scheduleListPayload.task = true
          that.scheduleListPayload.launchTask = true
          /** 查看更多 ***/
          that.getScheduleDetailListPayload.schedule = false
          that.getScheduleDetailListPayload.task = true
          that.getScheduleDetailListPayload.launchTask = true
        }
      } else if (newValue.length === 3) {
        that.scheduleListPayload.schedule = true
        that.scheduleListPayload.task = true
        that.scheduleListPayload.launchTask = true
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = true
        that.getScheduleDetailListPayload.task = true
        that.getScheduleDetailListPayload.launchTask = true
      } else {
        that.scheduleListPayload.schedule = false
        that.scheduleListPayload.task = false
        that.scheduleListPayload.launchTask = false
        /** 查看更多 ***/
        that.getScheduleDetailListPayload.schedule = false
        that.getScheduleDetailListPayload.task = false
        that.getScheduleDetailListPayload.launchTask = false
      }
      that.dateMountInit(that.monDateOneFormart())
    },
    value1: function (newValue, oldValue) {
      var that = this
      this.value2 = this.getNextFormartTime(newValue)
      this.pickerOptions2.disabledDate = function (time) {
        var value1Stamp = new Date(that.value1).getTime()
        // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > disabledStarTime
        return time.getTime() < value1Stamp - 8.64e7
      }
    }
  },
  created: function () {
    // var that = this
    var dateObj = new Date()
    this.year = dateObj.getFullYear()
    this.month = dateObj.getMonth() + 1
    // 日期挂载
    this.dateMountInit(this.monDateOneFormart())
    // 获取日程列表
    // this.getScheduleList()
    // this.log('时间：', this.getNextFormartTime())
    // this.$store.commit('setRouterName', {name: '我的日程', parentName: '', url: '/Schedule'})
  },
  mounted: function () {
    // this.$store.commit('setRouterName', {name: '我的日程', parentName: '', url: '/Schedule'})
  },
  methods: {
    backTask: function () {
      this.$store.state.TaskPlanCurrentTab = 'MyTask'
      this.$router.push('/')
    },
    // 以半小时计的时间段
    getHalfHoursTime: function (dateFormart) {
      var dateObj = new Date(dateFormart)
      var timeStamp = dateObj.getTime()
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      var forMartDate = ''
      if (m < 30) {
        m = 30
        forMartDate = year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
      } else {
        var dateNextHalfObj = new Date((60 - m) * 60 * 1000 + timeStamp)
        var dateNextYear = dateNextHalfObj.getFullYear()
        var dateNextMonth = dateNextHalfObj.getMonth() + 1
        var dateNextDate = dateNextHalfObj.getDate()
        var dateNextHours = dateNextHalfObj.getHours()
        forMartDate = dateNextYear + '-' + dateNextMonth + '-' + dateNextDate + ' ' + dateNextHours + ':00:00'
      }
      return forMartDate
    },
    // 获取当前时间
    getNowFormartTime: function () {
      var dateObj = new Date()
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
    },
    // 当前时间一小时后的时间
    getNextFormartTime: function (st) {
      var dateObjNow = ''
      if (st) {
        dateObjNow = new Date(st)
      } else {
        // this.alert(1)
        dateObjNow = new Date()
      }
      // var dateObjNow = new Date()
      var timestr = dateObjNow.getTime() + 1 * 60 * 60 * 1000
      var dateObj = new Date(timestr)
      var year = dateObj.getFullYear()
      var month = dateObj.getMonth() + 1
      var date = dateObj.getDate()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      // this.alert(year + '-' + month + '-' + date + '-' + h + ':' + m)
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      return year + '-' + month + '-' + date + ' ' + h + ':' + m + ':' + '00'
    },
    // 新建日程 清空表单
    newScheduleClear: function () {
      this.newScheduleTit = ''
      this.durationValue = 0
      this.value1 = ''
      this.value2 = ''
    },
    // 获取某月的天数
    getMonDays: function () {
      var that = this
      var d = new Date(that.year, that.month, 0)
      return d.getDate()
    },
    // 某月1号的格式化日期
    monDateOneFormart: function () {
      this.dateOneFormart = this.year + '-' + this.month + '-' + '01' + ' 00:00:00'
      return this.dateOneFormart
    },
    // 日期挂载到格子初始化
    dateMountInit: function (dateFormart) {
      var that = this
      this.monGrids = []
      var myDate = new Date(dateFormart)
      this.month = myDate.getMonth() + 1
      this.monthMax = this.getMonDays()
      var weekDay = myDate.getDay()
      that.weekDay = weekDay
      // 请求体赋值
      that.scheduleListPayload.sStartTime = that.year + '-' + that.month + '-01' + ' 00:00:00'
      that.scheduleListPayload.sEndTime = that.year + '-' + that.month + '-' + that.monthMax + ' 00:00:00'
      // 日程接口调用
      this.ajax('/schedule/getScheduleList', that.scheduleListPayload).then(res => {
        this.log('actionName:getScheduleList:', res)
        if (res.code === 200) {
          // this.log(0)
          // that.scheduleList = res.data.schedule
          for (var i = 0; i < 42; i++) {
            var obj = {
              date: 0,
              totalNum: 0,
              dayTaskList: [],
              light: false,
              moreListShow: false,
              moreLight: false,
              id: 'id_' + that.month + '_' + i
            }
            if (i >= weekDay) {
              if (i - (weekDay - 1) <= that.monthMax) {
                obj.date = i - (weekDay - 1)
                var scheduleIndex = i - (weekDay - 1) - 1
                for (var t = 0; t < res.data.schedule[scheduleIndex].info.length; t++) {
                  var stype = res.data.schedule[scheduleIndex].info[t].type
                  res.data.schedule[scheduleIndex].info[t].mark_id = 'mark_' + (i - (weekDay - 1)) + '_' + stype + '_' + res.data.schedule[scheduleIndex].info[t].id
                  // res.data.schedule[scheduleIndex].info[t].showDetails = false
                }
                obj.dayTaskList = obj.dayTaskList.concat(res.data.schedule[scheduleIndex].info)
                obj.totalNum = res.data.schedule[scheduleIndex].totalNum
              }
            }
            this.monGrids.push(obj)
          }
          // that.log('getScheduleList', res)
          that.queryAllScheduleTaskId()
          // that.log('this.monGrids:', that.monGrids)
        } else {
          // that.log('getScheduleList', res)
        }
      })
    },
    // 获取所有天的所有任务、日程ID
    queryAllScheduleTaskId: function () {
      var that = this
      this.ajax('/schedule/getScheduleIDList', that.scheduleListPayload).then(res => {
        // that.log('getScheduleIDList:', res)
        if (res.code === 200) {
          that.allScheduleTaskId = res.data.schedule
        } else {
          // that.log(res.msg)
        }
      })
    },
    // 上一个月
    monBefore: function () {
      if (this.month === 1) {
        this.year = this.year - 1
        this.month = 12
      } else {
        this.month = this.month - 1
      }
      this.dateMountInit(this.monDateOneFormart())
    },
    // 下一个月
    monNext: function () {
      if (this.month === 12) {
        this.year = this.year + 1
        this.month = 1
      } else {
        this.month = this.month + 1
      }
      this.dateMountInit(this.monDateOneFormart())
    },
    /** 鼠标悬停 */
    mouseover: function (targetId, e) {
      var that = this
      if (that.kk) {
        var obj = e.currentTarget
        that.currentTargetId = targetId
        // this.log('obj:top:', $(obj).offset().top)
        // this.log('obj:left:', $(obj).offset().left)
        // that.alert('top:' + $(obj).offset().top)
        if ($(obj).offset().left > 1400) {
          that.detailLeft = $(obj).offset().left - 400
          that.detailArrowLeft = 395
        } else {
          that.detailLeft = $(obj).offset().left + 180
          that.detailArrowLeft = -5
        }
        if ($(obj).offset().top > 700) {
          that.detailTop = $(obj).offset().top - 200
          that.detailArrowTop = 205
        } else {
          that.detailTop = $(obj).offset().top - 17
          that.detailArrowTop = 22
        }
        // detailArrowLeft
        // 如果新建日程弹窗是显示状态 任务/日程列表的详情弹窗不显示
        if (!this.newScheduleFormShow) {
          this.ScheduleDetailShow = true
        }
        for (var i = 0; i < that.monGrids.length; i++) {
          var isInList = false
          var isInAllId = false
          // var showDetails = false
          for (var t = 0; t < that.monGrids[i].dayTaskList.length; t++) {
            if (that.monGrids[i].dayTaskList[t].id === targetId) {
              that.currentTargetType = that.monGrids[i].dayTaskList[t].type
              isInList = true
              // titleType
              that.titleType = that.monGrids[i].dayTaskList[t].type === 1 ? '日程' : '任务'
              that.detailScheduleTit = that.monGrids[i].dayTaskList[t].title
              that.detailValue1 = that.monGrids[i].dayTaskList[t].startTime
              that.detailValue2 = that.monGrids[i].dayTaskList[t].endTime
              that.detailDurationValue = that.monGrids[i].dayTaskList[t].remindMinute
              // showDetails = true
              // that.monGrids[i].dayTaskList[t].showDetails = true
              break
            } else {
              var dayIndex = i - (that.weekDay - 1) - 1
              for (var r = 0; that.allScheduleTaskId[dayIndex] && r < that.allScheduleTaskId[dayIndex].info.length; r++) {
                if (that.allScheduleTaskId[dayIndex].info[r].id === targetId) {
                  isInAllId = true
                }
              }
            }
          }
          if (isInList) {
            that.monGrids[i].dayTaskList[t].light = true
            that.monGrids[i].light = true
          }
          if (!isInList && isInAllId) {
            that.monGrids[i].light = true
            that.monGrids[i].moreLight = true
          }
          // if (showDetails) {
          //
          // }
        }
      }
      // that.log('mouseover:', that.monGrids)
    },
    /** 详情弹窗 鼠标悬停 */
    detailMouseOver: function () {
      this.ScheduleDetailShow = true
      // this.detailEditBtn = false
      // this.detailCanEdit = true
    },
    /** 详情弹窗 鼠标移出 */
    detailMouseOut: function () {
      if (this.detailEditBtn) {
        // j
      } else {
        this.ScheduleDetailShow = false
      }
      // this.ScheduleDetailShow = false
      // this.detailEditBtn = false
      // this.detailCanEdit = true
    },
    /** 鼠标移出 */
    mouseout: function (targetId) {
      var that = this
      if (that.kk) {
        this.ScheduleDetailShow = false
        for (var i = 0; i < that.monGrids.length; i++) {
          // var isInList = false
          // var isInAllId = false
          for (var t = 0; t < that.monGrids[i].dayTaskList.length; t++) {
            if (that.monGrids[i].dayTaskList[t].id === targetId) {
              that.monGrids[i].dayTaskList[t].light = false
              that.monGrids[i].light = false
              // isInList = true
            } else {
              var dayIndex = i - (that.weekDay - 1) - 1
              for (var r = 0; that.allScheduleTaskId[dayIndex] && r < that.allScheduleTaskId[dayIndex].info.length; r++) {
                if (that.allScheduleTaskId[dayIndex].info[r].id === targetId) {
                  // that.monGrids[i].dayTaskList[t].light = true
                  that.monGrids[i].light = false
                  // isInAllId = true
                  that.monGrids[i].moreLight = false
                  // that.log('移出找到了')
                }
              }
            }
          }
        }
      }
      // that.log('mouseover:', that.monGrids)
    },
    // 点击更多 加载更多 翻页
    moreClick: function (gridIndex, date, e) {
      var that = this
      if (e) {
        var obj = e.currentTarget
        this.moreDetailLeft = $(obj).offset().left
        this.moreDetailTop = $(obj).offset().top - 98
      }
      // 如果新建日程弹窗是显示状态 则取消新建
      this.newScheduleCancel()
      this.moreListShow = true
      that.currentGridData.currGridIndex = gridIndex
      that.currentGridData.currentDate = date
      that.getScheduleDetailListPayload.date = that.year + '-' + that.month + '-' + date
      this.ajax('/schedule/getScheduleDetailList', that.getScheduleDetailListPayload).then(res => {
        this.log('getScheduleDetailList:', res)
        if (res.code === 200) {
          that.monGrids[gridIndex].moreListShow = true
          this.totalRow = res.data.totalRow
          for (var r = 0; r < res.data.list.length; r++) {
            res.data.list[r].markId = res.data.list[r].id + '_' + res.data.list[r].type
          }
          that.moreTaskList = res.data.list
        } else {
          // that.log(res.msg)
        }
      })
    },
    // 分页
    currentChange: function (e) {
      this.log(e)
      var that = this
      that.getScheduleDetailListPayload.pageNum = e
      that.moreClick(that.currentGridData.currGridIndex, that.currentGridData.currentDate)
      // this.alert(e)
    },
    close: function () {
      // this.log('gridIndex:', gridIndex)
      this.moreTaskList = []
      this.getScheduleDetailListPayload.pageNum = 1
      this.getScheduleDetailListPayload.pageSize = 5
      this.ScheduleDetailShow = false
      this.kk = true
      this.detailEditBtn = false
      this.detailCanEdit = true
      this.moreListShow = false
      // this.monGrids[gridIndex].moreListShow = false
    },
    moreMouseout: function () {
      // this.close()
    },
    // 新建日程
    createSchedule: function () {
      // j
      this.value1 = this.getNowFormartTime()
      this.value2 = this.getNextFormartTime()
      this.pickerOptions.disabledDate = function (time) {
        // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > disabledStarTime
        return time.getTime() < Date.now() - 8.64e7
      }
      this.newScheduleFormShow = true
    },
    // 双击 新建日程 取消
    newScheduleCancel: function () {
      this.newScheduleFormShow = false
    },
    detailCancel: function () {
      this.ScheduleDetailShow = false
    },
    // 删除日程 // 取消编辑 取消修改
    detailDel: function () {
      var that = this
      if (!that.detailEditBtn) {
        // that.detailEditBtn = true
        // that.detailCanEdit = false
        if (that.currentTargetType === 1) {
          that.$confirm('确定删除本条日程？', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.delSchedulePayload.sdId = that.currentTargetId
            this.ajax('/schedule/delSchedule', that.delSchedulePayload).then(res => {
              this.dateMountInit(this.monDateOneFormart())
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // this.log('delSchedule:', res)
            })
          }).catch(() => {
            // that.loading = false
          })
        } else {
          // this.log('任务在此处不可删除')
        }
      } else {
        that.kk = true
        that.detailEditBtn = false
        that.detailCanEdit = true
      }
    },
    /** 修改日程 编辑日程 */
    detailEdit: function () {
      var that = this
      // detailCanEdit
      if (!that.detailEditBtn) {
        that.kk = false
        that.detailEditBtn = true
        that.detailCanEdit = false
      } else {
        if (that.currentTargetType === 1) {
          that.editSchedulePayload.sdId = that.currentTargetId
          that.editSchedulePayload.title = that.detailScheduleTit
          that.editSchedulePayload.minute = that.detailDurationValue
          that.editSchedulePayload.startTime = that.detailValue1
          that.editSchedulePayload.endTime = that.detailValue2
          this.ajax('/schedule/editSchedule', that.editSchedulePayload).then(res => {
            this.dateMountInit(this.monDateOneFormart())
            that.ScheduleDetailShow = false
            that.moreListShow = false
            that.detailEditBtn = false
            that.detailCanEdit = true
            that.kk = true
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            // this.log('delSchedule:', res)
          })
        } else {
          // this.log('任务在此处不可修改')
        }
      }
      // 如果是保存
      if (that.detailEditBtn) {

      } else {

      }
      // this.ScheduleDetailShow = false editSchedulePayload
    },
    /** 跳转至任务详情 */
    toTaskDetail: function () {
      var that = this
      if (that.currentTargetType >= 2) {
        that.$router.push('/taskDetailPage/' + that.currentTargetId)
      }
    },
    // 新建日程 确定 提交 保存
    newScheduleOk: function () {
      var that = this
      that.addSchedulePayload.startTime = this.value1
      that.addSchedulePayload.endTime = this.value2
      that.addSchedulePayload.title = that.newScheduleTit
      that.addSchedulePayload.minute = that.durationValue
      if (that.newScheduleTit && that.value1 && that.value2) {
        this.ajax('/schedule/addSchedule', that.addSchedulePayload).then(res => {
          // that.log('addSchedule:', res)
          if (res.code === 200) {
            that.dateMountInit(that.monDateOneFormart())
            that.newScheduleFormShow = false
            that.$message({
              type: 'success',
              message: '创建成功'
            })
            that.newScheduleClear()
          } else {
            that.dateMountInit(that.monDateOneFormart())
            that.newScheduleFormShow = false
            that.$message({
              type: 'warning',
              message: '创建失败'
            })
          }
        })
      } else {
        that.$message({
          type: 'warning',
          message: '表单信息不完整'
        })
      }
    },
    // 双击 新建日程
    gridDoubleClick: function (gridDay, gridIndex, e) {
      // 页面上的 “更多”列表悬浮窗消失
      this.close()
      var that = this
      var targetDate = gridDay.date
      var dateObj = new Date()
      var h = dateObj.getHours()
      var m = dateObj.getMinutes()
      var tt = that.year + '-' + that.month + '-' + targetDate + ' ' + h + ':' + m + ':00'
      // this.log('tt:', tt)
      var obj = e.currentTarget
      this.newScheduleTop = $(obj).offset().top + 30
      this.newScheduleLeft = $(obj).offset().left + 30
      this.value1 = this.getHalfHoursTime(tt)
      // this.value2 = this.getNextFormartTime()
      this.pickerOptions.disabledDate = function (time) {
        return time.getTime() < Date.now() - 8.64e7
      }
      this.newScheduleFormShow = true
    }
  }
}
</script>

<style scoped>
.Schedule{
  padding-bottom: 50px;
  background-color: #f1f6fa;
}
  .header{
    height: 120px;
    margin-top: -50px;
    _position: relative;
    background-color: #e3f3ff;
  }
  .BackToTask{
    color: #666;
    position: absolute;
    left: 0px;
    top: 7px;
    cursor: pointer;
    _background-color: #409EFF;
  }
  .BackToTask:hover{
    color: #3a8ee6;
  }
  .headerCnt{
    width: 1500px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }
  .headerCntTit{
    display: flex;
    padding-top: 25px;
  }
  .headerCntTit span{
    font-size: 22px;
  }
  .radioSelect{
    padding-top: 8px;
    margin-left: 40px;
  }
  .typeSelect{
    display: flex;
    padding-top: 20px;
  }
  .newAddSchedule{
    position: relative;
    margin-left: 20px;
  }
  .newScheduleForm{
    width: 400px;
    min-height: 150px;
    border-radius: 6px;
    padding: 20px 0px;
    padding-bottom: 0;
    box-sizing: border-box;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
    background-color: #fff;
    position: absolute;
    top: 45px;
    right: -10px;
    z-index: 100;
  }
  .newScheduleIpt{
    padding: 0 15px;
  }
  .durationSelect{
    padding: 0 15px;
    margin-top: 20px;
  }
  .formArrow{
    width: 10px;
    height: 10px;
    background-color: inherit;
    position: absolute;
    top: -5px;
    right: 30px;
    transform: rotate(45deg);
  }
  .newScheduleDate{
    display: flex;
    padding: 0px 15px;
    margin-top: 20px;
  }
  .formBtnBox{
    text-align: center;
    display: flex;
    margin-top: 20px;
    border-top: 1px solid #eee;
  }
  .formBtn{
    _width: 50%;
    flex-grow: 1;
    padding: 10px 0;
    cursor: pointer;
  }
  .formBtn.toTaskDetail{
    color: #3a8ee6;
  }
  .formBtnCancel{
    border-right: 1px solid #eee;
  }
  .formBtnOk{
    color: #3a8ee6;
  }
  .content{
    width: 1500px;
    margin: 0 auto;
    margin-top: -40px;
    background-color: #fff;
    border-radius: 6px;
    _min-height: 700px;
  }
  .weekHeader{
    display: flex;
    text-align: center;
    padding: 5px 0;
    justify-content: space-around;
    border-bottom: 1px solid #ddd;
  }
  .grids{
    display: flex;
    flex-wrap: wrap;
  }
  .grid{
    width: 214px;
    height: 150px;
    position: relative;
    box-sizing: border-box;
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  /*.grid.light{*/
    /*_border: 1px solid red;*/
    /*background-color: #3a8ee6;*/
  /*}*/
  .grid:nth-child(1),.grid:nth-child(8),.grid:nth-child(15),.grid:nth-child(22),.grid:nth-child(29),.grid:nth-child(36){
    border-left: none;
  }
  .grid:nth-child(36),.grid:nth-child(37),.grid:nth-child(38),.grid:nth-child(39),.grid:nth-child(40),.grid:nth-child(41),.grid:nth-child(42){
    border-bottom: none;
  }
  .dayDate{
    padding: 5px 0;
    padding-left: 5px;
    text-align: left;
  }
  .dayDate.light{
    color: #fff;
    background-color: #3a8ee6;
  }
  .taskItem{
    width: 213px;
    height: 22px;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    font-size: 12px;
    padding: 3px;
    padding-left: 5px;
    margin-top: 2px;
    cursor: pointer;
    box-sizing: border-box;
    background-color: #e3f3ff;
    position: relative;
  }
  .taskItem.light{
    /*3a8ee6  8ccdfc*/
    color: #fff;
    background-color: #47b2ff;
    _background-color: #3a8ee6;
    /*background-color: #c1e2fa;*/
  }
  .taskItemMore{
    color: #005999;
    padding: 2px 0;
    padding-left: 5px;
    font-size: 12px;
    margin-top: 2px;
    background-color: #fff;
  }
  .taskItemMore span:hover{
    cursor: pointer;
  }
  .taskItemMore.light{
    background-color: #c1e2fa;
  }
  .taskItemMoreList{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 250px;
    _width: 120%;
    min-height: 180px;
    background-color: #fff;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
  }
  .close{
    position: absolute;
    top: 8px;
    right: 10px;
  }
  .taskItemMoreDate{
    text-align: center;
    padding: 5px 0;
    font-size: 14px;
    border-bottom: 1px solid #eee;
  }
  .MoreTitleBox{
    padding: 5px 10px;
    height: 125px;
    overflow: hidden;
    overflow-y: visible;
    box-sizing: border-box;
  }
  .taskItemMoreTitle{
    height: 21px;
    font-size: 12px;
    margin-top: 2px;
    padding: 2px 5px;
    cursor: pointer;
    box-sizing: border-box;
    background-color: rgba(42, 198, 198, 0.15);
  }
  .taskItemMoreTitle:hover{
    background-color: rgba(42, 198, 198, 0.35);
  }
  /** 分页器 */
  .morePagination{
    border-top: 1px solid #eee;
  }
  /** 详情弹窗 */
  .ScheduleDetail{
    width: 400px;
    min-height: 200px;
    padding-top: 0px;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 5px 10px 0 rgba(0,0,0,.1);
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 200;
  }
  .detailFormArrow{
    width: 10px;
    height: 10px;
    /*background-color: inherit;*/
    background-color: #fff;
    position: absolute;
    top: 22px;
    left: -5px;
    transform: rotate(45deg);
  }
  .DetailCnt{
    padding: 0 10px;
  }
  .detailTit{
    text-align: center;
    padding: 10px 0;
    _border-bottom: 1px solid #eee;
  }
  /*.taskItem:hover{*/
    /*background-color: #cde7fb;*/
  /*}*/
</style>
