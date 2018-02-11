// pages/search/index.js
const util = require('../../util/util.js')
const app = getApp()
var addHisKeySet = new Set()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar:1,
    searched:false
  }, 

  picResultSearch:function(e){
    var key = e.currentTarget.dataset.key;
    wx.navigateTo({
      url: '/pages/search/subject?key='+key,
    })
  },
  uploadPhoto:function(){
    var that = this
    wx.chooseImage({
      count:1,
      sizeType: ['compressed'],
      success: function(res) {
        wx.showLoading({
          title: 'AI分析中...',
          mask: true
        })
        var photoimage = res.tempFilePaths[0]; 
        wx.uploadFile({
          url: app.globalData.host + '/CookBook/searchPic',
          filePath: photoimage,
          name: 'file',
          formData: {
            
          },
          complete: function (res) { 
            if (res.statusCode == 200) { 
              var data = JSON.parse(res.data);
              console.log(data.data.result)
              if (data.code == 1) {
                that.setData({
                  picSearchResult: data.data.result,showPhotoButton:0
                }); 

                wx.hideLoading();
              } else {
                util.showToast('图片上传失败,' + data.msg, 'error');
              }
            } else {
              util.showToast('网络异常,上传图片失败', 'error');
            }
          }
        }) 
      },
    })
  },
  cleanHisKey:function(){
    wx.setStorageSync('hiskey', [])
    this.setData({ hisKey: [] })
  },
  subjectDetail:function(e){
    var subjectId = e.currentTarget.dataset.subjectid
    var title = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '/pages/search/subject?subjectId=' + subjectId + "&title=" + title,
    })
  },
  cookBookDetail: function (e) {
    var bookId = e.currentTarget.dataset.cookbookid
    wx.navigateTo({
      url: '/pages/detail/detail?cookBookId=' + bookId,
    })
  },
  clearText:function(){
    this.setData({ key: '', searched:false})
  },

  searchText:function(e){
    var key = e.currentTarget.dataset.key
    key = key.replace(/ /g, '')
    var that = this
    that.setData({key:key})
    if (!key || key === '') {
      util.showToast('搜索关键字为空', 'warn')
      return
    }
    addHisKeySet.add(key)
    var hiskeys = [];
    for (var hk of addHisKeySet) { // 遍历Set  
      hiskeys.push(hk)
    }
    wx.setStorageSync('hiskey', hiskeys)
    that.setData({ W: util.getSysInfo().windowWidth, hisKey: hiskeys })

    wx.showLoading({
      title: '搜索中...',
    })
    util.GET(app.globalData.host + '/CookBook/search', { key: key, classId: 0 }, function (res) {
      if (res && res.code == 1) {
        that.setData({ aiData: res.data, searched: true })
      } else {
        util.showToast('搜索失败', 'error')
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 1000) 
    })
  },
   
  search:function(e){
    var key = e.detail.value
    key = key.replace(/ /g, '')
    var that = this
    if (!key || key===''){
      util.showToast('搜索关键字为空','warn')
      return
    }
    addHisKeySet.add(key)
    var hiskeys = [];
    for (var hk of addHisKeySet) { // 遍历Set  
      hiskeys.push(hk)
    }
    wx.setStorageSync('hiskey', hiskeys)
    that.setData({ W: util.getSysInfo().windowWidth, hisKey: hiskeys })
    
    wx.showLoading({
      title: '搜索中...',
    })
    util.GET(app.globalData.host + '/CookBook/search', { key: key, classId:0}, function (res) {
      if (res && res.code == 1) {
        that.setData({ aiData: res.data, searched: true,bar:1 })
      }else{
        util.showToast('搜索失败','error')
      }
      setTimeout(function(){
        wx.hideLoading()
      },1000)
      
    })
  },
  barChanged:function(e){
    var that = this
    var bar = e.currentTarget.dataset.bar
    that.setData({bar:bar})
    if(bar == 2){
      util.GET(app.globalData.host + '/CookBook/listSubject', {}, function (res) {
        if (res && res.code == 1) {
          that.setData({ subjects: res.data })
        }
      })
    }else if(bar == 1){

    }else if(bar==3){
      that.setData({ showPhotoButton: 1 })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var hiskeys = wx.getStorageSync('hiskey') 
    for (var hk of hiskeys) { // 遍历Set  
      addHisKeySet.add(hk)
    } 
    that.setData({ W: util.getSysInfo().windowWidth, hisKey: hiskeys})

    util.GET(app.globalData.host + '/CookBook/hotCookBook', {}, function (res) {
      if (res && res.code == 1) {
        that.setData({ hotKeys: res.data })
      }
    })
    if (options && options.searchKey){
      var externalKey = options.searchKey
      var key = externalKey
      key = key.replace(/ /g, '')
      var that = this
      
      if (!key || key === '') {
        util.showToast('搜索关键字为空', 'warn')
        return
      }
      addHisKeySet.add(key)
      var hiskeys = [];
      for (var hk of addHisKeySet) { // 遍历Set  
        hiskeys.push(hk)
      }
      wx.setStorageSync('hiskey', hiskeys)
      that.setData({hisKey: hiskeys })

      wx.showLoading({
        title: '搜索中...',
      })
      util.GET(app.globalData.host + '/CookBook/search', { key: key, classId: 0 }, function (res) {
        if (res && res.code == 1) {
          that.setData({ aiData: res.data, searched: true })
        } else {
          util.showToast('搜索失败', 'error')
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)  
      })
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