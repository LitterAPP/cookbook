const util = require('../../util/util.js')
const app = getApp()
var express
Page({

  /**
   * 页面的初始数据
   */
  data: {
    expressSourceUrl: app.globalData.host + '/ShopMng/listSource?type=3',
    orderId:'QL-20171222113947-110378',
    address: { userName: '文小瑜', telNumber: '13726759844', provinceName: '广东省', cityName: '广州市', countyName: '增城区', detailInfo:'翡翠绿洲71栋1102'},
    sendButtonDisable:false
  },

  expressSelected:function(e){
    express = e.detail
  },
  doSentGood:function(e){
    console.log(e.detail.value)
    var expressOrderCode = e.detail.value.expressCode
    if (!express || !express.id){
      util.showToast('请选择物流公司','error')
      return
    }

    if (!expressOrderCode){
      util.showToast('请输入快递单号', 'error')
      return 
    }
    wx.showLoading({
      title: '发货中...',
      mask:true
    })
    var that = this
    util.GET(app.globalData.host + '/ShopMng/deliver',
      {
        session: wx.getStorageSync('session'),
        orderId: that.data.orderId,
        expressName: express.value,
        expressCode: express.id,
        expressOrderCode: expressOrderCode
      },function(rsp){
        if(rsp && rsp.code == 1){
          util.showToast('发货成功', 'success')
          that.setData({ sendButtonDisable:true})
        }else if(rsp && rsp.msg){
          util.showToast(rsp.msg, 'error')
        }else{
          util.showToast('发货失败', 'error')
        }
        wx.hideLoading()
      } )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var orderId = options.orderId
    var address = JSON.parse( decodeURIComponent(options.address))
    var orderInfo = JSON.parse(decodeURIComponent(options.orderInfo) )
 
    this.setData({ orderId: orderId, address: address, order: orderInfo, W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight})
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