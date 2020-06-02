import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
const app = getApp()
// pages/question/question.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    personId: '',
    questionType: 'doctor-zero',
    question: {},
    titleList: [],
    role: 'doctor',
    showBtn: false,
    picture: app.globalData.host + 'images/shenjing.png',
    btnText: '下一步',
    questionId: '',
    success: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      personId: options.personId,
      questionType: options.questionType,
      role: options.role,
      success: false
    })
    if (options.role === 'doctor') {
      this.setData({
        btnText: '下一步',
        questionId: 'doctor1'
      })
    } else {
      if (options.questionType === 'first-visit') {
        this.setData({
          btnText: '下一步',
          questionId: 'patient0'
        })
      } else if (options.questionType === 'one-week') {
        this.setData({
          btnText: '下一步',
          questionId: 'patient1'
        })
      } else {
        this.setData({
          btnText: '提 交',
          questionId: 'patient4'
        })
      }
    }

    this.getQuestionInfo()
  },
  async getQuestionInfo() {
    wx.showLoading({
      title: '加载中',
    })
    try {
      const res = await app.$http.get('getQuestionInfo', {
        questionId: this.data.questionId
      })
      if (res.result) {
        // console.log(res);
        const resultList = []
        res.data.titleList.forEach(title => {
          resultList.push({
            _id: title._id,
            name: title.name,
            order: title.order,
            topicType: title.topic.name,
            option: title.option,
            answer: title.answer,
            content: title.topic.name.trim() == "multiple" ? [] : ''
          })
        })
        this.setData({
          question: res.data.question,
          titleList: resultList,
          showBtn: true
        })
        // console.log(resultList);
      } else {
        Notify(res.message)
      }
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      Notify(JSON.stringify(e))
    }
  },
  clickRadio(event) {
    const { index, optionid } = event.currentTarget.dataset
    let titleContent = "titleList[" + index + "].content"
    this.setData({
      [titleContent]: optionid
    })
    // console.log(index, optionid)
  },
  changeCheckbox(event) {
    const { index } = event.currentTarget.dataset
    let titleContent = "titleList[" + index + "].content"
    this.setData({
      [titleContent]: event.detail
    });
    // console.log(event)
  },
  noop() { },
  clickCheckbox(event) {
    const { idx } = event.currentTarget.dataset
    const checkbox = this.selectComponent(`.checkboxes-${idx}`);
    checkbox.toggle();
    // console.log(idx)
  },
  textBlur(event) {
    const { index } = event.currentTarget.dataset
    let titleContent = "titleList[" + index + "].content"
    this.setData({
      [titleContent]: event.detail.value
    })
    // console.log(event)
  },
  async submitTitle() {
    if (!this.validate()) {
      return
    }
    if (['doctor2', 'patient3', 'patient4'].includes(this.data.questionId)) {
      this.setData({
        success: true
      })
    }
    if (this.data.role === 'doctor') {
      this.setData({
        btnText: '提 交',
        questionId: 'doctor2'
      })
      await this.submitData()
      await this.getQuestionInfo()
    } else {
      if (this.data.questionId === 'patient0' || this.data.questionId === 'patient1') {
        this.setData({
          btnText: '下一步',
          questionId: 'patient2'
        })
      } else if (this.data.questionId === 'patient2') {
        this.setData({
          btnText: '提 交',
          questionId: 'patient3'
        })
      }
      await this.submitData()
      await this.getQuestionInfo()
    }
  },
  async submitData() {
    wx.showLoading({
      title: '提交',
    })
    try {
      const res = await app.$http.post('addAnswer', {
        titleList: this.data.titleList,
        personId: this.data.personId,
        questionId: this.data.question._id,
        questionType: this.data.questionType
      })
      if (res.result) {
        Notify({ type: 'success', message: '提交成功' });
        if (this.data.success) {
          wx.navigateTo({
            url: `../success/success`
          });
        }
      } else {
        Notify(res.message)
      }
      wx.hideLoading()
    } catch (e) {
      wx.hideLoading()
      Notify(JSON.stringify(e))
    }
  },
  validate() {
    let flag = false
    let order = 1
    this.data.titleList.forEach(title => {
      if (title.content == '' || title.content == []) {
        flag = true
        order = title.order
        return
      }
    })
    if (flag) {
      Notify(`第${order}题为空,请选择！`)
      return false
    } else {
      return true
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