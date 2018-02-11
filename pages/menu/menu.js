const util = require('../../util/util.js')
const app = getApp()
var cookBookId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInput: 0
  },
  reset: function () {
    this.setData({ showInput: 0, uploadBanner: null })
  },
  lookMenu: function (e) {
    var menuId = e.currentTarget.dataset.menuid
    wx.navigateTo({
      url: '/pages/menu/detail?menuId=' + menuId,
    })
  },
  showMenuInput: function () {
    this.setData({ showInput: 1, uploadBanner: null })
  },

  addMenu: function (e) {
    if (!e.detail.value.menuName || e.detail.value.menuName === '') {
      util.showToast('菜单名称不能为空', 'warn')
      return;
    }
    if (!this.data.uploadBanner || this.data.uploadBanner == null) {
      util.showToast('必须上传横幅', 'warn')
      return;
    }
    var that = this
    var session = wx.getStorageSync('session')
    var name = e.detail.value.menuName
    var introduction = e.detail.value.introduction
    wx.showLoading({
      title: '保存中...',
    })

    wx.uploadFile({
      url: app.globalData.host + '/CookBook/uploadFile',
      filePath: that.data.uploadBanner,
      name: 'file',
      formData: {
        session: session
      },
      success: function (res) {       
        console.log('upload file res:', res)
        if (res && res.statusCode == 200 ) {
          var resJson = JSON.parse(res.data); 
          if (!resJson.data ){
            util.showToast('横幅上传失败', 'error')
            return 
          }
          util.GET(app.globalData.host + '/CookBook/addMenu', { session: session, name: name, introduction: introduction, key: resJson.data }, function (res) {
            if (res && res.code == 1 && res.data) {
              util.showToast('保存成功', 'success')
              util.GET(app.globalData.host + '/CookBook/listMyMenu', { session: session }, function (res) {
                if (res && res.code == 1) {
                  that.setData({ menuList: res.data })
                } else {
                  util.showToast(res.msg || '保存失败', 'error')
                }
              })
              that.setData({ showInput: 0 })
            } else {
              util.showToast(res.msg||'保存失败', 'error')
            }
            setTimeout(function () { wx.hideLoading() }, 300)
          })
        }else{
          util.showToast(res.msg || '保存失败', 'error')
        }
      },
      fail: function (res) {
        util.showToast('横幅上传失败', 'error')
      }
    })
  },
  addInMenu: function (e) {
    var menuId = e.currentTarget.dataset.menuid
    var that = this
    var session = wx.getStorageSync('session')
    wx.showLoading({
      title: '加入中...',
    })
    util.GET(app.globalData.host + '/CookBook/addInMenu', { session: session, menuId: menuId, cookBookId: cookBookId }, function (res) {
      if (res && res.code == 1 && res.data) {
        util.GET(app.globalData.host + '/CookBook/listMyMenu', { session: session }, function (res) {
          if (res && res.code == 1) {
            that.setData({ menuList: res.data })
          } else {
            util.showToast(res.msg, 'error')
          }
          setTimeout(function () { wx.hideLoading() }, 300)
        })
      } else {
        util.showToast(res.msg, 'error')
      }
      setTimeout(function () { wx.hideLoading() }, 300)
    })
  },
  deleteMenu: function (e) {
    var session = wx.getStorageSync('session')
    var menuId = e.currentTarget.dataset.menuid
    var that = this
    this.setData({ showDelete: 0 })
    wx.showLoading({
      title: '删除中...',
    })
    util.GET(app.globalData.host + '/CookBook/delMenu', { session: session, menuId: menuId }, function (res) {
      if (res && res.code == 1 && res.data) {
        util.GET(app.globalData.host + '/CookBook/listMyMenu', { session: session }, function (res) {
          if (res && res.code == 1) {
            that.setData({ menuList: res.data })
          } else {
            util.showToast(res.msg, 'error')
          }
        })
      } else {
        util.showToast(res.msg, 'error')
      }
      setTimeout(function () { wx.hideLoading() }, 300)
    })
  },
  showDelete: function () {
    this.setData({ showDelete: 1 })
  },
  cancelMenu: function () {
    this.setData({ showDelete: 0 })
  },
  uploadBanner: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.setData({ uploadBanner: res.tempFilePaths[0] })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var session = wx.getStorageSync('session')
    cookBookId = options.cookBookId || 0
    var cookBookName = options.cookBookName
    if (cookBookName) {
      setTimeout(function () {
        wx.setNavigationBarTitle({
          title: '将【' + cookBookName + '】加入菜单',
        })
      }, 200)
    }
    this.setData({ cookBookId: cookBookId, W: util.getSysInfo().windowWidth })
    wx.showLoading({
      title: '加载中...',
    })
    util.checkLogin('1', function () {
      util.GET(app.globalData.host + '/CookBook/listMyMenu', { session: wx.getStorageSync('session') }, function (res) {
        if (res && res.code == 1) {
          that.setData({ menuList: res.data })
        } else {
          util.showToast(res.msg, 'error')
        }
        setTimeout(function () { wx.hideLoading() }, 300)
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