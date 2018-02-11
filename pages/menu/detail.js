// pages/menu/detail.js
const util = require('../../util/util.js')
const app = getApp()
var page=1,num=10
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  goSearch:function(){
    wx.navigateTo({
      url: '/pages/search/index',
    }) 
  },
  deleteOneCookBook:function(e){
    var that =this
    var menuId = that.data.menu.id
    var session = wx.getStorageSync('session')
    var bookId = e.currentTarget.dataset.cookbookid
    if (!bookId) {
      return;
    }

    wx.showLoading({
      title: '删除中...',
      mask:true
    })

    util.GET(app.globalData.host + '/CookBook/deleteCookBookFromMenu', { session: session, menuId: menuId, cookBookId: bookId }, function (res) {
      if (res && res.code == 1) {
        util.GET(app.globalData.host + '/CookBook/listCookBookByMenuId', { session: session, menuId: menuId }, function (res) {
          if (res && res.code == 1) {
            var indexs = [];
            if (res.data.menus){
              for (var index = 0; index < Math.round(res.data.menus.length / 2); index++) {
                indexs.push(index)
              }
            }
            that.setData({ indexs: indexs, list: res.data.menus, menu: res.data.menu, admin: res.data.admin,user:res.data.user })
            setTimeout(function () {
              wx.setNavigationBarTitle({
                title: that.data.menu.menuName,
              })
            }, 300)
          } 
          setTimeout(function () { wx.hideLoading() }, 300)
        })
      } 
      setTimeout(function () { wx.hideLoading() }, 300)      
    })
  },
  listMaterial:function(){
    wx.redirectTo({
      url: '/pages/material/list?menuId=' + this.data.menu.id,
    })
  },
  packMaterial:function(){
    var menuId = this.data.menu.id
    var session = wx.getStorageSync('session')
    wx.showModal({
      title:'食材打包',
      content:'食材打包会覆盖上次打包清单',
      showCancel:true,
      cancelText:'取消',
      confirmText:'确定',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: '食材计算中...',
            mask: true
          })
          util.GET(app.globalData.host + '/CookBook/packMaterial', { session: session, menuId: menuId }, function (res) {
            if (res && res.code == 1) {
              wx.redirectTo({
                url: '/pages/material/list?menuId=' + menuId,
              })
            }
            setTimeout(function () { wx.hideLoading() }, 300)
          })
        } else if (res.cancel) {
           
        }
      }
    }) 
  },
  cookBookDetail: function (e) {
    var bookId = e.currentTarget.dataset.cookbookid
    if (!bookId){
      return ;
    }
    wx.redirectTo({
      url: '/pages/detail/detail?cookBookId=' + bookId,
    })
  },
  showInputBox: function (e) {
    var that = this
    util.checkLogin(true, function () {
      
      var favors = that.data.favors  
      var userinfo = wx.getStorageSync('userinfo')
      var userId = userinfo.id
      var favored = false
      for (var j in favors) {
        if (userId == favors[j].userId) {
          favored = true
          break
        }
      }
      that.setData({ showInputBox: true, inputfocus: true, favored: favored })
    })
  },

  favorSend: function () {
    var that = this
    util.checkLogin(true, function () {
      var session = wx.getStorageSync('session')
      util.GET(app.globalData.host + '/CookBook/favorMenu', { session: session, menuId: that.data.menu.id, favored: that.data.favored }, function (res) {
        if (res && res.code == 1) {
          var userinfo = wx.getStorageSync('userinfo')
          var favors = that.data.favors
          if (that.data.favored) {
            for (var j in favors) {
              if (favors[j].userId = userinfo.id) {
                 favors.splice(j, 1)
              }
            }
            util.showToast('取消成功', 'success')
          } else {
            var addFavor = { userId: userinfo.id, userName: userinfo.nickName }
            favors.unshift(addFavor)
            util.showToast('点赞成功', 'success')
          } 
          that.setData({ favors: favors, showInputBox: false, inputfocus: false }) 
        } else {
          util.showToast('点赞失败', 'error')
        }
      });
    })
  },
  commentSend: function (e) {
    var that = this
    if (!e.detail.value || e.detail.value === '') {
      util.showToast('随便说点吧~', 'warn')
      return;
    }
    var comment = e.detail.value
    util.checkLogin(true, function () {
      var session = wx.getStorageSync('session')
      util.GET(app.globalData.host + '/CookBook/commentMenu', { session: session, menuId: that.data.menu.id, comment: comment }, function (res) {
        
        if (res && res.code == 1) {
          util.showToast('评论成功', 'success')
          var comments = that.data.comments
          var userinfo = wx.getStorageSync('userinfo')
          var addComments = { userName: userinfo.nickName, userAvatar: userinfo.avatarUrl, comment: comment, timeDesc: '刚刚' }
          comments.unshift(addComments)
          that.setData({ comments: comments, showInputBox: false, inputfocus: false })
        } else {
          util.showToast('评论失败', 'error')
        }
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var menuId = options.menuId   
    that.setData({ W: util.getSysInfo().windowWidth })
    var session = wx.getStorageSync('session')

    wx.showLoading({
      title: '加载中...',
    })

    util.GET(app.globalData.host + '/CookBook/listCookBookByMenuId', { session: session, menuId: menuId }, function (res) {
      if (res && res.code == 1) {
        var indexs = [];
        if (res.data.menus) {
          for (var index = 0; index < Math.round(res.data.menus.length / 2); index++) {
            indexs.push(index)
          }
        } 
        that.setData({ indexs: indexs, list: res.data.menus, menu: res.data.menu, admin: res.data.admin,user:res.data.user })
        setTimeout(function () {
          wx.setNavigationBarTitle({
            title: that.data.menu.menuName,
          })
        }, 300)
      }
      setTimeout(function () { wx.hideLoading() }, 300)
    })
    page = 1;
    util.GET(app.globalData.host + '/CookBook/listMenuComments', { page: page, num: num,menuId: menuId }, function (res) {
      if (res && res.code == 1) {
        that.setData({ comments: res.data.comments,favors:res.data.favors})
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
      var that = this
      var session = wx.getStorageSync('session')
      util.GET(app.globalData.host + '/CookBook/listCookBookByMenuId', { session: session, menuId: that.data.menu.id }, function (res) {
        if (res && res.code == 1) {
          var indexs = [];
          if (res.data.menus) {
            for (var index = 0; index < Math.round(res.data.menus.length / 2); index++) {
              indexs.push(index)
            }
          }
          that.setData({ indexs: indexs, list: res.data.menus, menu: res.data.menu, admin: res.data.admin, user: res.data.user })         
        }
       
      })
      page = 1;
      util.GET(app.globalData.host + '/CookBook/listMenuComments', { page: page, num: num, menuId: that.data.menu.id }, function (res) {
        if (res && res.code == 1) {
          that.setData({ comments: res.data.comments, favors: res.data.favors })
        }
      }) 
      that.setData({ nomorecomment: false })
      setTimeout(function () { wx.stopPullDownRefresh()}, 300)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this
    var menuId = that.data.menu.id
    if(that.data.nomorecomment==true){
      return ;
    }

    that.setData({ onloading:true})
    page = page+1;
    util.GET(app.globalData.host + '/CookBook/listMenuComments', { page: page, num: num, menuId: menuId }, function (res) {
      if (res && res.code == 1 && res.data && res.data.comments.length>0) {
        var comments = that.data.comments
        for (var i in res.data.comments){ 
          comments.push(res.data.comments[i])
        }
        that.setData({ comments: comments})
      }else{
        that.setData({ nomorecomment: true })
      }

      if (res && res.code == 1 && res.data && res.data.favors.length > 0) {
        var favors = that.data.favors 
        that.setData({ favors: favors })
      }
      that.setData({ onloading: false })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: '@所有人,这是我精心准备的菜单【' + that.data.menu.menuName + '】',
      path: '/pages/menu/detail?menuId=' + that.data.menu.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})