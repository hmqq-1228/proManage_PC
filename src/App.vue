<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view style="min-height: 800px;"/>
    <div class="copyright">贝豪项目管理系统（PMS ©2019 Version-{{version}}）版权所有 翻版必究</div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      msg: 'APP',
      version: ''
    }
  },
  created: function () {
    this.getPmsVersion()
  },
  methods: {
    getPmsVersion: function () {
      var that = this
      that.ajax('/general/getVersion', {}).then(res => {
        if (res.code === 200) {
          that.version = res.data
        }
      })
    }
  }
}
</script>

<style>
  .copyright{
    padding: 15px;
    padding-top: 20px;
    text-align: center;
    font-size: 12px;
    color: #aaa;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  _text-align: center;
  color: #2c3e50;
  margin-top: 50px;
}
.clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
.el-table--enable-row-transition .el-table__body td{
  text-align: center !important;
}
.el-dialog__body{
  padding: 20px;
}
.fontStyle{
  color: #409EFF ;
  cursor: pointer;
  text-decoration: underline;
}
.btnStyle{
  color: #409EFF;
  cursor: pointer;
}
.toStart{
  color: #DC1E4A;
}
.noDone{
  color: #409EFF;
}
.finished {
  color: #13ce66;
}
  /*ddddddddddddddddddddddddddddddddddd*/
/** treeNodeBox 新的树形结构 */

.childItem{
  box-sizing: border-box;
  box-sizing: border-box;
  margin-left:50px;
  border-left:1px solid #ccc;
}
.childItem.proTit{
  margin-left:0
}
.childItem:last-child{
  border:none;
}
.tttt{
  display: none;
}
.childItem:last-child>.itemCnt>.line>.tttt{
  display:inline-block;
  width:1px;
  height:16px;
  position:absolute;
  background-color:#ccc;
}
.line{
  /*width:250px;*/
  height:30px;
  /*line-height:30px;*/
  position:relative;
  _border-left: 1px solid #aaa;
}
.itemCntTit{
  width: 220px;
  height: 30px;
  line-height: 30px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
._planIcon{
  width:0px;
  height: 0px;
  margin-right:3px;
  display:inline-block;
  border-bottom:4px solid #fff;
  border-left:6px solid #409EFF;
  _border-left:6px solid #0000ff;
  border-top:4px solid #fff;
}
.taskIcon{
  width:8px;
  height:8px;
  margin-right:4px;
  margin-bottom:11px;
  display:inline-block;
  background-color: #F90;
  border-radius: 4px;
  margin-left:3px;
}
.itemCntTit{
  display:inline-block;
}
.itemCntTit.proTit{
  font-size:18px;
}
.itemCnt,.handleBox,.editBox{
  display:flex;
}
.itemCnt{
  justify-content:space-between;
}
.itemCnt:hover{
  background-color:#f5f5f5;
}
.handleWrap{
  display: flex;
}
.handleBox{
  width: 530px;
  _flex-grow:1;
  line-height:30px;
}
.handleBox div{
  _padding:0 15px;
}
.worker{
  font-size: 12px;
  color: #777;
  width: 150px;
}
.timeLimit{
  font-size: 10px;
  color: #13ce66;
  width: 270px;
}
.taskLevel{
  padding-top: 7px;
  font-size: 12px;
  width: 30px;
}
.taskLevelVal{
  width: 16px;
  height: 16px;
  color: #fff;
  border-radius: 8px;
  line-height: 16px;
  text-align: center;
}
.taskLevelVal01{
  background-color: #409EFF;
}
.taskLevelVal02{
  background-color: #ffb400;
}
.taskLevelVal03{
  background-color: #ff6c00;
}
.taskStatus{
  text-align: center;
  font-size: 12px;
  width: 70px;
}
.taskStatus01{
  color: #ffb400;
}
.taskStatus02{
  color: #13ce66;
}
.taskStatus03{
  color: #409EFF;
}
.editBox{
  color: #409eff;
  font-size: 12px;
  line-height:30px;
}
.editBox div{
  padding-left:15px;
}

#app{
  color:#606266;
  font-size:14px;
}
.ganggang{
  width:16px;
  height:4px;
  margin-bottom: 9px;
  display:inline-block;
  border-top:1px solid #ccc;
  _background-color:#aaa;
}
.planIcon{
  width:8px;
  height:8px;
  margin-left:4px;
  margin-right:5px;
  margin-bottom:11px;
  display:inline-block;
  transform: rotate(45deg);
  background-color:#409EFF;
}
.el-progress--text-inside .el-progress-bar{
  margin-left: 8%;
}
  .projectType0{
    color: #aaa;
  }
  .chakan:hover,.addPlanTaskClick:hover,.delPlanTaskClick:hover{
    cursor: pointer;
  }
  .chakan.projectType0:hover,.delPlanTaskClick.projectType0:hover{
    cursor: not-allowed;
  }
.notCanSee{
  color: #999;
  cursor: not-allowed;
}
.notCanEdit{
  color: #999;
  cursor: not-allowed;
}
.notCanSee:hover,.notCanEdit:hover{
  color: #999;
  cursor: not-allowed;
}
.el-menu{
  text-align: left !important;
}
.el-menu-item{
  padding-left: 10px !important;
}
/*项目详情 禁用状态下 输入框内字体的颜色*/
.el-input.is-disabled .el-input__inner{
  color: #777;
}
.el-range-editor.is-disabled input{
  color: #777;
}
.el-textarea.is-disabled .el-textarea__inner{
  color: #777;
}
.el-tag--small{
  height: 22px !important;
  line-height: 22px !important;
}
.taskPlanModel .el-dialog {
  min-width: 900px !important;
}
  .newScheduleDate .el-input--suffix .el-input__inner{
    padding-right: 0;
  }
</style>
