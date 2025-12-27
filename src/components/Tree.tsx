import { useState, useEffect } from 'react';
import { useEntries, DIMENSIONS, Dimension } from './hooks/useEntries';

export function Tree() {
  const { 
    getDimensionStats, 
    getDaysSinceFirstRecord,
    isDimensionsRevealed,
    setDimensionsRevealed,
    shouldShowDimensionNames
  } = useEntries();
  const stats = getDimensionStats(30); // 过去30天
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null);
  const [showRevealModal, setShowRevealModal] = useState(false);

  // 检查是否需要显示揭示弹窗
  const daysSince = getDaysSinceFirstRecord();
  const showNames = shouldShowDimensionNames();

  // 使用useEffect检查是否需要显示揭示弹窗
  useEffect(() => {
    const needsReveal = daysSince >= 7 && !isDimensionsRevealed();
    if (needsReveal && !showRevealModal) {
      setShowRevealModal(true);
    }
  }, [daysSince, isDimensionsRevealed, showRevealModal]);

  const handleReveal = () => {
    setDimensionsRevealed();
    setShowRevealModal(false);
  };

  // 树枝角度分布（围绕中心，360度均匀分布）
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
    const mainLength = 80;
    const centerX = 200;
    const centerY = 200;
    const radians = (angle * Math.PI) / 180;
    const endX = centerX + mainLength * Math.cos(radians);
    const endY = centerY + mainLength * Math.sin(radians);
    
    // 计算子分叉数量（根据记录数，最多每侧6个）
    const branchCount = Math.min(Math.ceil(count / 2), 6);
    
    // 生成雪花状的子分叉
    const subBranches = [];
    for (let i = 1; i <= branchCount; i++) {
      const progress = i / (branchCount + 1); // 沿主分支的位置 (0.14, 0.28, 0.43...)
      const baseX = centerX + mainLength * progress * Math.cos(radians);
      const baseY = centerY + mainLength * progress * Math.sin(radians);
      
      // 子分叉长度随着远离中心逐渐变长
      const subLength = 15 + progress * 20;
      
      // 子分叉角度：左右对称，角度随层级递增
      const subAngleOffset = 35 + progress * 20; // 35度到55度
      
      // 左侧分叉
      const leftAngle = angle - subAngleOffset;
      const leftRadians = (leftAngle * Math.PI) / 180;
      const leftEndX = baseX + subLength * Math.cos(leftRadians);
      const leftEndY = baseY + subLength * Math.sin(leftRadians);
      
      // 右侧分叉
      const rightAngle = angle + subAngleOffset;
      const rightRadians = (rightAngle * Math.PI) / 180;
      const rightEndX = baseX + subLength * Math.cos(rightRadians);
      const rightEndY = baseY + subLength * Math.sin(rightRadians);
      
      const subStrokeWidth = mainStrokeWidth * 0.5;
      
      subBranches.push(
        // 左侧子分叉
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
        // 右侧子分叉
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
      
      // 活跃度高的维度，在部分子分叉末端添加小圆点
      if (activity > 0.5 && i % 2 === 0) {
        subBranches.push(
          <circle
            key={`${dimension}-left-dot-${i}`}
            cx={leftEndX}
            cy={leftEndY}
            r={2}
            fill={info.color}
            className="transition-all duration-300"
          />,
          <circle
            key={`${dimension}-right-dot-${i}`}
            cx={rightEndX}
            cy={rightEndY}
            r={2}
            fill={info.color}
            className="transition-all duration-300"
          />
        );
      }
    }
    
    return (
      <g
        key={dimension}
        onClick={() => setSelectedDimension(dimension)}
        className="cursor-pointer transition-all duration-300"
        style={{ opacity: selectedDimension === dimension ? 1 : opacity }}
      >
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
          r={activity === 0 ? 3 : 3 + activity * 3}
          fill={info.color}
          className="transition-all duration-300"
        />
        
        {/* 维度标签 */}
        <text
          x={centerX + (mainLength + 35) * Math.cos(radians)}
          y={centerY + (mainLength + 35) * Math.sin(radians)}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs fill-neutral-600 pointer-events-none select-none"
          style={{ opacity: activity === 0 ? 0.4 : 0.8 }}
        >
          {info.name}
        </text>
        
        {/* 数量标签 */}
        {count > 0 && (
          <text
            x={centerX + (mainLength + 68) * Math.cos(radians)}
            y={centerY + (mainLength + 68) * Math.sin(radians)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-[10px] fill-neutral-400 pointer-events-none select-none"
          >
            {count}
          </text>
        )}
      </g>
    );
  };

  return (
    <article className="h-full overflow-y-auto bg-blue-50/30">
      <div className="min-h-full flex flex-col">
      <header className="px-6 pt-16 pb-6">
        <h1 className="text-3xl text-neutral-900">来看看，</h1>
        <h1 className="text-3xl text-neutral-900">你生命的雪花。</h1>
        <p className="text-sm text-neutral-500 mt-2">过去30天的生命维度分布</p>
      </header>

      {/* SVG 树形可视化 */}
      <section className="flex-1 flex flex-col items-center justify-start px-6 pb-6" aria-label="生命之树">
        <div className="bg-white rounded-xl p-12 shadow-sm border border-neutral-100 w-full max-w-lg">
          <svg
            viewBox="40 40 320 320"
            className="w-full h-auto"
            style={{ maxHeight: '500px' }}
          >
            {/* 中心圆（树干） */}
            <circle
              cx="200"
              cy="200"
              r="20"
              fill="#78716c"
              className="transition-all duration-300"
            />
            
            {/* 八个树枝 */}
            {(Object.keys(DIMENSIONS) as Dimension[]).map(renderBranch)}
          </svg>

          {/* 提示文字 */}
          {stats.totalEntries === 0 ? (
            <p className="text-center text-neutral-400 text-sm mt-4">
              开始记录，让生命之树生长
            </p>
          ) : (
            <p className="text-center text-neutral-500 text-sm mt-4">
              点击树枝查看详情
            </p>
          )}
        </div>

        {/* 选中维度的详情卡片 */}
        {selectedDimension && (
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-neutral-100 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
            <header className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: DIMENSIONS[selectedDimension].color }}
                />
                <h2 className="text-lg text-neutral-900">{DIMENSIONS[selectedDimension].name}</h2>
              </div>
              <button
                onClick={() => setSelectedDimension(null)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label="关闭"
              >
                ✕
              </button>
            </header>

            <dl className="space-y-2">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-500">记录次数</dt>
                <dd className="text-lg text-neutral-900">{stats.counts[selectedDimension]}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-neutral-500">活跃度</dt>
                <dd className="text-lg text-neutral-900">
                  {Math.round(stats.activity[selectedDimension] * 100)}%
                </dd>
              </div>
            </dl>

            {stats.counts[selectedDimension] === 0 && (
              <p className="text-xs text-neutral-400 mt-4 italic">
                这个维度暂时休眠了
              </p>
            )}
          </div>
        )}

        {/* 图例说明 */}
        <div className="mt-6 bg-neutral-100 rounded-lg p-4 w-full max-w-md">
          <h3 className="text-xs text-neutral-500 mb-3">图例说明</h3>
          <ul className="space-y-1.5 text-xs text-neutral-600">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              <span>雪花状分叉越多，说明该维度记录越频繁</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              <span>树枝颜色和粗细代表该维度的活跃程度</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              <span>数字表示过去30天的记录次数</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-neutral-400" />
              <span>暗淡的树枝表示该维度正在休眠</span>
            </li>
          </ul>
        </div>

      </section>
      </div>

      {/* 揭示弹窗 */}
      {showRevealModal && (
        <aside 
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reveal-heading"
        >
          <article className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-sm w-full shadow-xl border border-white/20">
            <header className="mb-6 text-center">
              <div className="mb-4 text-5xl">🌸</div>
              <h2 id="reveal-heading" className="text-2xl text-neutral-900 mb-3">
                第 {daysSince} 天
              </h2>
              <p className="text-neutral-600 leading-relaxed">
                你的生活主要出现在这些方向，<br/>
                我们为它们起了名字。
              </p>
            </header>
            <button
              onClick={handleReveal}
              className="w-full py-3 bg-neutral-900 text-white rounded-lg transition-all hover:bg-neutral-800 active:scale-95"
            >
              看看它们叫什么
            </button>
          </article>
        </aside>
      )}
    </article>
  );
}