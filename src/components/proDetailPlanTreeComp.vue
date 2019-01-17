<template>
  <div class="child-item">
    <div class="item-cnt" v-on:click="zhedie($event)">
      <div class="item-line">
        <div class="item-tttt"></div>
        <div class="item-gang"></div>
        <!--<i class="el-icon-caret-right"></i>-->
        <div v-bind:class="childrenData.planIcon"></div>
        <div class="item-cnt-tit">{{childrenData.label}}</div >
      </div>
      <div class="handle-wrap">
        <div class="handle-box" v-if="childrenData.projectType==='2'?true:false">
          <div class="worker">{{childrenData.projectType==='2'?childrenData.userName:''}}</div>
          <div class="time-limit">{{childrenData.taskStartDate}} -- {{childrenData.taskFinishDate}}</div>
          <div class="task-level">
            <div v-bind:class="'task-level-val ' + childrenData.taskLevelBg">{{childrenData.jobLevel}}</div>
          </div>
          <div v-bind:class="'task-status ' + childrenData.statusValColor">{{childrenData.status}}</div>
        </div>
        <div class="edit-box">
          <div v-bind:class="'item-chakan ' + permissions.canSee + ' project-type' + childrenData.projectType" v-on:click="chakan(childrenData.id, childrenData.projectType)">查看详情</div >
          <div v-bind:class="'add-click ' + permissions.canEdit" v-on:click="add(childrenData.id, childrenData.projectType)">添加 </div>
          <div v-bind:class="'del-click ' + permissions.canEdit" v-on:click="modify(childrenData.id, childrenData.projectType)">修改</div >
          <div v-bind:class="'del-click ' + permissions.canEdit + ' project-type' + childrenData.projectType" v-on:click="delNode(childrenData.id, childrenData.projectType)">删除</div >
        </div>
      </div >
    </div>
    <proDetailPlanTreeComp v-bind:permissions="permissions" v-for="childrenItem in childrenData.children" v-bind:childrenData="childrenItem" v-bind:key="childrenItem.id" v-on:modifyEmit="modifyEmitFuc" v-on:addEmit="addEmitFuc" v-on:chakanEmit="chakanEmitFuc" v-on:delEmit="delClick"></proDetailPlanTreeComp>
  </div >

</template>

<script>
// import TreeTest3 from './TreeTest3.vue'
import proDetailPlanTreeComp from './proDetailPlanTreeComp.vue'
export default {
  name: 'proDetailPlanTreeComp',
  // props: ['childrenData', 'permissionObj'],
  props: {
    childrenData: {
      type: null,
      default: function () {
        return {
          children: [],
          id: '',
          label: '',
          member: [],
          planIcon: '',
          projectType: ''
        }
      }
    },
    permissions: {
      type: Object,
      default: function () {
        return { canSee: 'CanSee', canEdit: 'CanEdit' }
      }
    }
  },
  components: {
    proDetailPlanTreeComp
  },
  data () {
    return {
      token: '',
      treeData: ''
    }
  },
  created: function () {
    this.treeData = this.childrenData
  },
  mounted: function () {
    // this.treeData = this.childrenData
  },
  methods: {
    zhedie: function (e) {
      // var obj = e.currentTarget
      // if ($(obj).siblings().css('height') === '0px') {
      //   $(obj).siblings().css('height', 'auto')
      // } else {
      //   $(obj).siblings().css({height: 0})
      // }
    },
    newTreeDataClear: function () {
    },
    delNode: function (id, type) {
      this.$emit('delEmit', {nodeid: id, proType: type})
    },
    delClick: function (obj) {
      this.$emit('delEmit', obj)
    },
    chakan: function (id, type) {
      this.$emit('chakanEmit', {nodeid: id, proType: type})
    },
    chakanEmitFuc: function (obj) {
      // console.log('dddddd:', obj)
      this.$emit('chakanEmit', obj)
    },
    addEmitFuc: function (obj) {
      this.$emit('addEmit', obj)
    },
    modifyEmitFuc: function (obj) {
      this.$emit('modifyEmit', obj)
    },
    add: function (id, type) {
      this.$emit('addEmit', {nodeid: id, proType: type})
    },
    modify: function (id, type) {
      this.$emit('modifyEmit', {nodeid: id, proType: type})
    }
  }
}
</script>

<style scoped>
  /** treewrap 新的树形结构 */

  #treeWrap{
    /*color: #fff;*/
  }
  .child-item{
    box-sizing: border-box;
    margin-left:50px;
    border-left:1px solid #ccc;
    overflow: hidden;
  }
  .child-item.pro-tit{
    margin-left:0
  }
  .child-item:last-child{
    border:none;
  }
  .item-tttt{
    display: none;
  }
  .child-item:last-child>.item-cnt>.item-line>.item-tttt{
    display:inline-block;
    width:1px;
    height:16px;
    position:absolute;
    background-color:#ccc;
  }
  .item-line{
    height:30px;
    position:relative;
    display: flex;
    _border-left: 1px solid #aaa;
  }
  .item-cnt-tit{
    width: 220px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display:inline-block;
  }
  .item-cnt-tit.pro-tit{
    font-size:18px;
  }
  .item-cnt,.handle-box,.edit-box{
    display:flex;
  }
  .item-cnt{
    justify-content:space-between;
  }
  .item-cnt:hover{
    background-color:#f5f5f5;
  }
  /*三角*/
  /*.plan-icon{*/
    /*width:15px;*/
    /*height:15px;*/
    /*font-size: 15px;*/
    /*margin-left:-5px;*/
    /*margin-right:2px;*/
    /*margin-top: 7px;*/
    /*_transform: rotate(45deg);*/
    /*color:#409EFF;*/
  /*}*/
  .plan-icon{
    width: 6px;
    height: 6px;
    margin-left: -2px;
    margin-right: 5px;
    margin-top: 12px;
    _display: inline-block;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    background-color: #409EFF;
  }
  .task-icon{
    width:6px;
    height:6px;
    margin-right:5px;
    margin-top:12px;
    display:inline-block;
    background-color: #F90;
    border-radius: 4px;
    margin-left:0px;
  }
  .handle-wrap{
    display: flex;
  }
  .handle-box{
    width: 530px;
    _flex-grow:1;
    line-height:30px;
  }
  .handle-box div{
    _padding:0 15px;
  }
  .worker{
    font-size: 12px;
    color: #777;
    width: 150px;
  }
  .time-limit{
    font-size: 10px;
    color: #13ce66;
    width: 270px;
  }
  .task-level{
    padding-top: 7px;
    font-size: 12px;
    width: 30px;
  }
  .task-level-val{
    width: 16px;
    height: 16px;
    color: #fff;
    border-radius: 8px;
    line-height: 16px;
    text-align: center;
  }
  .task-status{
    text-align: center;
    font-size: 12px;
    width: 70px;
  }
  .edit-box{
    color: #409eff;
    font-size: 12px;
    line-height:30px;
  }
  .edit-box div{
    padding-left:15px;
  }
  .item-gang{
    width:16px;
    height:15px;
    border-bottom:1px solid #ccc;
  }
  .el-progress--text-inside .el-progress-bar{
    margin-left: 8%;
  }
  .project-type0{
    color: #aaa;
  }
  .item-chakan:hover,.add-click:hover,.del-click:hover{
    cursor: pointer;
  }
  .item-chakan.project-type0:hover,.del-click.project-type0:hover{
    cursor: not-allowed;
  }

  .notCanSee:hover,.notCanEdit:hover{
    color: #999;
    cursor: not-allowed;
  }
</style>
