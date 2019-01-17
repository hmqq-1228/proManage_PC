<template>
  <div class="main" v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/addProlemList' }">我的问题</el-breadcrumb-item>
      <el-breadcrumb-item>问题详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="cnt">
      <div class="taskHeader">
        <h2>{{taskDetail.jobName}}</h2>
      </div>
      <div class="cont">
        <div class="contLeft">
          <div class="discription msg">
            <h3>问题描述</h3>
            <div v-bind:title="taskDetail.description">{{taskDetail.description}}</div>
          </div>
          <div class="discription">
            <h3>问题附件</h3>
            <div class="imgCon">
              <div class="imgBox" @click="showBigImage()" v-if="taskDetail.showName && taskDetail.imageOrNot === 1" v-bind:style="{backgroundImage: 'url('+taskDetail.downloadUrl+')'}"></div>
              <div style="padding-left: 30px;font-size: 14px;" v-if="taskDetail.showName && taskDetail.imageOrNot === 0">
                <a v-bind:href="taskDetail.downloadUrl" download="附件文档">{{taskDetail.showName}}</a>
              </div>
              <div style="padding-left: 30px;font-size: 14px;color: #999;" v-if="!taskDetail.showName">暂无附件</div>
            </div>
            <div class="line1"></div>
          </div>
          <div class="discription lis">
            <h3>历史记录</h3>
            <div class="add" @click="addRemark()"><img src="../../static/img/msg.png" alt="">添加评论</div>
            <div class="logBox">
              <ul>
                <li v-bind:key="logs.index" class="contentHide" v-for="(logs,index) in taskLogs"><span>{{(index + 1) + '. ' + logs.oTime}}，</span><span v-if="logs.oTitle">{{logs.oTitle}}</span><span style="font-weight: bold;" v-if="logs.oName">【{{logs.oName}}】</span><span>{{logs.oContent}}。</span>&nbsp;&nbsp;
                  <span v-if="logs.comment" style="position: relative" @click="showContentLog($event)"><i style="color: chocolate" class="el-icon-circle-plus-outline"></i></span>
                  <div class="contBoxContent">{{logs.comment}}</div>
                  <div v-if="logs.uploads && logs.uploads.length > 0" class="contBoxContent">
                    <a v-bind:href="logs.uploads[0].downloadUrl">附件: {{logs.uploads[0].showName}}</a>
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
            <div>问题类型：<span style="color: #3a8ee6;cursor: pointer;text-decoration:underline " @click="toProjectDetail(taskDetail.projectUID)">{{taskDetail.projectName}}</span></div>
            <div>提 出 人：{{taskDetail.createrName}}</div>
            <div>执 行 人：{{taskDetail.userName}}</div>
            <div>处理状态：<span v-bind:class="'stateStyle'+ taskDetail.status">{{taskDetail.field1}}</span></div>
            <div><span style="float: left">紧急程度：</span> <el-rate style="float: left" disabled v-model="getjobLevel"></el-rate></div>
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
      <div class="taskBottom">
        <el-row style="text-align: center;padding-top: 20px" v-if="taskDetail.showMenu === 1">
          <el-button v-bind:disabled="canStart" @click="confirmTaskStart()">确认开始</el-button>
          <el-button type="primary" @click="transferTask()" v-bind:disabled="canTransfor">移交</el-button>
          <el-button type="success" @click="finishedTask()" v-bind:disabled="canDone">完成</el-button>
        </el-row>
      </div>
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
      <el-dialog title="处理完成" :visible.sync="taskFormVisible"  width="26%">
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
      <!--任务移交-->
      <el-dialog title="问题移交" :visible.sync="taskTransferVisible"  width="26%">
        <div style="height: 30px;line-height: 30px"><span style="color: red">*</span> 问题移交人：</div>
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
        <img v-bind:src="taskDetail.downloadUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'addProblemDetail',
  data () {
    return {
      routerNameArr: '',
      rid: '',
      taskId: '',
      userId: '',
      planid: this.$route.params.planid,
      canDone: false,
      canStart: false,
      canTransfor: false,
      loading: false,
      loading1: false,
      pagenum: 1,
      totalData: 0,
      taskDetail: '',
      taskLogs: '',
      getjobLevel: 0,
      transferUserId: '',
      transferUserName: '',
      showContent: false,
      dialogFormVisible: false,
      taskFormVisible: false,
      taskTransferVisible: false,
      showBigImageVisible: false,
      projectManager: '',
      form: {
        desc: ''
      },
      taskform: {}
    }
  },
  created: function () {
    var that = this
    this.$store.commit('setRouterName', {name: '问题详情', parentName: '', url: '/addProblemDetail/' + that.$route.params.planid})
    this.routerNameArr = this.$store.state.routerNameArr
    console.log('this.routerNameArr:', this.routerNameArr)
    this.getTaskDetail()
    this.getHistoryCont()
  },
  destroyed: function () {
    console.log('distroyed:', this.$store.state.routerNameArr)
  },
  methods: {
    getTaskDetail () {
      var that = this
      var planid = this.$route.params.planid
      this.planid = planid
      // console.log('planid', planid)
      that.ajax('/general/getPlanOrTaskDetail', {id: planid}).then(res => {
        console.log('getPlanOrTaskDetail:', res)
        if (res.code === 200) {
          console.log('getTaskDetail:', res)
          if (res.msg.realUrl) {
            var downurl = that.$store.state.baseServiceUrl + '/file/downloadFile?realUrl=' + res.msg.realUrl + '&showName=' + res.msg.showName
            res.msg.downloadUrl = downurl
          }
          that.taskDetail = res.msg
          that.getjobLevel = parseInt(res.msg.jobLevel)
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
        }
        console.log('res', res)
      })
    },
    getHistoryCont () {
      var that = this
      var planid = this.$route.params.planid
      that.ajax('/general/getLogAndComment', {rid: planid, rtype: 3, pageSize: 5, pageNum: that.pagenum}).then(res => {
        if (res.code === 200) {
          console.log('getHistoryCont:', res)
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
      if (pid) {
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
          console.log(data)
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
          console.log(data)
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
          console.log(data)
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
            that.$router.push('/addProlemList')
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
      console.log(item)
      this.transferUserId = item.userId
      this.transferUserName = item.value
    },
    addRemark () {
      this.dialogFormVisible = true
      this.rid = this.$route.params.planid
    },
    showContentLog (e) {
      console.log('e', e)
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
      console.log(e)
      this.pagenum = e
      this.getHistoryCont()
    },
    showBigImage () {
      this.showBigImageVisible = true
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
    height: 670px;
    background-color: #f5f5f5;
  }
  .contLeft{
    width: 66%;
    height: 99.6%;
    float: left;
    margin-left: 20px;
    background-color: #fff;
    box-shadow: 2px 2px 6px #ccc;
  }
  .contRight{
    width: 30%;
    height: 100%;
    float: right;
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
  .taskBottom{
    width: 100%;
    height: 100px;
    background-color: #fff;
  }
  .contRight .rightTop{
    height: 58%;
    width: 100%;
    background-color: #fff;
    box-shadow: 2px 2px 6px #ccc;
  }
  .contRight .rightBot{
    margin-top: 2%;
    height: 40.2%;
    width: 100%;
    background-color: #fff;
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
    height: 60px;
    font-family: '黑体';
    text-indent: 2em;
    font-size: 14px;
    line-height: 20px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    width: 98%;
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
  }
  .add img{
    float: left;
    margin-right: 4px;
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
</style>
