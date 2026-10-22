import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type BarChartDataItem = { name: string; value: number }

export default function SimpleBarChart({ data }: { data: BarChartDataItem[] }) {
  return <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 10, right: 8, left: -26, bottom: 4 }} barSize={27}><CartesianGrid stroke="#e5e9e2" strokeDasharray="3 6" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} tick={{fontSize: 11, fill:'#727f76'}} tickFormatter={value => String(value).length > 11 ? `${String(value).slice(0,10)}…` : value}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fontSize: 11, fill:'#88948a'}}/><Tooltip cursor={{ fill: '#f0f4eb' }} contentStyle={{background:'#20332c',color:'#f9fbf7',border:'none',borderRadius:10,fontSize:12}} labelStyle={{color:'#fff'}} itemStyle={{color:'#d9f298'}}/><Bar name="Employees" dataKey="value" fill="#789b79" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer></div>
}
