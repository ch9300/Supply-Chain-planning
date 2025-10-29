import React from 'react';
import WarRoomDashboard from './components/WarRoomDashboard';
import SimulationModel from './components/SimulationModel';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-700">
            供应链需求预测与库存管理模拟器
          </h1>
          <p className="text-slate-500 mt-2">
            An interactive tool for supply chain planning and optimization.
          </p>
        </header>
        
        <div className="space-y-8">
          <WarRoomDashboard />
          <SimulationModel />
        </div>
      </main>
    </div>
  );
};

export default App;
