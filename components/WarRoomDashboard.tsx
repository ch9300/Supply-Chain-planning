import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { RECOMMENDED_ACTIONS, IN_TRANSIT_HANDLINGS } from '../constants';

const initialInventory: InventoryItem[] = [
  { sku: '201-10800-000', currentStock: 431, inTransit: 1630, avgMonthlyConsumption: 144 },
  { sku: '201-10800-002', currentStock: 236, inTransit: 581, avgMonthlyConsumption: 118 },
  { sku: '201-15050-000', currentStock: 1572, inTransit: 388, avgMonthlyConsumption: 157 },
];

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-bold text-slate-700 border-b-2 border-slate-200 pb-3 mb-6">
    {children}
  </h2>
);

const RiskBadge: React.FC<{ risk: 'HIGH' | 'LOW' }> = ({ risk }) => {
  const isHigh = risk === 'HIGH';
  const bgColor = isHigh ? 'bg-red-100' : 'bg-green-100';
  const textColor = isHigh ? 'text-red-700' : 'text-green-700';
  const dotColor = isHigh ? 'bg-red-500' : 'bg-green-500';
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${bgColor} ${textColor}`}>
      <span className={`w-2 h-2 mr-2 rounded-full ${dotColor}`}></span>
      {risk}
    </span>
  );
};

const WarRoomDashboard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  const handleConsumptionChange = (sku: string, value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setInventory(prev =>
        prev.map(item =>
          item.sku === sku ? { ...item, avgMonthlyConsumption: numValue } : item
        )
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <SectionTitle>【战术仪表盘】现有呆滞库存处理模拟</SectionTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-600">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              <th scope="col" className="px-4 py-3">料号 (SKU)</th>
              <th scope="col" className="px-4 py-3">当前库存</th>
              <th scope="col" className="px-4 py-3">在途数量</th>
              <th scope="col" className="px-4 py-3">月均消耗 (模拟)</th>
              <th scope="col" className="px-4 py-3" title="计算公式: (当前库存 + 在途数量) / 月均消耗">预计消耗月数</th>
              <th scope="col" className="px-4 py-3">建议措施</th>
              <th scope="col" className="px-4 py-3">在途物料处理</th>
              <th scope="col" className="px-4 py-3">呆滞风险</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const totalStock = item.currentStock + item.inTransit;
              const monthsOfConsumption = item.avgMonthlyConsumption > 0 ? totalStock / item.avgMonthlyConsumption : Infinity;
              const risk = monthsOfConsumption > 10 ? 'HIGH' : 'LOW';

              return (
                <tr key={item.sku} className="bg-white border-b hover:bg-slate-50">
                  <td className="px-4 py-4 font-medium text-slate-900 whitespace-nowrap">{item.sku}</td>
                  <td className="px-4 py-4">{item.currentStock.toLocaleString()}</td>
                  <td className="px-4 py-4">{item.inTransit.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={item.avgMonthlyConsumption}
                      onChange={(e) => handleConsumptionChange(item.sku, e.target.value)}
                      className="w-24 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 text-center"
                    />
                  </td>
                  <td className="px-4 py-4 font-semibold">{monthsOfConsumption === Infinity ? 'N/A' : monthsOfConsumption.toFixed(1)}</td>
                   <td className="px-4 py-4">
                    <select className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                      {RECOMMENDED_ACTIONS.map(action => <option key={action}>{action}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                     <select className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2">
                       {IN_TRANSIT_HANDLINGS.map(action => <option key={action}>{action}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <RiskBadge risk={risk} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarRoomDashboard;