// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: [
      { id: 1, value: '家用电器'},
      { id: 2, value: '手机' },
      { id: 3, value: '电脑', selected: true},
      { id: 4, value: '家居' },
      { id: 5, value: '男装' },
      { id: 6, value: '美妆个护' },
      { id: 7, value: '食品' },
      { id: 8, value: '母婴' },
      { id: 9, value: '医药保健' },
      { id: 10, value: '礼品鲜花' },
      { id: 11, value: '图书' },
      { id: 12, value: '机票' },
      { id: 13, value: '房产汽车' },
      { id: 14, value: '房产/电脑/汽车' },
      { id: 15, value: '房产/电脑/发动机/汽车' }
    ],
    inputs: [{ value: '' }]
  },
  itemCanged:function(e){
    console.log('dynamic iput changed.',e.detail)
  },
  groupChanged:function(e){
    console.log('dynamic group changed.', e.detail)
  },
  submmitform:function(e){
    console.log('submit',e.detail)
  },
  deleteBanner:function(e){     
    console.log(e.detail )
  }, 
  uploadBanner:function(e){
    console.log('uploadBanner',e.detail)
  },
  itemSelected:function(e){
    console.log('selected',e.detail)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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