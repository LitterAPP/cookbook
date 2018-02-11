// pages/test/ayouch.js
const util = require('../../util/util.js')
const app = getApp()
var onclicking = false
var A = -1, B = -2, C = -3, D = -4
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentNum: 0,
    currentReply: -1,
    list: [
      { num: 0, pic: '', title: '每逢约会,必选择美食地点', answer: ['是', '否'], yes: 1, no: 2 },
      { num: 1, pic: '', title: '聚会时，点菜这个光荣的任务总是我完成', answer: ['是', '否'], yes: 3, no: 5 },
      { num: 2, pic: '', title: '以虔诚的态度享用美食', answer: ['是', '否'], yes: 4, no: 6 },
      { num: 3, pic: '', title: '和不太熟悉的人在一起的时候怎么办？吃！啊！', answer: ['是', '否'], yes: 5, no: 6 },
      { num: 4, pic: '', title: '吃占了日常花销的70%', answer: ['是', '否'], yes: 7, no: 9 },
      { num: 5, pic: '', title: '看到想吃的总会全部买下来', answer: ['是', '否'], yes: 7, no: 9 },
      { num: 6, pic: '', title: '计划够吃一整个礼拜的零食，往往一夜就吃光了', answer: ['是', '否'], yes: 9, no: 8 },
      { num: 7, pic: '', title: '超市常见的零食都吃过吗？', answer: ['是', '否'], yes: 8, no: 10 },
      { num: 8, pic: '', title: '自己发过的朋友圈美食，大部分都是自己吃过的', answer: ['是', '否'], yes: 11, no: 14 },
      { num: 9, pic: '', title: '睡前总是会一遍遍纠结还要不要再来个宵夜', answer: ['是', '否'], yes: 12, no: 13 },
      { num: 10, pic: '', title: '每天早上叫醒我的不是闹铃，而是肚子', answer: ['是', '否'], yes: 14, no: 13 },
      { num: 11, pic: '', title: '小时候盼望过节就是因为有好吃的', answer: ['是', '否'], yes: 14, no: 15 },
      { num: 12, pic: '', title: '学生时代因为上课偷吃东西被老师惩罚过', answer: ['是', '否'], yes: 17, no: 18 },
      { num: 13, pic: '', title: '用吃来发泄难过、愤怒、无聊、开心的情绪', answer: ['是', '否'], yes: 19, no: 15 },
      { num: 14, pic: '', title: '找男/女朋友第一条件就是要会做饭', answer: ['是', '否'], yes: 18, no: 16 },
      { num: 15, pic: '', title: '愿意为了一样小吃美食穿越半个城市', answer: ['是', '否'], yes: 18, no: 19 },
      { num: 16, pic: '', title: '不管是路边小摊还是高档酒店，都有自己心仪的菜品', answer: ['是', '否'], yes: 19, no: 18 },
      { num: 17, pic: '', title: '你觉得自己厨艺一级棒吗？', answer: ['是', '否'], yes: 18, no: 19 },
      { num: 18, pic: '', title: '能把泡面吃出十一种花样来', answer: ['是', '否'], yes: B, no: D },
      { num: 19, pic: '', title: '看到没见过的东西，第一反应就是“能吃吗？”', answer: ['是', '否'], yes: A, no: C }
    ],
    result: [
      { pic: '', content: '骨灰级吃货，吃货指数五颗星！哇哦！你果真是个超级吃货呢！你对吃如此执着的精神感动了全宇宙人民，送你一句座右铭：Just eat it！' },
      { pic: '', content: '高级吃货，吃货指数四颗星！矮油！就算有很多选项都是否，可你还是个重症吃货呢！能把泡面吃出那么多种花样，骚年，我看好你哟！' },
      { pic: '', content: '中级吃货，吃货指数三颗星！还好啦，再接再厉！知道什么是吃货匹克精神吗？吃的更多，吃的更饱，吃的更好！' },
      { pic: '', content: '入门级吃货，吃货指数一颗星！恭喜你！指数级别这么低，一定有完美的身材吧？！不过，唯美景与美食不可辜负也，下次再有好吃的，好吃你就多吃点，不好吃多少也吃点！' }
    ]

  },
  yes: function () {
    var that = this
    var currentNum = that.data.currentNum
    this.setData({ currentReply: 1 })
    if (onclicking || currentNum < 0) return
    onclicking = true
    setTimeout(function () {
      var nextNum = that.data.list[currentNum].yes
      that.setData({ currentNum: nextNum, currentReply: -1 })
      if (nextNum < 0) {
        //console.log('yes,nextNum', nextNum)
        //console.log('测试结果：', that.data.result[nextNum * -1 - 1].content)
        var userinfo = wx.getStorageSync('userinfo')
        var defat = (Math.random() * 100).toFixed(2);
        that.setData({ userinfo: userinfo, defat: defat })
        return
      }
      onclicking = false
    }, 200)
  },
  no: function () {
    var that = this
    this.setData({ currentReply: 0 })
    var currentNum = that.data.currentNum
    if (onclicking || currentNum < 0) return
    onclicking = true
    setTimeout(function () {
      var nextNum = that.data.list[currentNum].no 
      that.setData({ currentNum: nextNum, currentReply: -1 })
      if (nextNum < 0) {
        //console.log('测试结果：', that.data.result[nextNum * -1 - 1].content)
        var userinfo = wx.getStorageSync('userinfo')
        var defat = (Math.random() * 100).toFixed(2);
        that.setData({ userinfo: userinfo, defat: defat})
        return
      }
      onclicking = false
    }, 200)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    onclicking=false
    this.setData({ W: util.getSysInfo().windowWidth })
    util.checkLogin('', function () { 

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