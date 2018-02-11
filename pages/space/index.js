const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  goApplyProduct:function(){
    wx.navigateTo({
      url: '/pages/shopmng/apply',
    })
  },
  goMyOrder:function(){
    wx.navigateTo({
      url: '/pages/shop/orderlist',
    })
  },
  goMyWallet: function () {
    wx.navigateTo({
      url: '/pages/space/wallet',
    })
  },

  goMyCollected: function () {
    wx.navigateTo({
      url: '/pages/shop/collect',
    })
  },
  goManageProduct: function () {
   
    wx.navigateTo({
      url: '/pages/shopmng/manageproduct',
    })
  },
  
  
  goDongTatBar:function(){
    wx.switchTab({
      url: '/pages/menu/share',
    })
  },
  goAyouch:function(){ 
    wx.navigateTo({
      url: '/pages/test/ayouch',
    })
  },

  goMenu: function () {
    wx.navigateTo({
      url: '/pages/menu/menu',
    })
  },

  authorize:function(){
    var that = this
    util.checkLogin(true, function () {
      that.setData({ userinfo: wx.getStorageSync('userinfo') })
    });  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth })
    util.checkLogin('', function () {
      that.setData({ userinfo: wx.getStorageSync('userinfo') })
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