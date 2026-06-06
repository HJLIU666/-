App({
  globalData: {
    // 存储用户输入的数据
    userInput: {
      time: null,
      intensity: '',
      symptom: ''
    },
    // 存储计算结果
    result: {
      energy: 0,
      advice: '',
      adviceEn: '',
      riskLevel: ''
    }
  }
});