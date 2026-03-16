/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Cpu, Info, Table, Zap, Ruler, Activity, Layers, Share2 } from 'lucide-react';

interface MetalData {
  metal: string;
  current_density: number;
  sheet_resistance: number;
}

const METAL_DATA: MetalData[] = [
  { metal: "MET1", current_density: 0.82, sheet_resistance: 119 },
  { metal: "MET2", current_density: 0.82, sheet_resistance: 115 },
  { metal: "MET3", current_density: 0.82, sheet_resistance: 115 },
  { metal: "MET4", current_density: 0.82, sheet_resistance: 115 },
  { metal: "MET5", current_density: 0.82, sheet_resistance: 115 },
  { metal: "METTP", current_density: 1.31, sheet_resistance: 46.8 },
  { metal: "METTPL", current_density: 4.92, sheet_resistance: 16.25 },
];

export default function App() {
  const [selectedMetal, setSelectedMetal] = useState<string>(METAL_DATA[0].metal);
  const [width, setWidth] = useState<string>("1");
  const [length, setLength] = useState<string>("10");

  // Network Resistance States
  const [seriesResistors, setSeriesResistors] = useState<string[]>(Array(8).fill(""));
  const [parallelResistors, setParallelResistors] = useState<string[]>(Array(8).fill(""));

  const currentMetal = useMemo(() => 
    METAL_DATA.find(m => m.metal === selectedMetal) || METAL_DATA[0]
  , [selectedMetal]);

  const currentCapacity = useMemo(() => {
    const w = parseFloat(width) || 0;
    return w * currentMetal.current_density;
  }, [width, currentMetal]);

  const impedance = useMemo(() => {
    const w = parseFloat(width) || 0;
    const l = parseFloat(length) || 0;
    if (w === 0) return 0;
    return (l / w) * (currentMetal.sheet_resistance / 1000);
  }, [length, width, currentMetal]);

  // Network Calculations
  const totalSeries = useMemo(() => {
    return seriesResistors
      .map(r => parseFloat(r))
      .filter(r => !isNaN(r))
      .reduce((acc, curr) => acc + curr, 0);
  }, [seriesResistors]);

  const totalParallel = useMemo(() => {
    const validResistors = parallelResistors
      .map(r => parseFloat(r))
      .filter(r => !isNaN(r) && r > 0);
    
    if (validResistors.length === 0) return 0;
    
    const sumInverse = validResistors.reduce((acc, curr) => acc + (1 / curr), 0);
    return 1 / sumInverse;
  }, [parallelResistors]);

  const handleSeriesChange = (index: number, value: string) => {
    const newResistors = [...seriesResistors];
    newResistors[index] = value;
    setSeriesResistors(newResistors);
  };

  const handleParallelChange = (index: number, value: string) => {
    const newResistors = [...parallelResistors];
    newResistors[index] = value;
    setParallelResistors(newResistors);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight uppercase flex items-center gap-2">
              <Cpu className="w-8 h-8 text-emerald-600" />
              EPICAL LAYOUTS
            </h1>
            <p className="text-sm text-black/60 font-medium uppercase tracking-widest mt-1">
              Innovation in Every Design
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-black/5 flex items-center gap-3">
            <Activity className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-mono font-bold uppercase tracking-tighter">Impedance Calculator</span>
          </div>
        </header>

        {/* Reference Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/40">
            <Table className="w-4 h-4" />
            Metal Technology Reference Data
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Density Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              <div className="bg-[#1a1a1a] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                Current Density Table
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-black/5">
                    <th className="px-4 py-2 text-[10px] uppercase font-bold text-black/40">Metal</th>
                    <th className="px-4 py-2 text-[10px] uppercase font-bold text-black/40">Density (mA/µm)</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {METAL_DATA.map((m) => (
                    <tr key={m.metal} className={`border-b border-black/5 hover:bg-emerald-50 transition-colors ${selectedMetal === m.metal ? 'bg-emerald-50/50' : ''}`}>
                      <td className="px-4 py-2 font-bold">{m.metal}</td>
                      <td className="px-4 py-2">{m.current_density.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sheet Resistance Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
              <div className="bg-[#1a1a1a] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest">
                Sheet Resistance Table
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 bg-black/5">
                    <th className="px-4 py-2 text-[10px] uppercase font-bold text-black/40">Metal</th>
                    <th className="px-4 py-2 text-[10px] uppercase font-bold text-black/40">Resistance (mΩ/Sq)</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {METAL_DATA.map((m) => (
                    <tr key={m.metal} className={`border-b border-black/5 hover:bg-emerald-50 transition-colors ${selectedMetal === m.metal ? 'bg-emerald-50/50' : ''}`}>
                      <td className="px-4 py-2 font-bold">{m.metal}</td>
                      <td className="px-4 py-2">{m.sheet_resistance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Main Calculator Section */}
        <section className="bg-white rounded-3xl shadow-md border border-black/5 p-6 md:p-8 space-y-8">
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/40 border-b border-black/5 pb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            Metal Routing Calculator
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Inputs */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 ml-1">Metal Type</label>
                <select 
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  className="w-full bg-[#f9f9f9] border border-black/10 rounded-xl px-4 py-3 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
                >
                  {METAL_DATA.map(m => (
                    <option key={m.metal} value={m.metal}>{m.metal}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 ml-1 flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Width (µm)
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter width..."
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-black/10 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/50 ml-1 flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Length (µm)
                  </label>
                  <input 
                    type="text"
                    placeholder="Enter length..."
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-black/10 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                  Calculate Capacity
                </button>
                <button className="bg-[#1a1a1a] hover:bg-black text-white text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl transition-all shadow-lg shadow-black/20 active:scale-95">
                  Calculate Impedance
                </button>
              </div>
            </div>

            {/* Outputs */}
            <div className="bg-[#f9f9f9] rounded-2xl p-6 border border-black/5 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-black/5 shadow-sm">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-1">Current Density</div>
                  <div className="text-lg font-mono font-bold text-emerald-600">{currentMetal.current_density.toFixed(2)} <span className="text-[10px] text-black/40">mA/µm</span></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-black/5 shadow-sm">
                  <div className="text-[9px] font-bold uppercase tracking-widest text-black/40 mb-1">Sheet Resistance</div>
                  <div className="text-lg font-mono font-bold text-emerald-600">{currentMetal.sheet_resistance.toFixed(2)} <span className="text-[10px] text-black/40">mΩ/Sq</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-emerald-600 p-6 rounded-2xl shadow-xl shadow-emerald-600/10 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Current Capacity (mA)</div>
                  <div className="text-4xl font-mono font-bold tracking-tighter">
                    {currentCapacity.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-xl shadow-black/10 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Routing Metal Impedance (Ω)</div>
                  <div className="text-4xl font-mono font-bold tracking-tighter">
                    {impedance.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Network Resistance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Series Calculator */}
          <section className="bg-white rounded-3xl shadow-md border border-black/5 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/40">
                <Layers className="w-4 h-4 text-blue-500" />
                Series Resistance
              </div>
              <div className="text-xs font-mono font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded">R1 + R2 + ...</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {seriesResistors.map((val, idx) => (
                <div key={`series-${idx}`} className="space-y-1">
                  <label className="text-[8px] font-bold uppercase tracking-widest text-black/30 ml-1">R{idx + 1} (Ω)</label>
                  <input 
                    type="text"
                    placeholder="---"
                    value={val}
                    onChange={(e) => handleSeriesChange(idx, e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-black/10 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="bg-blue-600 p-4 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Series Resistance (Ω)</div>
              <div className="text-2xl font-mono font-bold tracking-tighter">
                {totalSeries.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
            </div>
          </section>

          {/* Parallel Calculator */}
          <section className="bg-white rounded-3xl shadow-md border border-black/5 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-black/40">
                <Share2 className="w-4 h-4 text-purple-500" />
                Parallel Resistance
              </div>
              <div className="text-xs font-mono font-bold bg-purple-50 text-purple-600 px-2 py-1 rounded">1 / (Σ 1/Ri)</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {parallelResistors.map((val, idx) => (
                <div key={`parallel-${idx}`} className="space-y-1">
                  <label className="text-[8px] font-bold uppercase tracking-widest text-black/30 ml-1">R{idx + 1} (Ω)</label>
                  <input 
                    type="text"
                    placeholder="---"
                    value={val}
                    onChange={(e) => handleParallelChange(idx, e.target.value)}
                    className="w-full bg-[#f9f9f9] border border-black/10 rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="bg-purple-600 p-4 rounded-xl text-white shadow-lg shadow-purple-600/20">
              <div className="text-[9px] font-bold uppercase tracking-widest opacity-70 mb-1">Total Parallel Resistance (Ω)</div>
              <div className="text-2xl font-mono font-bold tracking-tighter">
                {totalParallel.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
            </div>
          </section>
        </div>

        {/* Footer Info */}
        <footer className="bg-white/50 rounded-2xl p-4 border border-black/5 flex items-start gap-3">
          <Info className="w-5 h-5 text-black/20 mt-0.5" />
          <div className="text-[10px] text-black/40 leading-relaxed uppercase tracking-wider">
            <p className="font-bold mb-1">Calculation Logic:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <p>• Current Capacity = Width * Current Density</p>
                <p>• Routing Impedance = (Length / Width) * (Sheet Resistance / 1000)</p>
              </div>
              <div>
                <p>• Series R = R1 + R2 + ... + R8</p>
                <p>• Parallel R = 1 / (1/R1 + 1/R2 + ... + 1/R8)</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
