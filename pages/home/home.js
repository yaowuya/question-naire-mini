// pages/home/home.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const http = require('../../utils/http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '',
    roleList: [],
    person: {
      doctorName: "",
      doctorNumber: "",
      patientName: "",
      patientNumber: ""
    },
    message: {
      doctorName: "",
      doctorNumber: "",
      patientName: "",
      patientNumber: ""
    },
    showDoctor: true
  },
  onChange(event) {
    this.setData({
      role: event.detail
    });
    if (event.detail === 'doctor') {
      this.setData({
        showDoctor: true
      });
    } else {
      this.setData({
        showDoctor: false
      });
    }
    for (let p of Object.keys(this.data.person)) {
      let message = 'message.' + p
      let person = 'person.' + p
      this.setData({
        [message]: '',
        [person]: ''
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRoleInfo()
  },
  getRoleInfo: async function() {
    wx.showLoading({
      title: '加载中',
    })
    let self = this
    try {
      const res = await app.$http.get('getAllRole', {})
      if (res.result) {
        this.setData({
          roleList: res.data,
          role: res.data[0].name
        })
      } else {
        Notify(res.message)
      }
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      Notify(JSON.stringify(e))
    }

    // wx.request({
    //   url: 'http://localhost:3000/mini/api/getAllRole',
    //   method: 'GET',
    //   data: {},
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     wx.hideLoading()
    //     if (res.data.result) {
    //       self.setData({
    //         roleList: res.data.data,
    //         role: res.data.data[0].name
    //       })
    //     } else {
    //       Notify(res.data.message)
    //     }

    //   },
    //   fail(res) {
    //     wx.hideLoading()
    //     Notify(JSON.stringify(res))
    //   }
    // })
  },
  myBlur(event) {
    // console.log(event)
    if (event.detail.value.trim().length === 0) {
      this.setData({
        [event.currentTarget.dataset.set]: '不能为空'
      })
    } else {
      this.setData({
        [event.currentTarget.dataset.set]: ''
      })
    }
    this.setData({
      [event.currentTarget.dataset.info]: event.detail.value
    })

  },
  submitPerson() {
    for (let p of Object.keys(this.data.person)) {
      if (this.data.person[p].trim().length === 0) {
        let message = 'message.' + p
        this.setData({
          [message]: '不能为空'
        })
        return
      }
    }
    console.log(this.data.person)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})