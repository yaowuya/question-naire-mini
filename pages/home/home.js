// pages/home/home.js
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '',
    roleList: [],
    qtList:[],
    questionType:'',
    person: {
      doctorName: "",
      doctorNumber: "",
      patientName: "",
      patientNumber: "",
      patientTime: "zero"
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
    // console.log(event)
    this.setData({
      role: event.detail.name
    });
    if (event.detail.name === 'doctor') {
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
    this.setData({
      'person.patientTime': this.data.questionType,
    })
  },
  onChangeTime(event) {
    // console.log(event)
    this.setData({
      'person.patientTime': event.detail,
    })
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
    try {
      const res = await app.$http.get('getAllRole', {})
      if (res.result) {
        this.setData({
          roleList: res.data.roleList,
          role: res.data.roleList[0].name,
          qtList:res.data.qtList,
          questionType: res.data.qtList[0].name,
        })
      } else {
        Notify(res.message)
      }
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      Notify(JSON.stringify(e))
    }
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
  async submitPerson() {
    for (let p of Object.keys(this.data.person)) {
      if (this.data.role === 'doctor') {
        if (this.data.person[p].trim().length === 0) {
          let message = 'message.' + p
          this.setData({
            [message]: '不能为空'
          })
          return
        }
      } else {
        if (p.indexOf('patient') >= 0) {
          if (this.data.person[p].trim().length === 0) {
            let message = 'message.' + p
            this.setData({
              [message]: '不能为空'
            })
            return
          }
        }
      }
    }
    // console.log(this.data.person)
    wx.showLoading({
      title: '加载中',
    })
    try {
      const res = await app.$http.post('addPerson', {
        person:this.data.person,
        role:this.data.role
      })
      wx.hideLoading()
      if (res.result) {
        const personId=res.data.person
        const questionType=res.data.questionType
        wx.navigateTo({
          url: `../question/question?personId=${personId}&questionType=${questionType}`
        });
      } else {
        Notify(res.message)
      }
    } catch (e) {
      wx.hideLoading()
      Notify(JSON.stringify(e))
    }
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