<template>
  <div class="myProject">
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
    <div class="listWrap" style="margin-top:10px;">
      <el-container style="margin-top: 40px;">
        <el-aside width="150px" style="height: 553px;">
          <!--新增按钮-->
          <div class="newAddPro">
            <el-button v-on:click="newAddPro()">新增项目</el-button>
          </div>
          <el-row class="tac">
            <el-col :span="12" style="width: 100%">
              <!--:default-active="defaultSectPro"-->
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
              <div class="block" style="background-color: #fff; padding: 10px;text-align: center">
                <el-pagination :page-size="myProjectViewPayload.pageSize" layout="prev, pager, next, total, jumper" :total="totalProject" @current-change="changeProjectPage($event)">
                </el-pagination>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-container>
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
</template>

<script>
export default {
  name: 'myProject',
  data () {
    return {
      modelList: [],
      typeValue: '',
      ConditionType: '',
      totalModelNum: 0,
      dialogTemplateVisible: false,
      projectConditionData: {},
      // 我的项目列表 返回数据（项目卡片）
      projectViewData: {},
      totalProject: 0,
      defaultSectPro: '1',
      modelData: {
        pageNum: '1',
        pageSize: 5
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
      }
    }
  },
  created: function () {
    var that = this
    /** 设置面包屑 */
    that.$store.commit('setRouterName', {name: '我的项目', parentName: 'TaskPlan', url: '/'})
    // 项目统计情况查看
    that.queryGetProjectCondition()
    // 查询个人项目列表
    that.queryMyProjectView()
  },
  methods: {
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    selectType (e) {
      this.myProjectViewPayload.projectType = e
      this.getProjectConditionPayload.projectType = e
      this.queryMyProjectView()
      this.queryGetProjectCondition()
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
    // 我的项目 侧边栏 点击
    proSideNavClick (args) {
      this.ConditionType = args
      this.myProjectViewPayload.pageNum = 1
      this.myProjectViewPayload.status = args
      this.queryMyProjectView()
    },
    toModelAddProject: function (mId) {
      this.$router.push('/modelAddProject/' + mId)
    },
    modelCurrentChange: function (e) {
      // this.log('page', e)
      this.modelData.pageNum = e
      this.newAddPro()
    },
    concelTemplate: function () {
      this.dialogTemplateVisible = false
    },
    toDefultAddProject: function () {
      this.$router.push('/NewAddPro')
    },
    toProDetail (e) {
      var pid = e.target.parentNode.id
      if (pid) {
        this.$router.push('/proDetails/' + pid)
      }
    },
    // 项目删除
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
            // that.loading = false
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      }).catch(() => {
        // that.loading = false
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
  .myProject{
    width: 100%;
    margin: 0 auto;
    padding-top: 20px;
  }
  .clear:after{ content: ""; display: block;height: 0;visibility: hidden;clear: both;}
  .selectIpt{
    text-align: left;
    _margin-top: 20px;
  }
  .listWrap{
    margin-top: 40px;
  }
  .newAddPro{
    padding-top: 15px;
    padding-bottom: 10px;
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
    cursor: pointer;
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
  .cartHover:hover{
    background-color: #f5f8f8;
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
  .el-row {
    margin-bottom: 20px;
    /*&:last-child {*/
     /*margin-bottom: 0;*/
    /*}*/
  }
  .el-col {
    border-radius: 4px;
  }
  .el-col:hover{
    box-shadow: 1px 1px 4px #ccc;
  }
  .bottom {
    margin-top: 20px;
    line-height: 12px;
    color: #666;
    font-family: '黑体';
  }
  .el-progress{
    width: 84%;
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
