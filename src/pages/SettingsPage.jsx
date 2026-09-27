import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  Building2, 
  Database, 
  Sliders, 
  Moon, 
  Sun,
  Key,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_SETTINGS } from '../firebase/settingsService';
import { firebaseConfig } from '../firebase/config';

export default function SettingsPage() {
  const { settings, saveSettings, theme, toggleTheme, showToast } = useApp();

  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await saveSettings(form);
    setSaving(false);
  };

  const handleReset = async () => {
    setForm(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
    showToast('Reset to default college project settings', 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          System Settings & Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Customize institute details, project presentation parameters, and Firebase environment
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Institute & Project Details Card */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Institute & Project Identity
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Project Title
              </label>
              <input
                type="text"
                value={form.appName || ''}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tagline / Subtitle
              </label>
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                College / University Name
              </label>
              <input
                type="text"
                value={form.collegeName || ''}
                onChange={(e) => setForm({ ...form, collegeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Lab
              </label>
              <input
                type="text"
                value={form.department || ''}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course / Semester
              </label>
              <input
                type="text"
                value={form.courseName || ''}
                onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attendance Warning Threshold (%)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.attendanceThreshold || 75}
                  onChange={(e) => setForm({ ...form, attendanceThreshold: Number(e.target.value) })}
                  className="w-28 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-bold"
                />
                <span className="text-xs text-slate-400">
                  Standard college requirement (usually 75%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* UI & Appearance Card */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface & Appearance
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Color Theme</p>
              <p className="text-slate-400">Select light or dark dashboard mode</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              <span>{theme === 'dark' ? 'Dark Mode Active' : 'Light Mode Active'}</span>
            </button>
          </div>
        </div>

        {/* Firebase Config Viewer (Safe inspection) */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Firebase Environment Configuration
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-mono text-[11px] space-y-1.5 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-400 font-bold mb-2">ACTIVE CREDENTIALS (FROM .env):</div>
              <div><strong className="text-slate-500">databaseURL:</strong> <span className="text-emerald-600 dark:text-emerald-400">{firebaseConfig.databaseURL}</span></div>
              <div><strong className="text-slate-500">projectId:</strong> <span className="text-brand-600 dark:text-brand-400">{firebaseConfig.projectId}</span></div>
              <div><strong className="text-slate-500">authDomain:</strong> <span className="text-slate-700 dark:text-slate-300">{firebaseConfig.authDomain}</span></div>
            </div>

            <div className="flex items-start gap-2 text-slate-500 text-[11px]">
              <Info className="w-4 h-4 shrink-0 text-brand-500 mt-0.5" />
              <span>
                To override Firebase project keys, modify the <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">.env</code> file in the project root directory.
              </span>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 hover:shadow transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
