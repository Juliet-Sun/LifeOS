import { useState } from 'react';
import { useEntries, DIMENSIONS, Dimension } from './hooks/useEntries';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function WeeklyReview() {
  const { getDimensionStatsByDateRange } = useEntries();
  const [weekOffset, setWeekOffset] = useState(0); // 0=本周，-1=上周，-2=上上周

  // 计算指定周的日期范围
  const getWeekRange = (offset: number) => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    
    // 计算本周一
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    thisMonday.setHours(0, 0, 0, 0);
    
    // 根据offset计算目标周的周一
    const targetMonday = new Date(thisMonday);
    targetMonday.setDate(thisMonday.getDate() + offset * 7);
    
    // 计算周日
    const targetSunday = new Date(targetMonday);
    targetSunday.setDate(targetMonday.getDate() + 6);
    targetSunday.setHours(23, 59, 59, 999);
    
    return { monday: targetMonday, sunday: targetSunday };
  };

  // 判断一周是否已经结束
  const isWeekComplete = (offset: number) => {
    const now = new Date();
    const { sunday } = getWeekRange(offset);
    return now > sunday;
  };

  // 格式化日期范围显示
  const formatWeekRange = (offset: number) => {
    const { monday, sunday } = getWeekRange(offset);
    const formatDate = (date: Date) => {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    };
    return `${formatDate(monday)} - ${formatDate(sunday)}`;
  };

  // 获取周标题
  const getWeekTitle = (offset: number) => {
    if (offset === 0) {
      return isWeekComplete(0) ? '上周的生命之树' : '本周生长中';
    } else if (offset === -1) {
      return '上上周的生命之树';
    } else if (offset === -2) {
      return '三周前的生命之树';
    } else {
      return `${Math.abs(offset)}周前的生命之树`;
    }
  };

  // 获取当前显示周的统计数据
  const { monday, sunday } = getWeekRange(weekOffset);
  const stats = getDimensionStatsByDateRange(monday, sunday);
  const weekComplete = isWeekComplete(weekOffset);

  // 树枝角度分布
  const branchAngles: Record<Dimension, number> = {
    career: -90,      // 正上 - 职业发展
    finance: -45,     // 右上 - 财务状况
    health: 0,        // 正右 - 健康
    leisure: 45,      // 右下 - 娱乐休闲
    family: 90,       // 正下 - 家庭
    social: 135,      // 左下 - 朋友与重要他人
    growth: 180,      // 正左 - 个人成长
    fulfillment: -135, // 左上 - 自我实现
  };

  const renderBranch = (dimension: Dimension) => {
    const info = DIMENSIONS[dimension];
    const activity = stats.activity[dimension];
    const count = stats.counts[dimension];
    const angle = branchAngles[dimension];
    
    // 活跃度决定颜色透明度
    const opacity = activity === 0 ? 0.15 : 0.3 + activity * 0.7;
    const mainStrokeWidth = activity === 0 ? 2 : 3 + activity * 3;
    
    // 计算主分支终点坐标
    const mainLength = 70;
    const centerX = 180;
    const centerY = 180;
    const radians = (angle * Math.PI) / 180;
    const endX = centerX + mainLength * Math.cos(radians);
    const endY = centerY + mainLength * Math.sin(radians);
    
    // 计算子分叉数量（根据记录数，最多每侧6个）
    const branchCount = Math.min(Math.ceil(count / 2), 6);
    
    // 生成雪花状的子分叉
    const subBranches = [];
    for (let i = 1; i <= branchCount; i++) {
      const progress = i / (branchCount + 1);
      const baseX = centerX + mainLength * progress * Math.cos(radians);
      const baseY = centerY + mainLength * progress * Math.sin(radians);
      
      const subLength = 12 + progress * 18;
      const subAngleOffset = 35 + progress * 20;
      
      const leftAngle = angle - subAngleOffset;
      const leftRadians = (leftAngle * Math.PI) / 180;
      const leftEndX = baseX + subLength * Math.cos(leftRadians);
      const leftEndY = baseY + subLength * Math.sin(leftRadians);
      
      const rightAngle = angle + subAngleOffset;
      const rightRadians = (rightAngle * Math.PI) / 180;
      const rightEndX = baseX + subLength * Math.cos(rightRadians);
      const rightEndY = baseY + subLength * Math.sin(rightRadians);
      
      const subStrokeWidth = mainStrokeWidth * 0.5;
      
      subBranches.push(
        <line
          key={`${dimension}-left-${i}`}
          x1={baseX}
          y1={baseY}
          x2={leftEndX}
          y2={leftEndY}
          stroke={info.color}
          strokeWidth={subStrokeWidth}
          strokeLinecap="round"
          className="transition-all duration-300"
        />,
        <line
          key={`${dimension}-right-${i}`}
          x1={baseX}
          y1={baseY}
          x2={rightEndX}
          y2={rightEndY}
          stroke={info.color}
          strokeWidth={subStrokeWidth}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      );
      
      if (activity > 0.5 && i % 2 === 0) {
        subBranches.push(
          <circle
            key={`${dimension}-left-dot-${i}`}
            cx={leftEndX}
            cy={leftEndY}
            r={1.5}
            fill={info.color}
            className="transition-all duration-300"
          />,
          <circle
            key={`${dimension}-right-dot-${i}`}
            cx={rightEndX}
            cy={rightEndY}
            r={1.5}
            fill={info.color}
            className="transition-all duration-300"
          />
        );
      }
    }
    
    return (
      <g key={dimension} style={{ opacity }}>
        {/* 主分支 */}
        <line
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke={info.color}
          strokeWidth={mainStrokeWidth}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
        
        {/* 雪花状子分叉 */}
        {subBranches}
        
        {/* 主分支末端圆点 */}
        <circle
          cx={endX}
          cy={endY}
          r={activity === 0 ? 2.5 : 2.5 + activity * 2.5}
          fill={info.color}
          className="transition-all duration-300"
        />
        
        {/* 维度标签（缩小字体） */}
        <text
          x={centerX + (mainLength + 30) * Math.cos(radians)}
          y={centerY + (mainLength + 30) * Math.sin(radians)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px] fill-neutral-600 pointer-events-none select-none"
          style={{ opacity: activity === 0 ? 0.4 : 0.8 }}
        >
          {info.name}
        </text>
        
        {/* 数量标签 */}
        {count > 0 && (
          <text
            x={centerX + (mainLength + 55) * Math.cos(radians)}
            y={centerY + (mainLength + 55) * Math.sin(radians)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[9px] fill-neutral-400 pointer-events-none select-none"
          >
            {count}
          </text>
        )}
      </g>
    );
  };

  return (
    <article className="h-full flex flex-col bg-blue-50/30">
      <header className="px-6 pt-16 pb-6">
        <h1 className="text-3xl text-neutral-900">{getWeekTitle(weekOffset)}</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-neutral-500">{formatWeekRange(weekOffset)}</p>
          {!weekComplete && weekOffset === 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              生长中 🌱
            </span>
          )}
        </div>
      </header>

      {/* 周切换导航 */}
      <section className="px-6 pb-4" aria-label="周选择">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors"
            aria-label="上一周"
          >
            <ChevronLeft className="w-5 h-5 text-neutral-600" />
          </button>
          
          <span className="text-sm text-neutral-600 min-w-[100px] text-center">
            {weekOffset === 0 && '本周'}
            {weekOffset === -1 && '上周'}
            {weekOffset === -2 && '上上周'}
            {weekOffset < -2 && `${Math.abs(weekOffset)}周前`}
          </span>
          
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            disabled={weekOffset >= 0}
            className="p-2 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="下一周"
          >
            <ChevronRight className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </section>

      {/* 生命之树可视化 */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 pb-6" aria-label="生命之树">
        <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 w-full max-w-lg">
          <svg
            viewBox="30 30 300 300"
            className="w-full h-auto"
            style={{ maxHeight: '450px' }}
          >
            {/* 中心圆 */}
            <circle
              cx="180"
              cy="180"
              r="18"
              fill="#78716c"
              className="transition-all duration-300"
            />
            
            {/* 八个树枝 */}
            {(Object.keys(DIMENSIONS) as Dimension[]).map(renderBranch)}
          </svg>

          {/* 提示文字 */}
          {stats.totalEntries === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-4">
              {weekOffset === 0 
                ? '这一周你没有留下记录，但时间仍在推进你的生活。' 
                : '那一周你没有留下记录，但时间仍在推进你的生活。'}
            </p>
          ) : (
            <div className="text-center mt-4">
              <p className="text-sm text-neutral-500">
                共 <span className="text-neutral-900">{stats.totalEntries}</span> 条记录
              </p>
            </div>
          )}
        </div>

        {/* 状态说明 */}
        <div className="mt-6 bg-white rounded-lg p-4 w-full max-w-md border border-neutral-100">
          <h3 className="text-xs text-neutral-500 mb-2">
            {weekComplete ? '📸 生命之树快照' : '🌱 本周生长进度'}
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {weekComplete 
              ? '这是那一周结束时的生命之树状态，记录了你那段时间的生活轨迹。'
              : '这是你本周的生命之树，每天都在生长变化。'}
          </p>
        </div>

        {/* 维度图例 */}
        <div className="mt-4 bg-neutral-100 rounded-lg p-4 w-full max-w-md">
          <h3 className="text-xs text-neutral-500 mb-3">维度色彩</h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(DIMENSIONS) as [Dimension, typeof DIMENSIONS[Dimension]][]).map(([id, info]) => (
              <div key={id} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-xs text-neutral-600">{info.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}