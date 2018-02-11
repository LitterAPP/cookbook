import Upload from '../../util/upload.js'
const util = require('../../util/util.js')
const app = getApp()
var frontCard, backCard, smsCode, sellerWx
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sendUrl: app.globalData.host + '/Sms/sendCode',
    frontCard: { localUrl: "", remoteUrl: "" },
    backCard: { localUrl: "", remoteUrl: "" },
    smsCode: { mobile: '', code: '' },
    sellerWx: ''
  },

  cardFrontChanged: function (e) {
    frontCard = e.detail
  },
  cardBackChanged: function (e) {
    backCard = e.detail
  },
  smscodeBlur: function (e) {
    smsCode = e.detail
  },
  applay: function (e) {
    if (!frontCard || !frontCard.localUrl) {
      util.showToast('身份证正面为空', 'error')
      return
    }
    if (!backCard || !backCard.localUrl) {
      util.showToast('身份证反面为空', 'error')
      return
    }
    if (!smsCode || !smsCode.mobile || !smsCode.code) {
      util.showToast('手机验证为空', 'error')
      return
    }
    sellerWx = e.detail.value.sellerWx
    if (!sellerWx) {
      util.showToast('微信号为空', 'error')
      return
    }
    //上传图片
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    var uploadUrl = app.globalData.host + '/Upload/uploadFile'
    let uploadTask = new Upload([frontCard.localUrl, backCard.localUrl])
    uploadTask.upload(uploadUrl, function (keys) {
      let frontCardKey = keys[0]
      let backCardKey = keys[1]
      util.POST(app.globalData.host + '/ShopMng/apply',
        {
          session: wx.getStorageSync('session'),
          frontCardKey: frontCardKey,
          backCardKey: backCardKey,
          mobile: smsCode.mobile,
          code: smsCode.code,
          sellerWx: sellerWx
        }, function (rsp) {
          if (rsp && rsp.code == 1) {
            util.showWindow('申请成功', '平台采用后审机制，后续发现资料不符或存在违法则封号处理', false, function () {

              wx.switchTab({
                url: '/pages/space/index',
              })
            }, function () { })
          } else if (rsp && rsp.msg) {
            util.showToast(rsp.msg, 'error')
          } else {
            util.showToast('服务器异常', 'error')
          }
          wx.hideLoading()
        })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/ShopMng/applyInfo',
        {
          session: wx.getStorageSync('session')
        }, function (rsp) {
          if (!rsp || rsp.code !== 1) {
            util.showToast('服务器异常', 'error')
          } else if (rsp && rsp.code == 1) {
            if(rsp.data.isSeller){
              util.showToast('您已经是店小二了','success')
              var frontCard = {}
              frontCard['remoteUrl'] = rsp.data.frontCardUrl
              var backCard = {}
              backCard['remoteUrl'] = rsp.data.backCardUrl
              that.setData({ pageshow:true,isSeller: true, frontCard: frontCard, backCard: backCard, mobile: rsp.data.mobile, sellerWx:rsp.data.wx})
            }else{
              that.setData({ pageshow:true,isSeller:false})
            }
          }
        })
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