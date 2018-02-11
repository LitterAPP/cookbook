const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goToSendGoods:function(e){    
    var orderId = this.data.order.orderId
    var address = JSON.stringify(this.data.order.address)
    var orderInfo = JSON.stringify({ groupImg: this.data.order.groupImg, productName: this.data.order.productName, buyNum: this.data.order.buyNum, totalPay: this.data.order.totalPay, groupTogetherPrice: this.data.order.groupTogetherPrice, groupPrice: this.data.order.groupPrice, together: this.data.order.together||false})
    wx.navigateTo({
      url: '/pages/shopmng/deliver?orderId=' + orderId + '&address=' + encodeURIComponent(address) + '&orderInfo=' + encodeURIComponent(orderInfo),
    })
  },
  call:function(e){
    var telNumber  = e.currentTarget.dataset.sellertelnumber
    wx.makePhoneCall({
      phoneNumber: telNumber,
    })
  },
  copy:function(e){ 
    util.copyData(e.currentTarget.dataset.copydata)
  },

  traceShipper: function (e) {
    var that = this 
    if (e.detail.value){
      wx.showLoading({
        title: '查询物流...',
        mask:true
      })
      util.GET(app.globalData.host + '/shop/shipperTraces',
        {
          session: wx.getStorageSync('session'),
          expressId: that.data.order.express.id
        }, function (res) {
          var tracesStr = res.data.traces
          var traces = JSON.parse(tracesStr);
          that.setData({ shipper: res.data, traces:traces })
          wx.hideLoading()
          that.setData({ showShipper: e.detail.value })
        })
    }else{
      that.setData({ showShipper: false })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var orderId = options.orderId
    that.setData({ W: util.getSysInfo().windowWidth, H: util.getSysInfo().windowHeight })
    util.checkLogin(false, function () {
      util.GET(app.globalData.host + '/shop/orderDetail',
        {
          session: wx.getStorageSync('session'),
          orderId: orderId
        }, function (res) {
          if(res && res.code == 1){
            if (res.data.together) {
              var joners = res.data.together.joiner
              var totalNumber = res.data.together.totalNumber
              for (var i = 0; i < totalNumber; i++) {
                if (!joners[i]) {
                  joners.push({ name: ' ', avatar: '/images/wh2.png' })
                }
              }
            }
            that.setData({ order: res.data, togethers: joners, pageshow:true })
          }else{ 
            util.showToast('订单不存在');
            setTimeout(function(){
              wx.navigateBack({

              })
            },1000)           
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
    var that = this
    return {
      title: that.data.order.together.totalNumber +'人团,还差' + that.data.order.together.residueNumber +'人成团,拼团价￥' + that.data.order.groupTogetherPrice +','+ that.data.order.groupName,
      imageUrl: that.data.order.groupImg,
      path: '/pages/shop/detail?productId=' + that.data.order.productId + '&together=2&togetherid=' + that.data.togethers[0].id + '&togetherMaster=' + that.data.togethers[0].name ,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})