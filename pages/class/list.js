const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  cookBookDetail: function (e) {
    var bookId = e.currentTarget.dataset.cookbookid
    wx.navigateTo({
      url: '/pages/detail/detail?cookBookId=' + bookId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var classcid = options.classcid
    var classpid = options.classpid 
    var classname = options.classname 
    that.setData({ W: util.getSysInfo().windowWidth, classcid: classcid, classpid: classpid,classname:classname})
    wx.showLoading({
      title: '加载中...',
    })
    util.GET(app.globalData.host + '/CookBook/listByClass', { classcid: classcid, classpid: classpid}, function (res) {
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
    var that = this
    return {
      title: '@所有人,这是我准备的有关【' + that.data.classname + '】的菜谱',
      path: '/pages/class/list?classcid=' + that.data.classcid+'&classpid='+that.data.classpid,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})