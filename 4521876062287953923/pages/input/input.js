Page({
  data: {
    time: '',
    intensity: '',
    symptom: '',
    weight: '',
    height: '',
    age: '',
    sex: '',
  },
  get_weight(e) {
    this.setData({ weight: e.detail.value });
  },

  get_height(e) {
    this.setData({ height: e.detail.value }) ;
  },

  get_age(e) {
    this.setData({ age: e.detail.value }) ;
  },

  get_sex(e) {
    this.setData({ sex: e.currentTarget.dataset.value });
  },

  onTimeInput(e) {
    this.setData({ time: e.detail.value });
  },

  selectIntensity(e) {
    this.setData({ intensity: e.currentTarget.dataset.value });
  },

  selectSymptom(e) {
    this.setData({ symptom: e.currentTarget.dataset.value });
  },

  calculate() {
    const { time, intensity, symptom, weight, height, age, sex } = this.data;
    
    // 验证输入

    if (!sex) {
      wx.showToast({
        title: '请选择性别',
        icon: 'none'
      });
      return;
    }

    const vol_height = parseInt(height);
    if (isNaN(vol_height) || vol_height < 100 || vol_height > 300) {
      wx.showToast({
        title: '请输入100~300之间的身高',
        icon: 'none'
      });
      return;
    }

    const vol_weight = parseInt(weight);
    if (isNaN(vol_weight) || vol_weight < 30 || vol_weight > 500) {
      wx.showToast({
        title: '请输入30~500之间的体重',
        icon: 'none'
      });
      return;
    }

    const vol_age = parseInt(age);
    if (isNaN(vol_age) || vol_age < 1 || vol_age > 150) {
      wx.showToast({
        title: '请输入1~150之间的年龄',
        icon: 'none'
      });
      return;
    }

    const timeNum = parseInt(time);
    if (isNaN(timeNum) || timeNum < 1 || timeNum > 500) {
      wx.showToast({
        title: '请输入1-500之间的时间',
        icon: 'none'
      });
      return;
    }

    if (!intensity) {
      wx.showToast({
        title: '请选择骑行强度',
        icon: 'none'
      });
      return;
    }
    
    if (!symptom) {
      wx.showToast({
        title: '请选择身体状态',
        icon: 'none'
      });
      return;
    }
    
    // 计算能量消耗
    let energy = 0;
    let basic_ene = 0;
    let riding_ene = 0;
    let met = 0;
    if (intensity === 'relax') met = 4;
    else if (intensity === 'low') met = 6;
    else if (intensity === 'medium') met = 8;
    else if (intensity === 'high') met = 10;
    else if (intensity === 'extreme') met = 12;
    else if (intensity === 'Vextreme') met = 15;

    if (sex === 'male') basic_ene = (10 * vol_weight + 6.25 * vol_height - 5 * vol_age + 5) / 24;
    else if (sex === 'female') basic_ene = (10 * vol_weight + 6.25 * vol_height - 5 * vol_age - 161) / 24;

    riding_ene = met * 3.5 * vol_weight / 1000 * 60 * 5.05;
    energy = timeNum / 60 * (riding_ene - basic_ene);
    energy = Math.round ( energy * 100 ) / 100 ;
    // 生成建议（按照PBL方案中的规则）
    let advice = '';
    let adviceEn = '';
    let riskLevel = '';
    
    if (symptom === 'yes') {
      advice = '⚠️ 立即停止骑行！请休息并告知老师或队医。';
      adviceEn = 'Stop riding, rest, and tell a teacher or doctor.';
      riskLevel = 'danger';
    } else if (energy >= 500 || timeNum >= 60) {
      advice = '🥤 需要补给！建议：能量棒 + 500ml水 + 短时休息15分钟';
      adviceEn = 'You need food, water, and a short rest.';
      riskLevel = 'warning';
    } else if (timeNum >= 60) {
      advice = '💧 建议补水，并注意观察身体状态';
      adviceEn = 'Drink water and monitor your body condition.';
      riskLevel = 'caution';
    } else {
      advice = '✅ 状态良好，可以继续骑行，请定期补水';
      adviceEn = 'You can continue, but drink water regularly.';
      riskLevel = 'safe';
    }
    
    // 存储到全局
    const app = getApp();
    app.globalData.userInput = { sex, vol_height, vol_weight, vol_age, timeNum, intensity, symptom };
    app.globalData.result = { energy, advice, adviceEn, riskLevel };
    
    // 跳转到结果页
    wx.navigateTo({
      url: '/pages/result/result'
    });
  }
});