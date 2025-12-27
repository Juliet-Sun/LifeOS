import { useState } from 'react';
import { Home } from './components/Home';
import { History } from './components/History';
import { WeeklyReview } from './components/WeeklyReview';
import { Settings } from './components/Settings';
import { Tree } from './components/Tree';
import { HomeIcon, ClockIcon, CalendarIcon, SettingsIcon, TreePine } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'tree' | 'weekly' | 'settings'>('home');

  return (
    <div className="h-screen flex flex-col bg-slate-50 max-w-md mx-auto">
      {/* 保留外层div：React根容器需要 */}

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'home' && <Home />}
        {activeTab === 'history' && <History />}
        {activeTab === 'tree' && <Tree />}
        {activeTab === 'weekly' && <WeeklyReview />}
        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Bottom Tab Bar - iOS Style */}
      <nav className="bg-white border-t border-slate-200 safe-area-bottom" aria-label="主导航">
        <ul className="flex justify-around items-center h-20 px-4">
          <li className="flex-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 w-full ${
                activeTab === 'home' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
              aria-current={activeTab === 'home' ? 'page' : undefined}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">今天</span>
            </button>
          </li>

          <li className="flex-1">
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-1 w-full ${
                activeTab === 'history' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
              aria-current={activeTab === 'history' ? 'page' : undefined}
            >
              <ClockIcon className="w-6 h-6" />
              <span className="text-xs">历史</span>
            </button>
          </li>

          <li className="flex-1">
            <button
              onClick={() => setActiveTab('tree')}
              className={`flex flex-col items-center gap-1 w-full ${
                activeTab === 'tree' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
              aria-current={activeTab === 'tree' ? 'page' : undefined}
            >
              <TreePine className="w-6 h-6" />
              <span className="text-xs">全景</span>
            </button>
          </li>

          <li className="flex-1">
            <button
              onClick={() => setActiveTab('weekly')}
              className={`flex flex-col items-center gap-1 w-full ${
                activeTab === 'weekly' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
              aria-current={activeTab === 'weekly' ? 'page' : undefined}
            >
              <CalendarIcon className="w-6 h-6" />
              <span className="text-xs">周回顾</span>
            </button>
          </li>

          <li className="flex-1">
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 w-full ${
                activeTab === 'settings' ? 'text-neutral-900' : 'text-neutral-400'
              }`}
              aria-current={activeTab === 'settings' ? 'page' : undefined}
            >
              <SettingsIcon className="w-6 h-6" />
              <span className="text-xs">设置</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}