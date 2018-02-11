const util = require('../../util/util.js')
const app = getApp()
var listNumber;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  gotoSearch:function(){
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },
  cookBookDetail:function(e){
  var bookId = e.currentTarget.dataset.cookbookid
    wx.navigateTo({
      url: '/pages/detail/detail?cookBookId='+bookId,
    })
  },
  reflushRecmdByTime:function(){
    var that = this
    var session = wx.getStorageSync('session')
    util.GET(app.globalData.host + '/CookBook/recommendByTime', { session: session, number: 10 }, function (res) {
      if (res && res.code == 1) {
        that.setData({ topData: res.data })
      }
    })
  },
  reflushRecmdByAi:function(){
    var that = this
    var session = wx.getStorageSync('session')
    util.GET(app.globalData.host + '/CookBook/recommendByFavor', { session: session, number: listNumber }, function (res) {
      if (res && res.code == 1) {
        that.setData({ aiData: res.data })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this 
    listNumber = Math.floor(util.getSysInfo().windowHeight / 85);
    that.setData({ W: util.getSysInfo().windowWidth })

    util.checkLogin('/pages/recommend/recommend',function(){
      wx.showLoading({
        title: '智能推荐中...',
      })
      util.GET(app.globalData.host + '/CookBook/recommendByTime', { session: wx.getStorageSync('session'), number: 10 }, function (res) {
        if (res && res.code == 1) {
          that.setData({ topData: res.data })
        }
      })

      util.GET(app.globalData.host + '/CookBook/recommendByFavor', { session: wx.getStorageSync('session'), number: listNumber }, function (res) {
        if (res && res.code == 1) {
          that.setData({ aiData: res.data })
        }
        setTimeout(function(){wx.hideLoading()},300)
      })
    });  
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
    var that = this 
    var session = wx.getStorageSync('session')
    listNumber = Math.floor(util.getSysInfo().windowHeight / 85); 
    util.GET(app.globalData.host + '/CookBook/recommendByTime', { session: session, number: 10 }, function (res) {
      if (res && res.code == 1) {
        that.setData({ topData: res.data })
      }
    })

    util.GET(app.globalData.host + '/CookBook/recommendByFavor', { session: session, number: listNumber }, function (res) {
      if (res && res.code == 1) {
        that.setData({ aiData: res.data })
      }
    })
    setTimeout(function(){wx.stopPullDownRefresh()},500)
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
  
  }
})