Page({
  data: {
    energy: 0,
    advice: '',
    adviceEn: '',
    riskLevel: '',
    riskText: '',
    showNutrition: false,
    nutritionItems: []
  },

  onLoad() {
    const app = getApp();
    const result = app.globalData.result;
    const userInput = app.globalData.userInput;
    
    // 设置风险等级文本
    let riskText = '';
    if (result.riskLevel === 'danger') riskText = '⚠️ 危险 - 立即休息 Dangerous - need to rest immediately';
    else if (result.riskLevel === 'warning') riskText = '⚠️ 警告 - 需要补给 Warning - need supply';
    else if (result.riskLevel === 'caution') riskText = '💧 注意 - 建议补水 Notice - need water';
    else riskText = '✅ 安全 - 状态良好 Safe - feeling good';
    
    // 根据建议显示营养补给项
    let showNutrition = false;
    let nutritionItems = [];
    
    if (result.riskLevel === 'warning') {
      showNutrition = true;
      nutritionItems = [
        { icon: '🍚', name: '碳水化合物', amount: '能量棒 x1~2' },
        { icon: '  ', name: 'carbohydrate', amount: 'energy bar x1~2' },
        { icon: '💧', name: '水分', amount: '500ml ~ 1000ml' },
        { icon: '  ', name: 'water', amount: '500ml ~ 1000ml' },
        { icon: '🧂', name: '电解质', amount: '运动饮料或盐丸' },
        { icon: '  ', name: 'electrolyte', amount: 'sports drink or salt ball' }
      ];
    } else if (result.riskLevel === 'caution') {
      showNutrition = true;
      nutritionItems = [
        { icon: '💧', name: '水分', amount: '300ml - 500ml' },
        { icon: '  ', name: 'water', amount: '300ml ~ 500ml' }
      ];
    }
    
    this.setData({
      energy: result.energy,
      advice: result.advice,
      adviceEn: result.adviceEn,
      riskLevel: result.riskLevel,
      riskText: riskText,
      showNutrition: showNutrition,
      nutritionItems: nutritionItems
    });
  },
  
  recalculate() {
    wx.navigateBack();
  },
  
  goToTips() {
    wx.navigateTo({
      url: '/pages/tips/tips'
    });
  }
});