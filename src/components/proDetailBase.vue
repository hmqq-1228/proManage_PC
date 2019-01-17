<template>
<div class="base">
  <!--<h3 v-on:click="onClick()">这个是BASE{{text}}</h3>-->
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="项目名称" prop="projectName" style="width: 36%;display: inline-block; color: #777;">
      <el-input v-model="ruleForm.projectName" v-bind:disabled="canEdit"></el-input>
    </el-form-item>
    <!--<el-form-item label="项目类型" prop="projectType" style="width: 36%;display: inline-block;">-->
      <!--<el-input v-model="ruleForm.projectType" v-bind:disabled="canEdit"></el-input>-->
    <!--</el-form-item>-->
    <el-form-item label="项目类型" prop="projectType" style="width: 36%;display: inline-block;">
      <el-select v-model="ruleForm.projectType" style="width: 100%;" v-bind:disabled="canEdit" placeholder="请选择项目类型">
        <el-option label="集团战略" value="集团战略"></el-option>
        <el-option label="公司项目" value="公司项目"></el-option>
        <el-option label="部门项目" value="部门项目"></el-option>
        <el-option label="小组项目" value="小组项目"></el-option>
        <el-option label="个人项目" value="个人项目"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开始时间" prop="startTime" style="width: 36%;display: inline-block; color: #777;">
      <el-date-picker style="width: 100%"
        v-model="ruleForm.startTime"
        type="datetime"
        v-bind:disabled="canEdit"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        :picker-options="pickerOptions"
        placeholder="选择开始时间">
      </el-date-picker>
      <!--<el-date-picker-->
        <!--style="color: #777;width: 100%"-->
        <!--v-model="ruleForm.value2"-->
        <!--type="daterange"-->
        <!--range-separator="至"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--value-format="yyyy-MM-dd"-->
        <!--format="yyyy-MM-dd"-->
        <!--v-bind:disabled="canEdit"-->
        <!--:picker-options="pickerOptions"-->
      <!--&gt;-->
      <!--</el-date-picker>-->
    </el-form-item>
    <el-form-item label="结束时间" prop="endTime" style="width: 36%;display: inline-block; color: #777;">
      <el-date-picker style="width: 100%"
        v-model="ruleForm.endTime"
        type="datetime"
        v-bind:disabled="canEdit"
        value-format="yyyy-MM-dd"
        format="yyyy-MM-dd"
        :picker-options="pickerOptions1"
        placeholder="选择结束时间">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="项目负责人" prop="projectManager" style="width: 36%;display: inline-block;">
      <el-autocomplete style="width: 100%"
                       v-bind:disabled="canEdit"
                       v-model="ruleForm.projectManager"
                       :fetch-suggestions="querySearchAsync"
                       placeholder="请输入项目经理姓名"
                       :trigger-on-focus="false"
                       @select="handleSelect"
      ></el-autocomplete>
    </el-form-item>
    <el-form-item label="项目简介" prop="introduction" style="clear: both;">
      <el-input type="textarea" style="width: 70%;" rows = '10' v-model="ruleForm.introduction" v-bind:disabled="canEdit"></el-input>
    </el-form-item>
    <el-form-item label="项目附件">
      <div v-if="!ruleForm.showName" style="color: #999;font-size: 12px;">暂无附件</div>
      <div v-if="ruleForm.showName">
        <a v-bind:href="ruleForm.downloadUrl" download="项目附件">
          {{ruleForm.showName}}
          <i style="font-weight: bold !important; padding: 5px; color: chocolate;" class="el-icon-download"></i>
        </a>
      </div>
    </el-form-item>
    <el-form-item style="width: 880px;text-align: center;margin-top: 30px;">
      <el-button type="primary" v-if="canEdit" @click="editForm()">修改</el-button>
      <el-button type="primary" v-if="!canEdit" @click="editCancel()">取消</el-button>
      <el-button type="success" @click="saveForm('ruleForm')">保存</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: 'proDetailBase',
  props: ['text'],
  data () {
    return {
      msg: '通用项目管理',
      canEdit: true,
      pickerOptions: {},
      pickerOptions1: {},
      defaultData: {
        projectName: '',
        projectManager: '',
        projectManagerID: '',
        delivery: false,
        projectType: '',
        resource: '',
        showName: '',
        downloadUrl: '',
        introduction: '',
        endTime: '',
        startTime: '',
        value2: []
      },
      ruleForm: {
        projectName: '',
        projectManager: '',
        projectManagerID: '',
        delivery: false,
        projectType: '',
        resource: '',
        showName: '',
        endTime: '',
        startTime: '',
        downloadUrl: '',
        introduction: '',
        value2: []
      },
      rules: {
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        projectType: [
          { required: true, message: '请输入项目类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        projectManager: [
          { required: true, message: '请输入项目经理', trigger: 'change' }
        ],
        introduction: [
          { required: true, message: '请填写项目描述', trigger: 'blur' }
        ]
      },
      Mid: '',
      position: '',
      token: '',
      autoCompleteNamesPayload: {
        projectManager: ''
      }
    }
  },
  watch: {
    defaultData (newVal, oldVal) {
      this.log('newVal::', newVal)
    }
  },
  created: function () {
    this.log('proDetailBase1')
    var that = this
    this.$store.commit('setRouterName', {name: '项目基本信息', parentName: 'proDetails', url: '/proDetails/' + that.$route.params.pid})
    this.settoken()
    this.getProMsg()
    this.log('proDetailBase2')
  },
  methods: {
    settoken: function () {
      this.ajax('/general/setToken', {}).then(res => {
        this.token = res._jfinal_token
      })
    },
    onClick () {
      // console.log(123456789)
      // console.log('text:', this.text)
      this.$emit('click', this.text + 'z')
    },
    // 查询基本信息
    getProMsg () {
      var that = this
      this.ajax('/general/getProjectDetail', {projectUID: that.$route.params.pid}).then(res => {
        that.log('getProjectDetail:', res)
        if (res.code === 200) {
          var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.msg.realUrl + '&showName=' + res.msg.showName
          that.ruleForm.projectName = res.msg.projectName
          that.Mid = res.msg.projectManagerID
          that.ruleForm.projectType = res.msg.projectType
          that.ruleForm.startTime = res.msg.startDate
          that.ruleForm.endTime = res.msg.endDate
          that.ruleForm.showName = res.msg.showName
          that.ruleForm.downloadUrl = downurl
          that.position = res.msg.position
          that.ruleForm.projectManager = res.msg.projectManager + ' (' + res.msg.position + ')'
          that.ruleForm.introduction = res.msg.content
          var st = ''
          if (res.msg.startDate) {
            st = res.msg.startDate.split(' ')[0] + ' 00:00:00'
          }
          var et = res.msg.endDate.split(' ')[0] + ' 00:00:00'
          var sT = new Date(st)
          var eT = new Date(et)
          // that.defaultTime = sT
          var disabledStarTime = sT.getTime()
          var disabledEndTime = eT.getTime()
          // console.log('disabledEndTime', disabledEndTime)
          this.pickerOptions.disabledDate = function (time) {
            return time.getTime() < Date.now() - 8.64e7 || time.getTime() > disabledStarTime
          }
          this.pickerOptions1.disabledDate = function (time) {
            return time.getTime() < disabledEndTime
          }
          // var valueArr = []
          // valueArr.push(res.msg.startDate)
          // valueArr.push(res.msg.endDate)
          that.defaultData = {
            projectName: res.msg.projectName,
            projectType: res.msg.projectType,
            endTime: res.msg.endDate,
            startTime: res.msg.startDate,
            showName: res.msg.showName,
            downloadUrl: downurl,
            projectManager: res.msg.projectManager + ' (' + res.msg.position + ')',
            introduction: res.msg.content
          }
        }
      })
    },
    querySearchAsync (queryString, cb) {
      var that = this
      if (queryString) {
        that.autoCompleteNamesPayload.projectManager = queryString
        this.ajax('/general/autoCompleteNames', that.autoCompleteNamesPayload).then(res => {
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
    handleSelect (item) {
      // console.log(item.userId)
      this.Mid = item.userId
    },
    editForm () {
      this.canEdit = false
    },
    editCancel () {
      this.canEdit = true
      this.ruleForm.projectName = this.defaultData.projectName
      this.ruleForm.projectType = this.defaultData.projectType
      this.ruleForm.startTime = this.defaultData.startTime
      this.ruleForm.endTime = this.defaultData.endTime
      this.ruleForm.showName = this.defaultData.showName
      this.ruleForm.downloadUrl = this.defaultData.downloadUrl
      this.ruleForm.projectManager = this.defaultData.projectManager
      this.ruleForm.introduction = this.defaultData.introduction
      this.log('defaultData:', this.defaultData)
    },
    // 立即创建 提交基本信息
    saveForm (formName) {
      var that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (that.Mid) {
            that.ajax('/general/editBaseInfo',
              {
                projectManagerID: that.Mid,
                projectUID: this.$route.params.pid,
                projectName: this.ruleForm.projectName,
                projectType: this.ruleForm.projectType,
                startDate: this.ruleForm.startTime,
                endDate: this.ruleForm.endTime,
                position: that.position,
                projectManager: this.ruleForm.projectManager,
                introduction: this.ruleForm.introduction,
                _jfinal_token: this.token
              }).then(res => {
              if (res.code === 200) {
                that.$message.success(res.msg)
                that.token = res._jfinal_token
                that.canEdit = true
                that.getProMsg()
                // that.projectUID = res.projectUID
                that.activeName = 'second'
                that.$emit('paneCurrent', 'ProDetailMember')
                that.flag = false
                that.Mid = ''
              }
            })
          } else {
            that.$message.error('请重新选择项目经理')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
  .el-range-editor.is-disabled{
    width: 100%;
  }
</style>
