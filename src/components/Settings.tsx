import { useState, useRef } from 'react';
import { useEntries } from './hooks/useEntries';
import { Trash2Icon, LockIcon, DownloadIcon, UploadIcon, DatabaseIcon } from 'lucide-react';

export function Settings() {
  const { clearAllEntries, exportData, importData } = useEntries();
  const [showConfirm, setShowConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClearAll = () => {
    clearAllEntries();
    setShowConfirm(false);
  };

  const handleExportData = () => {
    exportData();
  };

  const handleImportData = async () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await importData(file);
      setImportStatus('success');
      setImportMessage('✅ 数据导入成功！');
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    } catch (error) {
      setImportStatus('error');
      setImportMessage('❌ 导入失败，请检查文件格式');
      setTimeout(() => {
        setImportStatus('idle');
        setImportMessage('');
      }, 3000);
    }

    // 清空input，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <article className="h-full flex flex-col bg-blue-50/30">
      <header className="px-6 pt-16 pb-6">
        <h1 className="text-3xl text-neutral-900">设置</h1>
      </header>

      {/* Settings Content */}
      <section className="flex-1 px-6 pb-6 overflow-y-auto">
        <ul className="space-y-4">
          {/* Privacy Notice */}
          <li>
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100" aria-labelledby="privacy-heading">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <LockIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 id="privacy-heading" className="text-neutral-900 mb-2">隐私保护</h2>
                  <p className="text-sm text-neutral-500">
                    所有内容只属于你，所有数据都保存在你的设备上，不会上传到任何服务器。
                  </p>
                </div>
              </div>
            </section>
          </li>

          {/* Data Management Section */}
          <li>
            <h3 className="text-xs text-neutral-400 px-1 mb-2">数据管理</h3>
          </li>

          {/* Auto Backup Notice */}
          <li>
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <DatabaseIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-neutral-900 mb-2">自动备份</h2>
                  <p className="text-sm text-neutral-500">
                    每次保存时自动备份到浏览器IndexedDB，防止数据意外丢失。
                  </p>
                </div>
              </div>
            </section>
          </li>

          {/* Export Data */}
          <li>
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <button
                onClick={handleExportData}
                className="w-full flex items-center justify-between group"
                aria-label="导出数据"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center" aria-hidden="true">
                    <DownloadIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-neutral-900">导出数据</div>
                    <div className="text-xs text-neutral-400 mt-0.5">下载JSON备份文件</div>
                  </div>
                </div>
                <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors" aria-hidden="true">›</span>
              </button>
            </section>
          </li>

          {/* Import Data */}
          <li>
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <button
                onClick={handleImportData}
                className="w-full flex items-center justify-between group"
                aria-label="导入数据"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center" aria-hidden="true">
                    <UploadIcon className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-neutral-900">导入数据</div>
                    <div className="text-xs text-neutral-400 mt-0.5">从JSON文件恢复</div>
                  </div>
                </div>
                <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors" aria-hidden="true">›</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".json"
                onChange={handleFileChange}
              />
              {importStatus !== 'idle' && (
                <p className={`text-sm mt-3 ${importStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {importMessage}
                </p>
              )}
            </section>
          </li>

          {/* Clear All Data */}
          <li>
            <section className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100">
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center justify-between group"
                aria-label="清空所有内容"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center" aria-hidden="true">
                    <Trash2Icon className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-neutral-900">清空所有内容</div>
                    <div className="text-xs text-red-400 mt-0.5">此操作不可恢复</div>
                  </div>
                </div>
                <span className="text-neutral-400 group-hover:text-neutral-600 transition-colors" aria-hidden="true">›</span>
              </button>
            </section>
          </li>
        </ul>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <aside 
          className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-heading"
        >
          <article className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <header className="mb-6">
              <h2 id="confirm-heading" className="text-xl text-neutral-900 mb-2 text-center">
                确认清空？
              </h2>
              <p className="text-sm text-neutral-500 text-center">
                此操作将删除所有记录，无法恢复。建议先导出备份。
              </p>
            </header>
            <menu className="space-y-3">
              <li>
                <button
                  onClick={handleClearAll}
                  className="w-full py-3 bg-red-600 text-white rounded-lg transition-all hover:bg-red-700 active:scale-95"
                >
                  确认清空
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-3 bg-neutral-100 text-neutral-700 rounded-lg transition-all hover:bg-neutral-200 active:scale-95"
                >
                  取消
                </button>
              </li>
            </menu>
          </article>
        </aside>
      )}
    </article>
  );
}