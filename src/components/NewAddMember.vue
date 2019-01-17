<template>
  <div v-loading="loading" class="clear">
    <!--<h3>{{proID}}</h3>-->
    <div class="boxLeft">
      <el-tree
        :data="data2"
        show-checkbox
        @node-click="append($event)"
        @check="changeState"
        node-key="id"
        :default-expanded-keys="[1,2]"
        :props="defaultProps">
      </el-tree>
    </div>
    <div class="caozuo">
      <div class="el-icon-d-arrow-right" @click="addMenber()"></div>
    </div>
    <div class="boxRight" style='position: relative'>
      <div class="boxRightHt" style="position: absolute;top: 0;z-index: 99;width: 95%;"><span>角色</span><span>姓名</span><span>查看</span><span>编辑</span><span class="clearAll" @click="clearAll()">清空</span></div>
      <div class="boxRightCont">
        <div class="peoList" v-for="people in peopleList" v-bind:key="people.userId">
          <div style="text-align: center;width: 21%;">{{people.peopleType}}</div>
          <div style="text-align: center;width: 21%;">{{people.userName}}</div>
          <div style="width: 27%;margin-left: 7%;">
            <input class="see" v-bind:id="people.id" type="checkbox" name="role1" value="1" @change="sIsChecked($event)" v-bind:checked="people.isSeeCheck">
            <input class="edit" v-bind:id="people.id" type="checkbox" name="role2" value="2" @change="sIsChecked($event)" v-bind:checked="people.isEditCheck" style="margin-top: 6px;float: right;">
          </div>
          <div class="close" v-if="people.peopleRole === '4' ? true : false"  v-bind:id="people.id" @click="deletePeople($event)">&#10005;</div>
        </div>
      </div>
    </div>
    <div style="float: right;">
      <el-button type="primary" @click="saveMessage()">立即保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewAddMember',
  props: ['proID'],
  data () {
    return {
      msg: '',
      data2: [],
      dataPeo: [],
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      peopleList: [],
      deId: [],
      getNextPart: [],
      getNextPeople: [],
      loading: false,
      projectUID: '',
      getPeople: [],
      token: '',
      peoDone: []
    }
  },
  created () {
    // this.settoken()
    this.getProjectPeo()
    this.getDepartment()
  },
  methods: {
    // 查询部门
    getDepartment () {
      var that = this
      this.ajax('/general/queryDepartment', {}).then(res => {
        if (res.code === 200) {
          that.data2 = res.msg.department
          for (var i = 0; i < res.msg.member.length; i++) {
            res.msg.member[i].Name = res.msg.member[i].Name + ' ( ' + res.msg.member[i].jName + ' )'
          }
          that.dataPeo = res.msg.member
          that.data2 = this.dataPeo.concat(this.data2)
        }
      })
    },
    // 查询项目人员列表
    getProjectPeo () {
      var that = this
      this.projectUID = this.proID
      this.ajax('/general/getMembersByProjectUID', {projectUID: that.projectUID}).then(res => {
        if (res.code === 200) {
          this.peopleList = res.msg
          for (var j = 0; j < that.peopleList.length; j++) {
            if (that.peopleList[j].peopleRole === '1') {
              that.peopleList[j].peopleType = '创建人'
            } else if (that.peopleList[j].peopleRole === '2') {
              that.peopleList[j].peopleType = '负责人'
            } else if (that.peopleList[j].peopleRole === '3') {
              that.peopleList[j].peopleType = '执行人'
            } else if (that.peopleList[j].peopleRole === '4') {
              that.peopleList[j].peopleType = '成员'
            }
          }
          this.token = res._jfinal_token
        }
        that.peoDone = []
        for (var i = 0; i < that.peopleList.length; i++) {
          if (that.peopleList[i].role === '2') {
            that.peopleList[i].isSeeCheck = true
            that.peopleList[i].isEditCheck = true
          } else if (that.peopleList[i].role === '1') {
            that.peopleList[i].isSeeCheck = true
            that.peopleList[i].isEditCheck = false
          } else {
            that.peopleList[i].isSeeCheck = false
            that.peopleList[i].isEditCheck = false
          }
          var peoObj = {}
          peoObj.id = that.peopleList[i].id
          peoObj.role = that.peopleList[i].role
          that.peoDone.push(peoObj)
        }
      })
    },
    // 查询部门和人员
    append (data) {
      var that = this
      var dID = data.ID
      this.$set(data, 'children', [])
      this.ajax('/general/queryDepartment', {departmentID: dID}).then(res => {
        if (res.code === 200) {
          that.getNextPart = res.msg.department
          for (var i = 0; i < res.msg.member.length; i++) {
            res.msg.member[i].Name = res.msg.member[i].Name + ' ( ' + res.msg.member[i].jName + ' )'
          }
          that.getNextPeople = res.msg.member
          data.children = that.getNextPeople.concat(that.getNextPart)
        }
      })
    },
    // @check
    changeState (e, state) {
      var that = this
      that.deId = state.checkedNodes
      this.ajax('/general/queryMember', {departmentIDs: JSON.stringify(that.deId)}).then(res => {
        if (res.code === 200) {
          for (var i = 0; i < res.msg.length; i++) {
            res.msg[i].Name = res.msg[i].Name.split(' ')[0]
          }
          this.getPeople = res.msg
          that.log('getMember:', this.getPeople)
          that.token = res._jfinal_token
          if (that.deId.length > 0) {
            $('.el-icon-d-arrow-right').addClass('active')
          } else if (that.deId.length === 0) {
            $('.el-icon-d-arrow-right').removeClass('active')
          }
        }
      })
    },
    addMenber () {
      var that = this
      if (that.deId.length > 0) {
        that.loading = true
        that.ajax('/general/addMembers', JSON.stringify({
          projectUID: that.projectUID,
          hrocPeople: that.getPeople,
          _jfinal_token: that.token
        })).then(res => {
          if (res.code === 200) {
            that.getProjectPeo()
            that.loading = false
            // that.deId = []
          }
        })
      } else if (this.deId.length === 0) {
        $('.el-icon-d-arrow-right').removeClass('active')
      }
    },
    // 清空
    clearAll () {
      var that = this
      this.$confirm('是否清空所有成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        this.ajax('/general/delMembersById', {
          id: 0,
          projectUID: this.projectUID
        }).then(res => {
          if (res.code === 200) {
            that.getProjectPeo()
            that.token = res._jfinal_token
            that.loading = false
          }
        })
      }).catch(() => {
        that.loading = false
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 选择查看和编辑
    sIsChecked (e) {
      var obj = e.currentTarget
      var that = this
      var newRole = ''
      if (e.target.value === '2') {
        if ($(obj).is(':checked')) {
          $(obj).siblings().prop('checked', true)
          newRole = '2'
        } else {
          if ($(obj).siblings().is(':checked')) {
            newRole = '1'
          } else {
            newRole = '0'
          }
        }
      } else {
        if ($(obj).is(':checked')) {
          if ($(obj).siblings().is(':checked')) {
            newRole = '2'
          } else {
            newRole = '1'
          }
        } else {
          if ($(obj).siblings().is(':checked')) {
            newRole = '2'
          } else {
            newRole = '0'
          }
        }
      }
      for (var i = 0; i < that.peoDone.length; i++) {
        if (that.peoDone[i].id.toString() === e.target.id) {
          that.peoDone[i].role = newRole
        }
      }
    },
    // 删除人员
    deletePeople (e) {
      var that = this
      var Uid = e.target.id
      this.$confirm('是否删除该成员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        this.ajax('/general/delMembersById', {id: Uid}).then(res => {
          if (res.code === 200) {
            that.getProjectPeo()
            that.token = res._jfinal_token
            that.loading = false
          }
        })
      }).catch(() => {
        that.loading = false
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 立即保存 成员管理右上角按钮
    saveMessage () {
      var that = this
      that.loading = true
      this.ajax('/general/updateRole',
        JSON.stringify({
          projectUID: that.projectUID,
          projectOrg: that.peoDone
        })).then(res => {
        if (res.code === 200) {
          that.$message.success('保存成功')
          that.getProjectPeo()
          that.loading = false
          that.$emit('paneCurrent', 'proDetailPlanTree')
        }
      })
    }
  }
}
</script>

<style scoped>
  .boxLeft{
    width: 300px;
    height: 450px;
    float: left;
    overflow: scroll;
    padding: 10px;
    border: 2px solid #eee;
    border-radius: 10px;
    overflow-x: hidden;
  }
  .caozuo{
    float: left;
    width: 100px;
    height: 450px;
    line-height: 450px;
    position: relative;
    margin-left: 40px;
    text-align: center;
  }
  .el-icon-d-arrow-right{
    margin: auto;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    line-height: 36px;
    font-size: 20px;
  }
  .boxRight{
    width: 400px;
    height: 450px;
    float: left;
    position: relative;
    margin-left: 30px;
    padding: 10px;
    border: 2px solid #eee;
    border-radius: 10px;
  }
  .boxRight .boxRightHt{
    position: absolute;
    top: 0;
    height: 30px;
    color: #666;
    width: 100%;
    font-size: 16px;
    line-height: 30px;
    margin-left: -10px;
    font-family: '黑体';
    font-weight: bold;
    padding: 0 10px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    z-index: 999;
  }
  .boxRight .boxRightHt span{
    width: 20%;
    float: left;
    text-align: center;
  }
  .clearAll{
    color:#409EFF;
    font-weight: normal;
    font-size: 14px;
    cursor: pointer;
  }
  .boxRightCont{
    width: 400px;
    height: 420px;
    overflow: scroll;
    overflow-x: hidden;
    margin-top: 30px;
  }
  .boxRightCont div{
    color: #888;
    width: 100%;
    font-size: 15px;
  }
  .boxRightCont div>div{
    float: left;
  }
  .peoList{
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px dashed #eee;
  }
  .peoList .close{
    float: right;
    width: 20px;
    font-size: 12px;
    text-align: center;
    margin-right: 15px;
  }
  .close:hover{
    color:#409EFF;
    cursor: pointer;
  }
  .peoList input{
    width: 15px;
    height: 15px;
  }
  .active{
    color: #fff;
    background-color:#409EFF;
  }
</style>
