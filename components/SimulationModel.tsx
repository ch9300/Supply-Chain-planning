import React, { useState, useEffect, useCallback } from 'react';
import { SERVICE_LEVELS, PRODUCT_LIFECYCLES } from '../constants';

interface SimulationParams {
  historicalMonthlySales: number;
  productLifecycleFactor: number;
  marketActivityCoefficient: number;
  leadTime: number;
  serviceLevelZScore: number;
  demandStdDev: number;
}

interface SimulationResults {
  finalForecast: number;
  safetyStock: number;
  reorderPoint: number;
  recommendedStock: number;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl font-bold text-slate-700 border-b-2 border-slate-200 pb-3 mb-6">
      {children}
    </h2>
  );

const InputField: React.FC<{ label: string; id: string; children: React.ReactNode; number: string }> = ({ label, id, children, number }) => (
    <div>
        <label htmlFor={id} className="block mb-2 text-sm font-medium text-slate-600">
            <span className="text-blue-600 font-bold">{number}.</span> {label}
        </label>
        {children}
    </div>
);

const ResultDisplay: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-200">
        <span className="text-slate-500">{label}</span>
        <span className="text-2xl font-bold text-blue-600">
            {value}
            {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
        </span>
    </div>
);


const SimulationModel: React.FC = () => {
    const [params, setParams] = useState<SimulationParams>({
        historicalMonthlySales: 1000,
        productLifecycleFactor: 1.0,
        marketActivityCoefficient: 1.0,
        leadTime: 2,
        serviceLevelZScore: 1.65, // for 95%
        demandStdDev: 150,
    });

    const [results, setResults] = useState<SimulationResults>({
        finalForecast: 0,
        safetyStock: 0,
        reorderPoint: 0,
        recommendedStock: 0,
    });

    const calculateResults = useCallback(() => {
        const finalForecast = params.historicalMonthlySales * params.productLifecycleFactor * params.marketActivityCoefficient;
        const safetyStock = params.serviceLevelZScore * params.demandStdDev * Math.sqrt(params.leadTime);
        const reorderPoint = (finalForecast * params.leadTime) + safetyStock;
        const recommendedStock = (finalForecast * 3) + safetyStock;
    
        setResults({
            finalForecast: Math.round(finalForecast),
            safetyStock: Math.round(safetyStock),
            reorderPoint: Math.round(reorderPoint),
            recommendedStock: Math.round(recommendedStock),
        });
    }, [params]);

    useEffect(() => {
        calculateResults();
    }, [calculateResults]);

    const handleParamChange = (field: keyof SimulationParams, value: string) => {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
            setParams(prev => ({ ...prev, [field]: numValue }));
        }
    };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <SectionTitle>【战略模拟器】需求预测与库存策略模型</SectionTitle>
      <div className="grid md:grid-cols-2 md:gap-12">
        {/* Step 1: Inputs */}
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-600">第一步：输入业务条件</h3>
            
            <InputField label="历史月均销量 (台)" id="historicalMonthlySales" number="1">
                <div className="flex items-center space-x-4">
                    <input
                        id="historicalMonthlySales"
                        type="range"
                        min="100"
                        max="5000"
                        step="100"
                        value={params.historicalMonthlySales}
                        onChange={(e) => handleParamChange('historicalMonthlySales', e.target.value)}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <input 
                        type="number"
                        value={params.historicalMonthlySales}
                        onChange={(e) => handleParamChange('historicalMonthlySales', e.target.value)}
                        className="w-28 bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 text-center"
                    />
                </div>
            </InputField>

            <InputField label="产品生命周期" id="productLifecycleFactor" number="2">
                <select 
                    id="productLifecycleFactor"
                    value={params.productLifecycleFactor}
                    onChange={(e) => handleParamChange('productLifecycleFactor', e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    {PRODUCT_LIFECYCLES.map(p => <option key={p.label} value={p.factor}>{p.label}</option>)}
                </select>
                <p className="mt-2 text-xs text-slate-500">
                    <strong>说明：</strong>根据产品所处市场阶段调整销量预测。导入期增长缓慢，成长期快速放量，成熟期销量稳定，衰退期则逐渐下降。
                </p>
            </InputField>

            <InputField label="市场活动系数" id="marketActivityCoefficient" number="3">
                 <input 
                    type="number"
                    id="marketActivityCoefficient"
                    step="0.1"
                    value={params.marketActivityCoefficient}
                    onChange={(e) => handleParamChange('marketActivityCoefficient', e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </InputField>

            <InputField label="采购提前期 L (月)" id="leadTime" number="4">
                <input 
                    type="number"
                    id="leadTime"
                    min="0"
                    value={params.leadTime}
                    onChange={(e) => handleParamChange('leadTime', e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </InputField>

            <InputField label="期望服务水平 Z (防断货)" id="serviceLevelZScore" number="5">
                <select
                    id="serviceLevelZScore"
                    value={params.serviceLevelZScore}
                    onChange={(e) => handleParamChange('serviceLevelZScore', e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    {SERVICE_LEVELS.map(s => <option key={s.label} value={s.zScore}>{s.label}</option>)}
                </select>
            </InputField>

            <InputField label="需求波动标准差 σ" id="demandStdDev" number="6">
                <input 
                    type="number"
                    id="demandStdDev"
                    min="0"
                    value={params.demandStdDev}
                    onChange={(e) => handleParamChange('demandStdDev', e.target.value)}
                    className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
            </InputField>

        </div>
        {/* Step 2: Results */}
        <div className="mt-8 md:mt-0">
             <h3 className="text-lg font-semibold text-slate-600 mb-6">第二步：查看智能备货建议</h3>
             <div className="bg-slate-50 rounded-lg p-6 space-y-2">
                <ResultDisplay label="最终预测月销量" value={results.finalForecast.toLocaleString()} />
                <ResultDisplay label="安全库存 (SS)" value={results.safetyStock.toLocaleString()} />
                <ResultDisplay label="订货点 (ROP)" value={results.reorderPoint.toLocaleString()} />
                <ResultDisplay label="建议备货量 (3个月)" value={results.recommendedStock.toLocaleString()} />
             </div>
        </div>
      </div>
      <div className="mt-12 pt-6 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-600 mb-4">计算公式说明</h3>
        <div className="space-y-4 text-sm text-slate-600">
          <div>
            <p className="font-mono bg-slate-100 p-3 rounded-md text-slate-800">
              <strong>最终预测月销量</strong> = 历史月均销量 × 产品生命周期系数 × 市场活动系数
            </p>
            <p className="mt-1 pl-2 text-xs text-slate-500">
              <strong>说明：</strong>这是在历史数据的基础上，结合产品阶段和市场推广活动，对未来销量的基本预测。
            </p>
          </div>
          <div>
            <p className="font-mono bg-slate-100 p-3 rounded-md text-slate-800">
              <strong>安全库存 (SS)</strong> = Z × σ × √L
            </p>
            <p className="mt-1 pl-2 text-xs text-slate-500">
              <strong>说明：</strong>(Z: 服务水平, σ: 需求波动标准差, L: 采购提前期) 安全库存是为了防止因需求不确定性或供应延迟而导致的缺货风险而设定的缓冲库存。
            </p>
          </div>
          <div>
            <p className="font-mono bg-slate-100 p-3 rounded-md text-slate-800">
              <strong>订货点 (ROP)</strong> = (最终预测月销量 × L) + SS
            </p>
            <p className="mt-1 pl-2 text-xs text-slate-500">
              <strong>说明：</strong>当库存降低到此水平时，就需要下新的采购订单。它考虑了提前期内的平均需求量和安全库存。
            </p>
          </div>
          <div>
            <p className="font-mono bg-slate-100 p-3 rounded-md text-slate-800">
              <strong>建议备货量</strong> = (最终预测月销量 × 3) + SS
            </p>
            <p className="mt-1 pl-2 text-xs text-slate-500">
              <strong>说明：</strong>这是一个建议的总库存水平，旨在覆盖未来3个月的预测销量，同时保有安全库存以应对波动。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationModel;