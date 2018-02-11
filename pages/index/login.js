// pages/index/login.js
const util = require('../../util/util.js')
const app = getApp()
var countDown = 0
var intervalHandler
var mobile
var backurl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    countDown: 0,
    animationData: {}
  },
  login: function (e) {
    var formMobile = e.detail.value.mobile
    var smsCode = e.detail.value.smsCode 

    if (!formMobile || formMobile === '') {
      util.showToast('手机号码为空', 'warn')
      return
    }
    if (!util.isMobile(mobile)) {
      util.showToast('非手机号码', 'warn')
      return
    }
    if (!smsCode || smsCode === '') {
      util.showToast('短信验证码为空', 'warn')
      return
    }
    util.GET(app.globalData.host + "/cookbook/loginByMobileAndCode", { mobile: formMobile, code: smsCode }, function (res) {
      if (res && res.code == 1) {
        var session = res.data
        wx.setStorageSync('session', session)
        if (backurl) {
          wx.reLaunch({
            url: backurl,
          })
        } else {
          wx.reLaunch({
            url: '/pages/recommend/recommend',
          })
        }
      } else {
        util.showModal(res.msg, 'error')
      }
    })
  },
  getMobileValue: function (e) {
    mobile = e.detail.value
  },

  sendSmsCode: function () {
    var that = this
    if (!util.isMobile(mobile)) {
      util.showToast('非手机号码', 'warn')
      return
    }
    util.GET(app.globalData.host + "/cookbook/sendAutCode", { mobile: mobile }, function (res) {
      if (res && res.code == 1) {
        util.showModal('发送成功，请注意查收短信', 'success')
        countDown = 60
        intervalHandler = setInterval(function () {
          countDown--
          if (countDown <= 0) {
            countDown = 0
            clearInterval(intervalHandler)
          }
          that.setData({ countDown: countDown })
        }, 1000)
      } else {
        util.showModal(res.msg, 'error')
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    console.log(options)
    backurl = decodeURIComponent(options.backurl)
    console.log('backurl', backurl)
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
    var that = this
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.scale(1.5, 1.5).step()
    var animation1 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation1.scale(1, 1).rotate(-8).step()
    setTimeout(function () {
      that.setData({
        animationData: animation.export()
      })
      that.setData({
        animationDataLine: animation1.export()
      })
    }, 1000)

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    animation.scale(1, 1).step()
    var animation1 = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease',
    })
    animation1.scale(1, 1).rotate(8).step()
    that.setData({
      animationData: animation.export()
    })
    that.setData({
      animationDataLine: animation1.export()
    })
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