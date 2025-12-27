import { useEntries, DIMENSIONS, Dimension } from './hooks/useEntries';
import { useState } from 'react';
import { Pencil, Trash2, X, Check, Tag } from 'lucide-react';

export function History() {
  const { 
    getEntriesByDate, 
    getTotalStats, 
    deleteEntry, 
    updateEntry, 
    updateEntryDimensions,
    shouldShowDimensionNames 
  } = useEntries();
  const entriesByDate = getEntriesByDate();
  const stats = getTotalStats();
  const showNames = shouldShowDimensionNames();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editingDimensionsId, setEditingDimensionsId] = useState<string | null>(null);
  const [selectedDimensions, setSelectedDimensions] = useState<Dimension[]>([]);

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

  const formatDate = (dateStr: string) => {
    // 解析为本地时间而不是UTC时间
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const weekday = weekdays[date.getDay()];
    return { date: `${month}月${day}日`, weekday };
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <article className="h-full flex flex-col bg-blue-50/30">
      <header className="px-6 pt-16 pb-6">
        <h1 className="text-3xl text-neutral-900">这些，</h1>
        <h1 className="text-3xl text-neutral-900">已经发生过了。</h1>
      </header>

      {/* Stats */}
      <section className="px-6 pb-4" aria-label="统计数据">
        <dl className="bg-white rounded-xl p-4 shadow-sm border border-neutral-100 flex justify-around">
          <div className="text-center">
            <dt className="text-xs text-neutral-500 mb-1">记录天数</dt>
            <dd className="text-2xl text-neutral-900">{stats.totalDays}</dd>
          </div>
          <div className="w-px bg-neutral-200" role="separator"></div>
          <div className="text-center">
            <dt className="text-xs text-neutral-500 mb-1">总条目</dt>
            <dd className="text-2xl text-neutral-900">{stats.totalEntries}</dd>
          </div>
        </dl>
      </section>

      {/* Entries List */}
      <section className="flex-1 overflow-y-auto px-6 pb-6" aria-label="历史记录">
        {entriesByDate.length === 0 ? (
          <p className="text-center text-neutral-400 mt-12">
            还没有任何记录
          </p>
        ) : (
          <ul className="space-y-4">
            {entriesByDate.map((day) => {
              const { date, weekday } = formatDate(day.date);
              
              return (
                <li key={day.date}>
                  <article className="bg-white rounded-xl p-5 shadow-sm border border-neutral-100">
                    <header className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                      <div className="flex items-baseline gap-2">
                        <time className="text-neutral-900" dateTime={day.date}>{date}</time>
                        <small className="text-sm text-neutral-400">{weekday}</small>
                      </div>
                      <data className="text-xs text-neutral-400" value={day.entries.length}>
                        {day.entries.length} 条
                      </data>
                    </header>
                    <ul className="space-y-3">
                      {day.entries.map((entry) => (
                        <li key={entry.id} className="group">
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
                            // 查看模式
                            <div className="pl-3 border-l-2 border-neutral-200 relative">
                              <header className="flex items-center justify-between mb-1">
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
                              <p className="text-neutral-600 text-sm mb-2">{entry.content}</p>
                              
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
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </article>
  );
}