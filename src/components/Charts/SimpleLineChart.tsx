import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type LineChartDataItem = Record<string, string | number>
type SimpleLineChartProps = { data: LineChartDataItem[]; xDataKey: string; yDataKey: string }

export default function SimpleLineChart({ data, xDataKey, yDataKey }: SimpleLineChartProps) {
  return <div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{top:10,right:8,left:-20,bottom:4}}><defs><linearGradient id="payrollShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a5b2a2" stopOpacity={0.45}/><stop offset="100%" stopColor="#a5b2a2" stopOpacity={0.03}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#e5e9e2" strokeDasharray="3 6"/><XAxis dataKey={xDataKey} axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#727f76'}}/><YAxis axisLine={false} tickLine={false} tick={{fontSize:11,fill:'#88948a'}} tickFormatter={(v:number)=>`${Math.round(v/1000)}k`}/><Tooltip contentStyle={{background:'#20332c',color:'#fff',border:'none',borderRadius:10,fontSize:12}} labelStyle={{color:'#fff'}} itemStyle={{color:'#d9f298'}}/><Area type="monotone" name="Payroll" dataKey={yDataKey} stroke="#4d806c" strokeWidth={2.5} fill="url(#payrollShade)" activeDot={{r:5,fill:'#4d806c',stroke:'#fff',strokeWidth:2}}/></AreaChart></ResponsiveContainer></div>
}
