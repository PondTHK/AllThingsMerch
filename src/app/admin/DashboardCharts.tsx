'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatTHB } from '@/lib/money';

export interface OrderChartDataDto {
  month: string;
  revenue: number;
  orders: number;
}

export interface StockChartDataDto {
  name: string;
  stock: number;
}

interface DashboardChartsProps {
  revenueData: OrderChartDataDto[];
  stockData: StockChartDataDto[];
}

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function CustomTooltipRevenue({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-neutral-200 rounded-xl px-4 py-3 shadow-lg text-xs">
      <p className="font-bold text-black mb-1">{label}</p>
      <p className="text-neutral-600">Revenue: <span className="font-bold text-black">{formatTHB(payload[0]?.value || 0)}</span></p>
      <p className="text-neutral-600">Orders: <span className="font-bold text-black">{payload[1]?.value || 0}</span></p>
    </div>
  );
}

export function DashboardCharts({ revenueData, stockData }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Revenue Bar Chart */}
      <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-neutral-200 space-y-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-black">Monthly Revenue Trend</h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Revenue from fulfilled orders by month</p>
        </div>
        {revenueData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-neutral-400">
            No order data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: '#737373' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltipRevenue />} />
              <Bar dataKey="revenue" fill="#0f172a" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Orders" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Stock Distribution Pie */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3">
        <div>
          <h3 className="text-xs font-black uppercase tracking-wider text-black">Top SKU Stock Split</h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Stock distribution across top variants</p>
        </div>
        {stockData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-xs text-neutral-400">
            No stock data available yet.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="35%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
                dataKey="stock"
                nameKey="name"
              >
                {stockData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`${Number(value)} units`]}
                contentStyle={{ fontSize: 11, borderRadius: 12, border: '1px solid #e5e5e5' }}
              />
              <Legend
                content={(props: any) => {
                  const { payload } = props;
                  return (
                    <ul className="grid grid-cols-2 gap-x-2 gap-y-1 mt-4 text-[10px] text-neutral-600 px-2">
                      {payload.map((entry: any, index: number) => (
                        <li key={`item-${index}`} className="flex items-center gap-1.5 overflow-hidden">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="truncate">{entry.value}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
