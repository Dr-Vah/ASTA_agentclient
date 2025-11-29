import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Player } from '../types';

interface StatsChartProps {
    players: Player[];
}

const StatsChart: React.FC<StatsChartProps> = ({ players }) => {
    // Mock GPP data generation based on alive status + random for demo
    const data = players.map(p => ({
        name: `P${p.id}`,
        gpp: p.isAlive ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 10),
        isHuman: p.isHuman,
        role: p.role
    }));

    return (
        <div className="glass-panel p-4 rounded-xl h-full flex flex-col">
            <h3 className="font-mono text-sm font-bold text-cyber-accent mb-4">REAL-TIME GPP METRICS</h3>
            <div className="flex-1 w-full min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#94a3b8', fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="gpp" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.isHuman ? '#0ea5e9' : entry.role === 'WEREWOLF' ? '#ef4444' : '#64748b'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="text-[10px] text-gray-500 font-mono text-center mt-2">
                ESTIMATED PERFORMANCE POINTS (GPP)
            </div>
        </div>
    );
};

export default StatsChart;