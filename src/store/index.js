import Vue from 'vue'
import Vuex from 'vuex'
// import $ from 'jquery'

Vue.use(Vuex)

const state = {
  debug: false,
  currentTab: 'ProDetailPlanTree',
  TaskPlanCurrentTab: 'MyTask',
  // 树形结构 宽度增值的倍数
  beishu: 0,
  kk: true,
  chakanClickObj: {
    clickNum: 0,
    type: '',
    id: ''
  },
  addPlanTaskClickObj: {
    clickNum: 0,
    id: '',
    projectType: ''
  },
  delPlanTaskClickObj: {
    clickNum: 0,
    id: ''
  },
  zzzz: '',
  chakanClickNum: 0,
  count: 1,
  userId: '',
  routerName: '我的任务',
  planId: 'P0f427250b8e5456284cd0dad10963c66',
  projectUID: 'S985f6fce4c314bdea9af55087557936c',
  routerNameArr: [
    {
      name: '我的任务',
      parentName: 'TaskPlan',
      isBack: false,
      url: '/'
    }
  ],
  // baseServiceUrl: 'https://srm.baho.cn/employee',
  // baseServiceUrl: 'https://srm.baho.cn/employee',
  // baseServiceUrl: 'http://10.0.5.29:8088',
  // baseServiceUrl: 'http://10.0.5.66:8089',
  // baseServiceUrl: 'https://pms.baho.cn/pms',
  // baseServiceUrl: 'https://pms.baho.cn/pms',
  // baseServiceUrl: 'https://pms.baho.cn/pms',
  baseServiceUrl: 'http://ityp.baho.cn/pms',
  // baseServiceUrl: 'http://10.0.5.66:8089',
  // 招聘登陆信息存储
  zpLogin: '',
  isOnlySee: '',
  isCanEdit: '',
  // 可预览的文件格式
  fileFormat: ['jpg', 'jpeg', 'png', 'gif']
}
const mutations = {
  setRouterName (state, obj) {
    obj.isBack = false
    var isNull = false
    for (var i = 0; i < state.routerNameArr.length; i++) {
      if (obj.parentName) {
        if (state.routerNameArr[i].name === obj.name || state.routerNameArr[i].parentName === obj.parentName) {
          state.routerNameArr.splice(i + 1)
          state.routerNameArr[i].name = obj.name
          isNull = true
        }
      } else {
        if (state.routerNameArr[i].name === obj.name) {
          state.routerNameArr.splice(i + 1)
          state.routerNameArr[i].name = obj.name
          isNull = true
        }
      }
    }
    if (!isNull) {
      state.routerNameArr.push(obj)
    }
  },
  add (state) {
    state.count += 1
  },
  reduce (state) {
    state.count -= 1
  },
  canSee (state, isShow) {
    state.isOnlySee = isShow
  },
  canEdit (state, isShow) {
    state.isCanEdit = isShow
  },
  callService (state, postdata) {
    $.ajax({
      url: state.baseServiceUrl + postdata.url,
      type: 'POST',
      xhrFields: {
        withCredentials: true,
        useDefaultXhrHeader: false
      },
      crossDomain: true,
      data: postdata.postData,
      success: function (data) {
        if (data.code === 200) {
          state[postdata.actionName] = data
        }
      }
    })
  }
}

export default new Vuex.Store({
  state,
  mutations
})
