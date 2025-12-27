import { useState } from 'react';
import { useEntries, countWords, matchDimensions, DIMENSIONS, Dimension } from './hooks/useEntries';
import { PlusIcon, Calendar, Tag, Pencil, Trash2, X, Check } from 'lucide-react';

export function Home() {
  const { getTodayEntries, addEntry, shouldShowDimensionNames, deleteEntry, updateEntry, updateEntryDimensions } = useEntries();
  const todayEntries = getTodayEntries();
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editingDimensionsId, setEditingDimensionsId] = useState<string | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);

  const showNames = shouldShowDimensionNames();

  // 实时显示当前输入的维度预测
  const predictedDimensions = content.trim() ? matchDimensions(content) : [];

  // 快捷选项
  const quickOptions = [
    { label: '今天很平常', text: '今天很平常，没什么特别的' },
    { label: '有点乱', text: '今天有点乱' },
    { label: '不想说', text: '不想说' }
  ];

  const handleQuickOption = (text: string) => {
    setContent(text);
  };

  const handleSubmit = () => {
    if (content.trim()) {
      addEntry(content, selectedDate || undefined);
      setContent('');
      setSelectedDate('');
      setShowDatePicker(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  // 获取今天的日期字符串（YYYY-MM-DD）
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // 格式化日期显示
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '今天';
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(year, month - 1, day);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays === 2) return '前天';
    return `${month}月${day}日`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditContent(content);
  };

  const handleSaveEdit = (id: string) => {
    if (editContent.trim()) {
      updateEntry(id, editContent);
    }
    setEditingId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id: string, content: string) => {
    const confirmText = content.length > 20 ? content.substring(0, 20) + '...' : content;
    if (confirm(`确定要删除这条记录吗？\n\n"${confirmText}"`)) {
      deleteEntry(id);
    }
  };

  const handleStartEditDimensions = (id: string, currentDimensions: string[] | undefined) => {
    setEditingDimensionsId(id);
    setSelectedDimensions((currentDimensions || []) as Dimension[]);
  };

  const handleToggleDimension = (dimension: Dimension) => {
    setSelectedDimensions(prev => 
      prev.includes(dimension) 
        ? prev.filter(d => d !== dimension)
        : [...prev, dimension]
    );
  };

  const handleSaveDimensions = (id: string) => {
    updateEntryDimensions(id, selectedDimensions);
    setEditingDimensionsId(null);
    setSelectedDimensions([]);
  };

  const handleCancelEditDimensions = () => {
    setEditingDimensionsId(null);
    setSelectedDimensions([]);
  };

  return (
    <article className="h-full flex flex-col bg-blue-50/30">
      <header className="px-6 pt-16 pb-6">
        <h1 className="text-3xl text-neutral-900">今天，</h1>
        <h1 className="text-3xl text-neutral-900">发生了什么？</h1>
      </header>

      {/* Input Area */}
      <section className="flex-1 px-6 pb-2 overflow-y-auto">
        <form className="bg-white rounded-2xl shadow-sm flex flex-col p-6 border border-neutral-100" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="在这里写下此刻的想法..."
            className="resize-none border-none outline-none text-neutral-700 placeholder-neutral-300 min-h-[120px]"
            aria-label="今日记录"
          />
          
          {/* 实时维度预测 */}
          {predictedDimensions.length > 0 && (
            <div className="mt-3 mb-1">
              <p className="text-xs text-neutral-400 mb-2">
                {showNames ? '系统识别到的维度：' : '系统识别到的方向：'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {predictedDimensions.map(dim => (
                  <span
                    key={dim}
                    className={`inline-flex items-center gap-1 rounded-md text-xs ${
                      showNames ? 'px-2 py-1' : 'p-1'
                    }`}
                    style={{ 
                      backgroundColor: `${DIMENSIONS[dim].color}15`,
                      color: DIMENSIONS[dim].color
                    }}
                  >
                    <span 
                      className="rounded-full" 
                      style={{ 
                        backgroundColor: DIMENSIONS[dim].color,
                        width: showNames ? '6px' : '12px',
                        height: showNames ? '6px' : '12px'
                      }} 
                    />
                    {showNames && DIMENSIONS[dim].name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <footer className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3">
              {/* 日期选择按钮 */}
              <button
                type="button"
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                  selectedDate 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600'
                }`}
                aria-label="选择日期"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDateDisplay(selectedDate)}</span>
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 bg-neutral-900 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-neutral-800 active:scale-95 flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>添加</span>
            </button>
          </footer>

          {/* 日期选择器 */}
          {showDatePicker && (
            <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-500 mb-2">选择日期：</p>
              <input
                type="date"
                value={selectedDate || getTodayString()}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={getTodayString()}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate('');
                    setShowDatePicker(false);
                  }}
                  className="px-3 py-1 text-xs text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  重置为今天
                </button>
                <button
                  type="button"
                  onClick={() => setShowDatePicker(false)}
                  className="px-3 py-1 text-xs bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  确定
                </button>
              </div>
            </div>
          )}
          
          {isSaved && (
            <output className="mt-2 text-center text-sm text-neutral-500" role="status">
              已保存 ✓
            </output>
          )}
        </form>

        {/* 快捷选项 */}
        <div className="mt-4">
          <h2 className="text-sm text-neutral-500 mb-3 px-1">快捷选项</h2>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map(option => (
              <button
                key={option.label}
                className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-md hover:bg-neutral-200 transition-all"
                onClick={() => handleQuickOption(option.text)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 今日记录列表 */}
        {todayEntries.length > 0 && (
          <section className="mt-4" aria-label="今日已记录">
            <h2 className="text-sm text-neutral-500 mb-3 px-1">今日记录</h2>
            <ul className="space-y-2">
              {todayEntries.map(entry => (
                <li key={entry.id} className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 group">
                  {editingId === entry.id ? (
                    // 编辑模式
                    <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-white border border-neutral-300 rounded-lg px-3 py-2 text-sm text-neutral-900 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-400"
                        rows={3}
                        autoFocus
                      />
                      <div className="flex items-center justify-end gap-2 mt-2">
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          aria-label="取消编辑"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>取消</span>
                        </button>
                        <button
                          onClick={() => handleSaveEdit(entry.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-neutral-800 hover:bg-neutral-900 rounded-lg transition-colors"
                          aria-label="保存修改"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>保存</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <header className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <time className="text-xs text-neutral-400" dateTime={entry.createdAt}>
                            {formatTime(entry.createdAt)}
                          </time>
                          {/* 显示维度圆点 */}
                          {editingDimensionsId !== entry.id && (
                            <div className="flex flex-wrap gap-1">
                              {entry.dimensions && entry.dimensions.length > 0 ? (
                                entry.dimensions.map(dim => (
                                  <span
                                    key={dim}
                                    className="inline-flex items-center justify-center p-0.5"
                                  >
                                    <span 
                                      className="rounded-full" 
                                      style={{ 
                                        backgroundColor: DIMENSIONS[dim].color,
                                        width: '6px',
                                        height: '6px'
                                      }} 
                                    />
                                  </span>
                                ))
                              ) : (
                                <span className="inline-flex items-center justify-center p-0.5">
                                  <span 
                                    className="rounded-full bg-neutral-300" 
                                    style={{ 
                                      width: '6px',
                                      height: '6px'
                                    }} 
                                  />
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEditDimensions(entry.id, entry.dimensions)}
                            className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="编辑维度标签"
                          >
                            <Tag className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleStartEdit(entry.id, entry.content)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                            aria-label="编辑记录"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id, entry.content)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="删除记录"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </header>
                      <p className="text-sm text-neutral-600 mb-2">{entry.content}</p>
                      
                      {/* 维度编辑模式 */}
                      {editingDimensionsId === entry.id && (
                        <div className="bg-neutral-50 rounded-lg p-3 border border-blue-200 mt-3">
                          <p className="text-xs text-neutral-600 mb-2">
                            选择此记录的维度（可多选）：
                          </p>
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {Object.values(DIMENSIONS).map(dim => {
                              const isSelected = selectedDimensions.includes(dim.id);
                              return (
                                <button
                                  key={dim.id}
                                  onClick={() => handleToggleDimension(dim.id)}
                                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-left ${
                                    isSelected 
                                      ? 'border-current shadow-sm' 
                                      : 'border-neutral-200 hover:border-neutral-300'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected ? `${dim.color}15` : 'white',
                                    color: isSelected ? dim.color : '#737373'
                                  }}
                                >
                                  <span 
                                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                                      isSelected ? 'border-current' : 'border-neutral-300'
                                    }`}
                                    style={{ backgroundColor: isSelected ? dim.color : 'transparent' }}
                                  >
                                    {isSelected && (
                                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                    )}
                                  </span>
                                  <span className="text-xs">{dim.name}</span>
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={handleCancelEditDimensions}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                              aria-label="取消"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>取消</span>
                            </button>
                            <button
                              onClick={() => handleSaveDimensions(entry.id)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                              aria-label="保存"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>保存</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </article>
  );
}