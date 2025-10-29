// For SimulationModel
export const SERVICE_LEVELS = [
  { label: '85%', zScore: 1.04 },
  { label: '90%', zScore: 1.28 },
  { label: '95%', zScore: 1.65 },
  { label: '97%', zScore: 1.88 },
  { label: '98%', zScore: 2.05 },
  { label: '99%', zScore: 2.33 },
];

export const PRODUCT_LIFECYCLES = [
  { label: '导入期 (x0.5)', factor: 0.5 },
  { label: '成长期 (x1.5)', factor: 1.5 },
  { label: '成熟期 (x1.0)', factor: 1.0 },
  { label: '衰退期 (x0.7)', factor: 0.7 },
];

// For WarRoomDashboard
export const RECOMMENDED_ACTIONS = ['消耗完毕后切换', '立即切换', '加速消耗'];
export const IN_TRANSIT_HANDLINGS = ['在途切换为新料', '在途正常入库'];
