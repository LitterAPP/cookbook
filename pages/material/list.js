const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
 
  markeMaterial:function(e){
    var that = this
    var materialId = e.currentTarget.dataset.materialid
    wx.showLoading({
      title: '标记中...',
    })
    util.GET(app.globalData.host + '/CookBook/markMaterial', { materialId: materialId }, function (res) {
      if (res && res.code == 1) {
        util.GET(app.globalData.host + '/CookBook/listPackMaterial', { menuId: that.data.menu.id }, function (res) {
          if (res && res.code == 1) {
            that.setData({ menu: res.data.menu, list: res.data.list })
            setTimeout(function () {
              wx.setNavigationBarTitle({
                title: '【' + that.data.menu.menuName + '】食材',
              })
            }, 300)
          }
          setTimeout(function () { wx.hideLoading() }, 300)
        })
      }
      setTimeout(function () { wx.hideLoading() }, 300)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var menuId = options.menuId
    util.GET(app.globalData.host + '/CookBook/listPackMaterial', { menuId: menuId },function(res){
      if(res && res.code ==1){
        that.setData({menu:res.data.menu,list:res.data.list})
        setTimeout(function () {
          wx.setNavigationBarTitle({
            title: '【'+that.data.menu.menuName+'】食材',
          })
        }, 300)
      }
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
      title: '【'+that.data.menu.menuName+'】需要准备的食材',
      path: '/pages/material/list?menuId='+that.data.menu.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})