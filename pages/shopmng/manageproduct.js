// pages/shopmng/manageproduct.js
const util = require('../../util/util.js')
const app = getApp()
var page=1,pageSize=10
var keyword=''
var status=-1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusSourceUrl: app.globalData.host + '/ShopMng/listSource?type=2'
  },
  addProduct:function(){
    wx.navigateTo({
      url: '/pages/shopmng/product',
    })
  },
  itemClick:function(e){
    wx.navigateTo({
      url: '/pages/shop/detail?productId=' + e.currentTarget.dataset.productid +'&isPreview=1',
    })
  },
  keywordinput:function(e){
    keyword = e.detail.value
  },
  searchProductList:function(){
    var that = this
    util.GET(app.globalData.host + '/ShopMng/listMyProduct',
      {
        session: wx.getStorageSync('session'),
        status: status,
        keyword: keyword,
        page: 1,
        pageSize: pageSize
      }, function (rsp) {
        if (rsp && rsp.code == 1) {
          that.setData({ list: rsp.data })
        } else if (rsp && rsp.code == -2) {
          /**跳转到申请成为商家页面 */
        } else if (rsp && rsp.code == -1) {
          util.showToast(rsp.msg, 'error')
        } else {
          util.showToast('下拉刷新', 'error')
        }
      })
  },
  statuSelected:function(e){
    status = e.detail.id
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      W: wx.getSystemInfoSync().windowWidth
    })
    util.checkLogin(false,function(){
      util.GET(app.globalData.host + '/ShopMng/listMyProduct',
      {
        session:wx.getStorageSync('session'),
        status: status,
        page: page,
        pageSize: pageSize
      },function(rsp){
        if (rsp && rsp.code == 1){
            that.setData({list:rsp.data})
        }else if(rsp && rsp.code == -3){
          /**跳转到申请成为商家页面 */
          wx.redirectTo({
            url: '/pages/shopmng/apply',
          })
        }else if(rsp && rsp.code == -1){
            util.showToast(rsp.msg,'error')
        }else{
          util.showToast('下拉刷新', 'error')
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
    var that = this
    page=1
    util.GET(app.globalData.host + '/ShopMng/listMyProduct',
      {
        session: wx.getStorageSync('session'),
        status: status,
        keyword: keyword,
        page: page,
        pageSize: pageSize
      }, function (rsp) {
        if (rsp && rsp.code == 1) {
          that.setData({ list: rsp.data })
        } else if (rsp && rsp.code == -3) {
          /**跳转到申请成为商家页面 */ 
        } else if (rsp && rsp.code == -1) {
          util.showToast(rsp.msg, 'error')
        } else {
          util.showToast('下拉刷新', 'error')
        }
        setTimeout(function () { wx.stopPullDownRefresh()},300)        
      })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      page=page+1
      var that = this
      util.GET(app.globalData.host + '/ShopMng/listMyProduct',
        {
          session: wx.getStorageSync('session'),
          status: status,
          keyword: keyword,
          page: page,
          pageSize: pageSize
        }, function (rsp) {
          if (rsp && rsp.code == 1) {
            if (rsp.data && rsp.data.length==0){
              util.showToast('没有更多了','info')
              return
            }
            var copy = that.data.list
            for(let i in rsp.data){
              copy.push(rsp.data[i])
            }
            that.setData({ list: copy })
          } else if (rsp && rsp.code == -3) {
            /**跳转到申请成为商家页面 */
          } else if (rsp && rsp.code == -1) {
            util.showToast(rsp.msg, 'error')
          } else {
            util.showToast('下拉刷新', 'error')
          }
          setTimeout(function () { wx.stopPullDownRefresh() }, 300)
        })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})