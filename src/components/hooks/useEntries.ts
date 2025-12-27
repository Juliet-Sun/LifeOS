import { useState, useEffect } from 'react';
import { indexedDBBackup } from './useIndexedDB';

export interface Entry {
  id: string;
  date: string;
  content: string;
  wordCount: number;
  createdAt: string;
  dimensions?: string[]; // 添加维度标记
}

interface DayEntries {
  date: string;
  entries: Entry[];
}

// 八个生命维度
export type Dimension = 'career' | 'finance' | 'health' | 'leisure' | 'family' | 'social' | 'growth' | 'fulfillment';

export interface DimensionInfo {
  id: Dimension;
  name: string;
  color: string;
  keywords: string[];
}

// 维度定义
export const DIMENSIONS: Record<Dimension, DimensionInfo> = {
  career: {
    id: 'career',
    name: '职业发展',
    color: '#3b82f6', // blue
    keywords: ['工作', '加班', '开会', '项目', '同事', '领导', '升职', '跳槽', '职业', '公司', '任务', '汇报', '会议', '业务', '客户', '方案', '报告', '需求', '产品', '设计', '代码', '测试', '上线', '复盘', '绩效', '考核', '面试', '简历', '应聘', '实习', '转正', '离职', '辞职', '入职', '培训', '出差', '加薪', '降薪', '调岗'],
  },
  finance: {
    id: 'finance',
    name: '财务状况',
    color: '#10b981', // green
    keywords: ['钱', '工资', '理财', '投资', '购物', '消费', '存款', '收入', '支出', '财务', '账单', '买', '花', '省', '赚', '薪', '奖金', '股票', '基金', '房贷', '车贷', '贷款', '信用卡', '债', '欠', '还款', '利息', '保险', '报销', '发票', '税', '红包', '转账', '支付', '余额', '预算'],
  },
  health: {
    id: 'health',
    name: '个人健康',
    color: '#ef4444', // red
    keywords: ['运动', '健身', '跑步', '睡眠', '体检', '医院', '身体', '健康', '锻炼', '瑜伽', '累', '疲惫', '休息', '八段锦', '太极', '游泳', '篮球', '足球', '羽毛球', '散步', '爬山', '骑车', '拉伸', '冥想', '打卡', '减肥', '增肌', '养生', '早睡', '熬夜', '生病', '感冒', '发烧', '咳嗽', '头痛', '胃痛', '过敏', '药', '吃药', '打针', '输液', '挂号', '就医', '复查', '康复', '拉屎', '拉肚子', '便秘', '上厕所', '大便', '小便', '尿', '屎', '拉稀', '腹泻', '消化', '肠胃', '吐', '呕吐', '恶心', '晕', '眩晕', '痛', '酸痛', '肌肉', '骨头', '关节', '扭伤', '受伤', '流血', '伤口', '包扎'],
  },
  leisure: {
    id: 'leisure',
    name: '娱乐休闲',
    color: '#f59e0b', // amber
    keywords: ['电影', '游戏', '旅游', '音乐', '书', '阅读', '娱乐', '放松', '看剧', '综艺', '短视频', '刷手机', '追剧', '动漫', '音乐会', '演唱会', '展览', '博物馆', '咖啡', '奶茶', '美食', '逛街', '购物', '摄影', '画画', '唱歌', 'KTV', '酒吧', '夜店', '喝酒', '醉', '宿醉', '派对', 'party', '聚餐', '火锅', '烧烤', '串串', '麻辣烫', '小吃', '零食', '甜品', '蛋糕', '冰淇淋', '奶茶', '咖啡', '喝茶', '品茶', '钓鱼', '露营', '野餐', '徒步', '登山', '骑行', '自驾', '飞机', '高铁', '火车', '景点', '打游戏', '开黑', '上分', '掉分', '输了', '赢了', '吃鸡', '王者', '英雄联盟', 'switch', 'ps', 'xbox', '主机', '手游', '端游'],
  },
  family: {
    id: 'family',
    name: '家庭',
    color: '#ec4899', // pink
    keywords: ['爸妈', '父母', '家人', '回家', '家庭', '妈妈', '爸爸', '母亲', '父亲', '亲人', '家里', '弟弟', '妹妹', '哥哥', '姐姐', '爷爷', '奶奶', '外公', '外婆', '叔叔', '阿姨', '亲戚', '团聚', '陪伴', '孩子', '儿子', '女儿', '宝宝', '老婆', '老公', '媳妇', '丈夫', '妻子', '婆婆', '公公', '岳父', '岳母', '姑姑', '舅舅', '姨妈', '堂弟', '堂妹', '表弟', '表妹', '侄子', '侄女', '外甥', '外甥女', '孙子', '孙女', '家务', '做饭', '洗碗', '扫地', '拖地', '洗衣服', '晾衣服', '收衣服', '整理', '打扫', '卫生', '垃圾', '倒垃圾'],
  },
  social: {
    id: 'social',
    name: '朋友和重要他人',
    color: '#8b5cf6', // purple
    keywords: ['朋友', '聚会', '聊天', '约饭', '社交', '见面', '伙伴', '同学', '老友', '吵架', '恋爱', '伴侣', '男朋友', '女朋友', '对象', '约会', '表白', '分手', '复合', '闺蜜', '兄弟', '好友', '网友', '相亲', '追', '被追', '暗恋', '喜欢', '爱', '想念', '思念', '牵挂', '关心', '在乎', '陪', '陪伴', '一起', '合照', '自拍', '发朋友圈', '点赞', '评论', '私信', '微信', 'QQ', '电话', '视频', '语音', '消息', '回复', '已读', '未读', '拉黑', '删除', '屏蔽', '拉群', '退群', '群聊', '单聊'],
  },
  growth: {
    id: 'growth',
    name: '个人成长',
    color: '#14b8a6', // teal
    keywords: ['学习', '课程', '读书', '技能', '知识', '成长', '进步', '思考', '笔记', '复盘', '总结', '培训', '考试', '证书', '英语', '编程', '设计', '写作', '演讲', '沟通', '反思', '提升', '突破', '认知', '感悟', '领悟', '明白', '懂了', '理解', '学会', '掌握', '精通', '练习', '背', '记忆', '记住', '忘了', '复习', '预习', '作业', '论文', '研究', '调研', '实验', '数据', '分析', '思维', '逻辑', '批判', '独立', '自主', '主动', '被动', '拖延', '效率', '专注', '分心', '走神'],
  },
  fulfillment: {
    id: 'fulfillment',
    name: '自我实现',
    color: '#6366f1', // indigo
    keywords: ['梦想', '目标', '价值', '意义', '创作', '写作', '作品', '理想', '使命', '天赋', '热爱', '志愿', '公益', '帮助', '贡献', '影响力', '成就', '突破', '创新', '探索', '实践', '坚持', '放弃', '选择', '决定', '勇气', '害怕', '恐惧', '焦虑', '迷茫', '困惑', '挣扎', '纠结', '犹豫', '后悔', '遗憾', '满足', '幸福', '快乐', '开心', '高兴', '兴奋', '激动', '感动', '感激', '感恩', '自豪', '骄傲', '自卑', '沮丧', '失落', '难过', '伤心', '痛苦', '煎熬', '折磨', '压力', '紧张', '轻松', '释然', '平静', '安静', '孤独', '寂寞', '空虚', '充实', '有意义', '无意义'],
  },
};

// 智能维度匹配
export function matchDimensions(content: string): Dimension[] {
  const matched: Dimension[] = [];
  const lowerContent = content.toLowerCase();
  
  Object.entries(DIMENSIONS).forEach(([dimensionId, info]) => {
    const hasMatch = info.keywords.some(keyword => 
      lowerContent.includes(keyword.toLowerCase())
    );
    if (hasMatch) {
      matched.push(dimensionId as Dimension);
    }
  });
  
  return matched;
}

const STORAGE_KEY = 'daily_entries';

// 智能字数统计：中文字符每个算一个字，英文单词算一个字
export function countWords(text: string): number {
  if (!text.trim()) return 0;
  
  // 匹配中文字符（包括中文标点）
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
  // 匹配英文单词（连续的字母）
  const englishWords = text.match(/[a-zA-Z]+/g) || [];
  // 匹配数字
  const numbers = text.match(/\d+/g) || [];
  
  return chineseChars.length + englishWords.length + numbers.length;
}

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    try {
      console.log('🔍 开始加载entries...');
      console.log('Storage key:', STORAGE_KEY);
      
      // 使用直接属性访问而不是getItem
      const stored = localStorage[STORAGE_KEY];
      console.log('localStorage[key] 返回:', stored);
      console.log('stored 类型:', typeof stored);
      console.log('stored 长度:', stored?.length);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        console.log('=== 开始数据迁移检查 ===');
        console.log('原始数据条数:', parsed.length);
        console.log('原始数据:', parsed);
        
        // 自动迁移：将旧的UTC时间数据转换为本地时区
        const migrated = parsed.map((entry: Entry, index: number) => {
          // 从 createdAt 获取真实的创建时间，并转换为本地日期
          const createdDate = new Date(entry.createdAt);
          const localDateString = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, '0')}-${String(createdDate.getDate()).padStart(2, '0')}`;
          
          // 如果日期不匹配，说明是旧数据，需要迁移
          if (entry.date !== localDateString) {
            console.log(`迁移记录 ${index}:`, {
              原始date: entry.date,
              createdAt: entry.createdAt,
              本地时间: createdDate.toString(),
              新date: localDateString,
              内容预览: entry.content.substring(0, 20)
            });
            return {
              ...entry,
              date: localDateString,
            };
          }
          return entry;
        });
        
        // 如果有数据被迁移，保存更新后的数据
        const hasChanged = migrated.some((entry: Entry, index: number) => entry.date !== parsed[index].date);
        if (hasChanged) {
          localStorage[STORAGE_KEY] = JSON.stringify(migrated);
          console.log('✅ 数据已自动迁移到本地时区');
        } else {
          console.log('✅ 无需迁移，所有数据已是本地时区');
        }
        console.log('=== 迁移检查完成 ===');
        
        // Sort by createdAt descending
        migrated.sort((a: Entry, b: Entry) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setEntries(migrated);
      } else {
        console.log('⚠️ localStorage中没有数据');
      }
    } catch (error) {
      console.error('Failed to load entries:', error);
    }
  };

  const saveEntries = (newEntries: Entry[]) => {
    try {
      localStorage[STORAGE_KEY] = JSON.stringify(newEntries);
      // Sort by createdAt descending
      newEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setEntries(newEntries);
      
      // 自动备份到IndexedDB
      indexedDBBackup.saveAll(newEntries).catch(err => {
        console.error('IndexedDB自动备份失败:', err);
      });
    } catch (error) {
      console.error('Failed to save entries:', error);
    }
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayEntries = () => {
    const todayStr = getTodayDateString();
    return entries.filter(entry => entry.date === todayStr);
  };

  const addEntry = (content: string, customDate?: string) => {
    // 如果提供了自定义日期，使用它；否则使用今天的日期
    const dateStr = customDate || getTodayDateString();
    const now = new Date();
    
    console.log('添加记录 - 目标日期:', dateStr);
    console.log('添加记录 - 当前时间:', now);
    console.log('添加记录 - ISO时间:', now.toISOString());
    
    const entry: Entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: dateStr,
      content: content.trim(),
      wordCount: countWords(content),
      createdAt: now.toISOString(),
      dimensions: matchDimensions(content), // 添加维度匹配
    };

    const newEntries = [entry, ...entries];
    saveEntries(newEntries);
  };

  const getEntriesByDate = (): DayEntries[] => {
    const grouped = entries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, Entry[]>);

    return Object.entries(grouped)
      .map(([date, entries]) => ({
        date,
        entries: entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getWeeklyEntriesByDate = (): DayEntries[] => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weekEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monday && entryDate <= sunday;
    });

    const grouped = weekEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) {
        acc[entry.date] = [];
      }
      acc[entry.date].push(entry);
      return acc;
    }, {} as Record<string, Entry[]>);

    return Object.entries(grouped)
      .map(([date, entries]) => ({
        date,
        entries: entries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getTotalStats = () => {
    const uniqueDates = new Set(entries.map(e => e.date));
    
    return {
      totalDays: uniqueDates.size,
      totalEntries: entries.length,
      totalWords: entries.reduce((sum, entry) => sum + entry.wordCount, 0),
    };
  };

  const clearAllEntries = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
    
    // 同时清空IndexedDB备份
    indexedDBBackup.clear().catch(err => {
      console.error('IndexedDB清空失败:', err);
    });
  };

  const deleteEntry = (id: string) => {
    const newEntries = entries.filter(entry => entry.id !== id);
    saveEntries(newEntries);
  };

  const updateEntry = (id: string, content: string) => {
    const newEntries = entries.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          content: content.trim(),
          wordCount: countWords(content),
          dimensions: matchDimensions(content), // 添加维度匹配
        };
      }
      return entry;
    });
    saveEntries(newEntries);
  };

  // 手动更新维度标签
  const updateEntryDimensions = (id: string, dimensions: Dimension[]) => {
    const newEntries = entries.map(entry => {
      if (entry.id === id) {
        return {
          ...entry,
          dimensions: dimensions,
        };
      }
      return entry;
    });
    saveEntries(newEntries);
  };

  // 获取过去N天的维度统计
  const getDimensionStats = (days: number = 14) => {
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(now.getDate() - days);
    cutoffDate.setHours(0, 0, 0, 0);

    // 筛选过去N天的记录
    const recentEntries = entries.filter(entry => {
      const [year, month, day] = entry.date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      return entryDate >= cutoffDate;
    });

    // 统计每个维度的出现次数
    const dimensionCounts: Record<Dimension, number> = {
      career: 0,
      finance: 0,
      health: 0,
      leisure: 0,
      family: 0,
      social: 0,
      growth: 0,
      fulfillment: 0,
    };

    recentEntries.forEach(entry => {
      if (entry.dimensions && entry.dimensions.length > 0) {
        entry.dimensions.forEach(dim => {
          dimensionCounts[dim as Dimension]++;
        });
      }
    });

    // 计算活跃度（0-1之间）
    const maxCount = Math.max(...Object.values(dimensionCounts), 1);
    const dimensionActivity: Record<Dimension, number> = {
      career: dimensionCounts.career / maxCount,
      finance: dimensionCounts.finance / maxCount,
      health: dimensionCounts.health / maxCount,
      leisure: dimensionCounts.leisure / maxCount,
      family: dimensionCounts.family / maxCount,
      social: dimensionCounts.social / maxCount,
      growth: dimensionCounts.growth / maxCount,
      fulfillment: dimensionCounts.fulfillment / maxCount,
    };

    return {
      counts: dimensionCounts,
      activity: dimensionActivity,
      totalEntries: recentEntries.length,
    };
  };

  // 获取指定日期范围的维度统计
  const getDimensionStatsByDateRange = (startDate: Date, endDate: Date) => {
    // 筛选日期范围内的记录
    const rangeEntries = entries.filter(entry => {
      const [year, month, day] = entry.date.split('-').map(Number);
      const entryDate = new Date(year, month - 1, day);
      return entryDate >= startDate && entryDate <= endDate;
    });

    // 统计每个维度的出现次数
    const dimensionCounts: Record<Dimension, number> = {
      career: 0,
      finance: 0,
      health: 0,
      leisure: 0,
      family: 0,
      social: 0,
      growth: 0,
      fulfillment: 0,
    };

    rangeEntries.forEach(entry => {
      if (entry.dimensions && entry.dimensions.length > 0) {
        entry.dimensions.forEach(dim => {
          dimensionCounts[dim as Dimension]++;
        });
      }
    });

    // 计算活跃度（0-1之间）
    const maxCount = Math.max(...Object.values(dimensionCounts), 1);
    const dimensionActivity: Record<Dimension, number> = {
      career: dimensionCounts.career / maxCount,
      finance: dimensionCounts.finance / maxCount,
      health: dimensionCounts.health / maxCount,
      leisure: dimensionCounts.leisure / maxCount,
      family: dimensionCounts.family / maxCount,
      social: dimensionCounts.social / maxCount,
      growth: dimensionCounts.growth / maxCount,
      fulfillment: dimensionCounts.fulfillment / maxCount,
    };

    return {
      counts: dimensionCounts,
      activity: dimensionActivity,
      totalEntries: rangeEntries.length,
    };
  };

  // 导出数据为JSON
  const exportData = () => {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      entries: entries,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-os-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导入数据从JSON
  const importData = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // 验证数据格式
          if (!data.entries || !Array.isArray(data.entries)) {
            throw new Error('无效的备份文件格式');
          }
          
          // 验证每个条目的基本字段
          const validEntries = data.entries.filter((entry: any) => 
            entry.id && entry.date && entry.content && entry.createdAt
          );
          
          if (validEntries.length === 0) {
            throw new Error('备份文件中没有有效数据');
          }
          
          // 保存导入的数据
          saveEntries(validEntries);
          console.log(`✅ 成功导入${validEntries.length}条记录`);
          resolve();
        } catch (error) {
          console.error('导入失败:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      
      reader.readAsText(file);
    });
  };

  // === 渐进式揭示系统 ===
  
  // 获取第一次记录的日期
  const getFirstRecordDate = (): Date | null => {
    if (entries.length === 0) return null;
    
    // 找到最早的记录
    const sortedByDate = [...entries].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    return new Date(sortedByDate[0].createdAt);
  };

  // 获取从第一次记录到现在的天数
  const getDaysSinceFirstRecord = (): number => {
    const firstDate = getFirstRecordDate();
    if (!firstDate) return 0;
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // 检查维度是否已揭示
  const isDimensionsRevealed = (): boolean => {
    const revealed = localStorage.getItem('dimensions_revealed');
    return revealed === 'true';
  };

  // 标记维度已揭示
  const setDimensionsRevealed = () => {
    localStorage.setItem('dimensions_revealed', 'true');
  };

  // 检查是否应该显示维度名称
  const shouldShowDimensionNames = (): boolean => {
    // 如果已经揭示过，永远显示
    if (isDimensionsRevealed()) return true;
    
    // 如果还没到7天，不显示
    const days = getDaysSinceFirstRecord();
    return days >= 7;
  };

  return {
    entries,
    getTodayEntries,
    addEntry,
    getEntriesByDate,
    getWeeklyEntriesByDate,
    getTotalStats,
    clearAllEntries,
    deleteEntry,
    updateEntry,
    updateEntryDimensions,
    getDimensionStats,
    getDimensionStatsByDateRange,
    exportData,
    importData,
    // 渐进式揭示
    getDaysSinceFirstRecord,
    isDimensionsRevealed,
    setDimensionsRevealed,
    shouldShowDimensionNames,
  };
}