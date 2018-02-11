// pages/shopmng/product.js
import Upload from '../../util/upload.js'
const util = require('../../util/util.js')

const app = getApp()

let session
let postData = {
  title: '',
  productType:0,
  store: null,
  p_category_id: '',
  sub_category_id: '',
  attrs_1: '',/*attr_1.id*/
  attrs_2: '',
  attrs_3: '',
  play_pics: [],/*[{isLocal:true,localUrl:'',remoteUrl:'',osskey:''}] idx排位*/
  banner_pic: '',/**{isLocal:true,localUrl:'',remoteUrl:'',osskey:''} */
  price: [null, null],/*原价，折后价*/
  join_together: true,
  together_info: {},/**join_together为true时有  {price:66,number:2,hour:1,vcount:45323}*/
  groups: [{}],
  contact_mobile: '',
  contact_wx: '',
  text_details: [],/**文字详情 */
  pic_details: [],/**图文详情 [{isLocal:true,localUrl:'',remoteUrl:'',osskey:''}]*/
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    togetherinfoshow: true,
    attrSourceUrl: app.globalData.host + '/ShopMng/attrSource',
    categoryFirSourceUrl: app.globalData.host + '/ShopMng/categoryFirSource',
    categorySecSourceUrl: app.globalData.host + '/ShopMng/categorySecSource',
    produtTypeUrl: app.globalData.host + '/ShopMng/listSource?type=1'
    
  },
  bindProductTypeChange:function(e){     
    postData.productType = e.detail.id
  },
  bindProductTypeSelected: function (e) {
    this.setData({ productTypeValue: e.detail.id })
    postData.productType = e.detail.id
  },
  togetherSwitch: function (e) {
    this.setData({ togetherinfoshow: e.detail.value })
    postData.join_together = e.detail.value
  },

  tagSelectedFir: function (e) {
    postData.attrs_1 = e.detail.id
  },
  tagSelectedSec: function (e) {
     postData.attrs_2 = e.detail.id
  },
  tagSelectedThir: function (e) {
     postData.attrs_3 = e.detail.id
  },
  bannerChanged: function (e) { 
    postData.banner_pic = e.detail
  },
  categorySelectedFir: function (e) {
    postData.p_category_id = e.detail.id
  },
  categorySelectedSec: function (e) {
    postData.sub_category_id = e.detail.id
  },
  groupChanged: function (e) { 
    postData.groups = e.detail
  },
  productDetailChanged: function (e) {
    postData.text_details = e.detail
  },
  productDetailPicsChanged: function (e) {
    let idx = e.currentTarget.dataset.productpicindex
    if(e.detail){
      postData.pic_details.splice(idx, 1, e.detail) 
    }else{
      postData.pic_details.splice(idx, 1) 
    }
    console.log('productDetailPicsChanged',idx,e.detail)
     
  },
  productPlayPicsChanged: function (e) {
    let idx = e.currentTarget.dataset.productpicindex
    if (e.detail) {
      postData.play_pics.splice(idx, 1, e.detail)
    } else {
      postData.play_pics.splice(idx, 1)
    }  
  },

  productFormSumbit: function (e) {
    var uploadUrl = app.globalData.host + '/Upload/uploadFile'
    postData.productType = this.data.productTypeValue
    postData.store = e.detail.value.store || 1
    var title = e.detail.value.title
    if (!title || title.length == 0) {
      util.showToast('商品标题不能为空', 'error')
      return
    }
    postData.title = title
    if (!postData.p_category_id) {
      util.showToast('请选择一级分类', 'error')
      return
    }
     
    if (!postData.sub_category_id) {
      util.showToast('请选择二级分类', 'error')
      return
    } 

    if (!postData.play_pics || postData.play_pics.length < 1) {
      util.showToast('至少一张轮播图', 'error')
      return
    }
    if (!postData.banner_pic || postData.banner_pic.lenght == 0) {
      util.showToast('请选择横幅', 'error')
      return
    }
    var originPrice = e.detail.value.originPrice
    if (!originPrice || originPrice.length == 0) {
      util.showToast('商品原价为空', 'error')
      return
    }
    postData.price[0] = originPrice
    //如果不输入折扣价，默认等于原价
    var discountPrice = e.detail.value.discountPrice
    if (!discountPrice || discountPrice.length == 0) {
      discountPrice = originPrice
    }
    postData.price[1] = discountPrice

    var togetherSwitch = e.detail.value.togetherSwitch
    var togetherPrice = e.detail.value.togetherPrice
    var togetherNumber = e.detail.value.togetherNumber
    var togetherHours = e.detail.value.togetherHours
    var togetherVcount = e.detail.value.togetherVcount
    postData.join_together = togetherSwitch
    if (togetherSwitch) {
      var togetherInfo = { price: 0, num: 0, hour: 0, vcount: 0 }
      if (!togetherPrice || togetherPrice.length == 0) {
        util.showToast('团购价为空', 'error')
        return
      }
      togetherInfo.price = togetherPrice
      if (!togetherNumber || togetherNumber.length == 0) {
        util.showToast('团购人数为空', 'error')
        return
      }
      togetherInfo.num = togetherNumber
      if (!togetherHours || togetherHours.length == 0) {
        util.showToast('团购时长空', 'error')
        return
      }
      togetherInfo.hour = togetherHours
      if (!togetherVcount || togetherVcount > 0) {
        togetherInfo.vcount = togetherVcount
      }

      postData.together_info = togetherInfo
    }

    if (!postData.groups || postData.groups.length == 0) {
      util.showToast('商品规格为空', 'error')
      return
    }

    for (let i in postData.groups) {
      let g = postData.groups[i]
      console.log('g-->', g)
      if (!g.title || g.title.length == 0) {
        util.showToast('规格标题为空', 'error')
        return
      }
      if (!g.price1 || g.price1.length == 0) {
        util.showToast('规格单价错误', 'error')
        return
      }
      if (!g.price2 || g.price2.length == 0) {
        g['price2'] = g.price1
      }
      if (!g.logo || g.logo.length == 0) {
        util.showToast('规格Logo错误', 'error')
        return
      }
    } 

    var sellerMobile = e.detail.value.sellerMobile
    if (sellerMobile && sellerMobile.length > 0) {
      postData.contact_mobile = sellerMobile
    }

    var sellerWx = e.detail.value.sellerWx
    if (sellerWx && sellerWx.length > 0) {
      postData.contact_wx = sellerWx
    }
 

    /**开始提交数据到后端服务 */
    /**先提交groups中的logo图片*/
    /**上传图片，提交数据 */    
    util.showToast('保存中...', 'info')
    var groupLogoFiles = []
    for (let i in postData.groups) {
      groupLogoFiles.push(postData.groups[i].logo)
    }
    let groupLogoFilesTask = new Upload(groupLogoFiles)
    groupLogoFilesTask.upload(uploadUrl, function (keys0) {
      /**添加object key */
      for (let i in postData.groups) {
        if (keys0[i]) {
          postData.groups[i]['osskey'] = keys0[i]
        } else {/**删除无效数据 */ 
          postData.groups.splice(i, 1)
        } 
      }
      /**上传Banner图片，提交数据 */
      let bannerTask = new Upload([postData.banner_pic.localUrl])
      bannerTask.upload(uploadUrl, function (keys1) {
        postData.banner_pic['osskey'] = keys1[0] 
        /**上传轮播图片 */
        var playPics=[]       
        for (let j in postData.play_pics){
          playPics.push(postData.play_pics[j].localUrl || '')
        }
        let productPlayPicsTask = new Upload(playPics)
        productPlayPicsTask.upload(uploadUrl, function (keys2) {
          for (let k in keys2){           
            if (keys2[k]) {
              postData.play_pics[k]['osskey'] = keys2[k]
            } else {/**删除无效数据 */
              postData.play_pics.splice(k, 1)
            }  
          }  
             
          /**上传图文详情图片 */
          var detailPics = []
          for(let l in postData.pic_details){
            detailPics.push(postData.pic_details[l].localUrl)
          }
          let productDetailPicsTask = new Upload(detailPics,'uploadDetails')
          productDetailPicsTask.upload(uploadUrl, function (keys3) {            
            for (let m in keys3) {
              if (keys3[m]){
                postData.pic_details[m]['osskey'] = keys3[m]
              }else{/**删除无效数据 */
                postData.pic_details.splice(m,1)
              }              
            } 
            console.log('提交的图片详情', detailPics, keys3)
            /**提交数据 */
            console.log('sumbit form data', postData)
            var postDataStr = JSON.stringify(postData);
            var encodePostData = encodeURIComponent(postDataStr)
            util.POST(app.globalData.host + '/ShopMng/saveProduct',
              {
                session: wx.getStorageSync('session'),
                productInfo: encodePostData
              },
              function (res) {
                wx.hideLoading()
                if (res && res.code == 1) {
                  //跳转预览
                  console.log('跳转预览', res.data.productId)                  
                  wx.redirectTo({
                    url: '/pages/shop/detail?productId='+res.data.productId+'&isPreview=1',
                  })
                } else if (res && res.code == -1 && res.msg) {
                  util.showToast(res.msg, 'error')
                } else {
                  util.showToast('操作失败', 'error')
                }
              })
          })
        })        
      })
    }) 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var productId = options.productId
    util.showToast('加载中...','info')
    util.checkLogin(false, function () {       
      if (productId){
        util.GET(app.globalData.host + '/ShopMng/findProduct', { session: wx.getStorageSync('session'), productId: productId}, function (res) {
          if (res && res.code == 1) {  
            postData = res.data
            that.setData({ componetns: 1, postData: res.data})
          }
          wx.hideLoading()
        })
      }else{
        that.setData({ componetns: 1, postData: postData})
      }
      that.setData({
        W: wx.getSystemInfoSync().windowWidth, showpage: true
      })
      session = wx.getStorageSync('session')
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