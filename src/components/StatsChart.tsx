import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface StatsChartProps {
    stats: { name: string; value: number }[];
}

const StatsChart: React.FC<StatsChartProps> = ({ stats }) => {
    return (
        <div className="bg-gray-800 text-white p-2 rounded-lg shadow-lg text-center border-2 h-96 border-gray-600 w-[800px]">
            <h2 className="text-xl font-bold mb-4">Stats</h2>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={stats}>
                    <XAxis dataKey="name" stroke="#ffffff" />
                    <YAxis stroke="#ffffff" />
                    <Bar dataKey="value" fill="#38bdf8" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatsChart;
