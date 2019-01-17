import $ from 'jquery'
import store from '@/store'
import router from '@/router'
const install = function (Vue, options) {
  Vue.prototype.ajax = function (actionName, postData, burl) {
    var baseurl
    if (burl === 'guo') {
      baseurl = store.state.baseServiceUrlGuo + actionName
    } else if (burl === 'yuan') {
      baseurl = store.state.baseServiceUrlYuan + actionName
    } else {
      baseurl = store.state.baseServiceUrl + actionName
    }
    return $.ajax({
      url: baseurl,
      type: 'POST',
      xhrFields: {
        withCredentials: true,
        useDefaultXhrHeader: false
      },
      crossDomain: true,
      data: postData,
      success: function (data) {
        // code: 201 未登录
        if (data.code === 201) {
          router.push('/Login')
        }
      }
    })
  }
  Vue.prototype.log = function (mark, cont) {
    if (store.state.debug) {
      if (cont) {
        return window.console.log(mark, cont)
      } else {
        return window.console.log(mark)
      }
    }
  }
  Vue.prototype.alert = function (test) {
    if (store.state.debug) {
      return window.alert(test)
    }
  }
  Vue.prototype.isImage = function (fileName) {
    var geshi = fileName.substr(-4).indexOf('.') > -1 ? fileName.toLowerCase().substr(-3) : fileName.toLowerCase().substr(-4)
    var isImg = false
    for (var i = 0; i < store.state.fileFormat.length; i++) {
      if (store.state.fileFormat[i] === geshi) {
        isImg = true
      }
    }
    return isImg
  }
  Vue.prototype.ajaxDownFile = function (actionName, postData, burl) {
    var baseurl
    if (burl === 'guo') {
      baseurl = store.state.baseServiceUrlGuo + actionName
    } else if (burl === 'yuan') {
      baseurl = store.state.baseServiceUrlYuan + actionName
    } else {
      baseurl = store.state.baseServiceUrl + actionName
    }
    return $.ajax({
      url: baseurl,
      type: 'GET',
      xhrFields: {
        withCredentials: true,
        useDefaultXhrHeader: false
      },
      crossDomain: true,
      data: postData,
      success: function (data) {
        // code: 201 未登录
        if (data.code === 201) {
          router.push('/Login')
        }
      }
    })
  }
}

// const modules = function () {
//   console.log(555)
// }
// console.log(modules)
export default {
  install
}
