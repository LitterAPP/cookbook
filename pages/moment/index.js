const util = require('../../util/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  reset: function () {
    wx.navigateBack({
    })
  },
  sendMoment: function (e) {
    var that = this
    if (!e.detail.value.introduction || e.detail.value.introduction === '') {
      util.showToast('表达是你的权利...', 'warn')
      return;
    }
    wx.showLoading({
      title: '发表中...',
      mask: false
    })
    var introduction = e.detail.value.introduction
    var session = wx.getStorageSync('session')
    console.log('that.data.pics && that.data.pics.length>0', that.data.pics && that.data.pics.length > 0)
    var uploadPics = [];
    if (that.data.pics && that.data.pics.length > 0) {
      uploadPics = that.data.pics
      if (uploadPics[uploadPics.length - 1] === '/images/add_menu.png') {
        uploadPics.pop()
      }
    }
    util.uploadFiles(app.globalData.host + '/CookBook/uploadFile', session, uploadPics, function (pickeys) {
      util.GET(app.globalData.host + '/CookBook/sendMoment', { session: session, name: '', introduction: introduction, keys: pickeys, type: 1 }, function (res) {
        if (res && res.code == 1 && res.data) {
          wx.navigateBack({
          })
          setTimeout(function () { wx.hideLoading() }, 300)
        } else {
          util.showToast(res.msg || '发表失败', 'error')
        }
        
      })
    })

  },
  previewPhoto: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var pics = that.data.pics
    if (pics[pics.length - 1] === '/images/add_menu.png') {
      pics.pop()
    }
    wx.previewImage({
      current: pics[index],
      urls: pics,
    })
  },
  addPhoto: function () {
    var that = this
    var pics = that.data.pics
    pics.pop()
    var count = 9 - pics.length
    wx.chooseImage({
      count: count,
      success: function (res) {
        for (var i in res.tempFilePaths) {
          pics.push(res.tempFilePaths[i])
        }
        if (pics.length < 9) {
          pics.push('/images/add_menu.png')
        }
        that.setData({ pics: pics })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({ W: util.getSysInfo().windowWidth })
    if (options && options.pics) {
      var pics = JSON.parse(decodeURIComponent(options.pics));
      var picss = pics.pics;
      if (picss.length < 9) {
        picss.push('/images/add_menu.png')
      }
      that.setData({ pics: picss })
    }
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