const util = require('../../util/util.js')
const app = getApp()
var classid
var title 
var key
Page({

  /**
   * 页面的初始数据
   */
  data: {
    webview:false
  },
  cookBookDetail: function (e) {
    var bookId = e.currentTarget.dataset.cookbookid
    wx.navigateTo({
      url: '/pages/detail/detail?cookBookId=' + bookId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this    
    that.setData({ W: util.getSysInfo().windowWidth })
    title = options.title|| '知胃Tasty'
    setTimeout(function(){wx.setNavigationBarTitle({
      title: title,
    })},200)

    if (options && options.subjectId){ 
      that.setData({ weburl: app.globalData.host + '/CookBook/subjectDetail?subjectId=' + options.subjectId,webview:true})
    } else if (options && options.key){
      wx.showLoading({
        title: '加载中...',
      })
      key = options.key
      util.GET(app.globalData.host + '/CookBook/search', { key: key, classId: 0 }, function (res) {
        if (res && res.code == 1) {
          that.setData({ list: res.data.list })
        } else {
          util.showToast('加载失败', 'error')
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    var path
    if (classid){
      path = '/pages/search/subject?classId =' + classid+'&title='+title
    }else if(key){
      path = '/pages/search/subject?key =' + key + '&title=' + title
    }
    return {
      title: '@你就是我最关心的人【'+title+']',
      path: path,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }  
})