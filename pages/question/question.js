import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const app = getApp()
// pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personId: '',
    questionType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      personId: options.personId,
      questionType: options.questionType
    })
    this.getQuestionInfo()
  },
  getQuestionInfo: async function () {
    wx.showLoading({
      title: '加载中',
    })
    try {
      const res = await app.$http.get('getQuestionInfo', {
        questionType: this.data.questionType
      })
      if (res.result) {
        console.log(res);
      } else {
        Notify(res.message)
      }
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      Notify(JSON.stringify(e))
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