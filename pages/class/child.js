// pages/class/child.js
const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  classClick:function(e){
    var classcid = e.currentTarget.dataset.classcid
    var classpid = e.currentTarget.dataset.classpid
    var classname = e.currentTarget.dataset.classname
    wx.navigateTo({
      url: '/pages/class/list?classcid=' + classcid + "&classpid=" + classpid + '&classname=' + classname,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth })
    var classpid = options.classpid
    var classpname = options.classpname
    setTimeout(function(){
      wx.setNavigationBarTitle({
        title: classpname,
      })
    },200)
    wx.showLoading({
      title: '加载中...',
    })
    util.GET(app.globalData.host + '/CookBook/listChildClass', { classpid: classpid}, function (res) {
      if (res && res.code == 1) {
        that.setData({ list: res.data })
      }
      setTimeout(function () { wx.hideLoading() }, 300)
    })
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
  
  }
})