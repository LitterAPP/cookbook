// pages/detail/detail.js
const util = require('../../util/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  favor:function(){
    var that = this
    var session = wx.getStorageSync('session')
    util.checkLogin('/pages/detail/detail?cookBookId=' + that.data.cookBook.cookBook.cookBookInfoId, function () {
      wx.showLoading({
        title: '点赞...',
      })
      util.GET(app.globalData.host + '/CookBook/favor', { session: wx.getStorageSync('session'), cookBookId: that.data.cookBook.cookBook.cookBookInfoId }, function (res) {
        if (res && res.code == 1) {
           util.showToast('点赞成功','success') 
        } 
        that.setData({ favor: that.data.favor + 1 })
        setTimeout(function () { wx.hideLoading() }, 300)
      })
    })
  },
  addToMenu: function () {
    var that = this
    util.checkLogin('/pages/detail/detail?cookBookId=' + that.data.cookBook.cookBook.cookBookInfoId,function(){       
      wx.redirectTo({
        url: '/pages/menu/menu?cookBookId=' + that.data.cookBook.cookBook.cookBookInfoId + '&cookBookName=' + that.data.cookBook.cookBook.name,
        complete:function(res){
          console.log(res)
        }
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight })
    var session = wx.getStorageSync('session')
    if (options && options.cookBookId) {
      wx.showLoading({
        title: '加载中...',
      })
      util.GET(app.globalData.host + '/CookBook/getCookBookInfo', { session:session,cookBookId: options.cookBookId }, function (res) {
        if (res && res.code == 1) { 
          that.setData({ cookBook: res.data, favor: res.data.favor})
          setTimeout(function () {
            wx.setNavigationBarTitle({
              title: that.data.cookBook.cookBook.name,
            })
          }, 200)
        }
        setTimeout(function () { wx.hideLoading() }, 300)
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
    return {
      title: '@所有人,'+that.data.cookBook.cookBook.name+',味道很Nice' ,
      path: '/pages/detail/detail?cookBookId=' + that.data.cookBook.cookBook.cookBookInfoId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})