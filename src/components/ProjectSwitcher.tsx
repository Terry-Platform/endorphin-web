import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../auth/useAuth';
import { apiGet } from '../api/client';
import { changeProject } from '../api/dashboard';
import { API_ROUTES } from '../api/routes';

interface ProjectItem {
  id: number;
  name: string;
  logo?: string;
}

export function ProjectSwitcher() {
  const { dashboard, user, refreshDashboard } = useAuth();
  const mission = dashboard?.your_mission;
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch projects when dropdown opens
  useEffect(() => {
    if (!open || projects.length > 0) return;
    setLoading(true);
    apiGet<any>(API_ROUTES['app.projects'])
      .then((res) => {
        console.log('[DEBUG] Projects response:', res);
        const list = res?.data?.data ?? res?.data ?? [];
        setProjects(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error('Failed to load projects:', err))
      .finally(() => setLoading(false));
  }, [open, projects.length]);

  const handleSwitch = async (projectId: number) => {
    setSwitching(true);
    try {
      await changeProject(projectId);
      await refreshDashboard();
      setOpen(false);
    } catch (err) {
      console.error('Project switch failed:', err);
    } finally {
      setSwitching(false);
    }
  };

  const currentProjectId = (user as any)?.project_id ?? mission?.id;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded flex items-center gap-1 transition-colors"
      >
        {mission?.name || 'Project kiezen'}
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-72 overflow-y-auto">
          {loading ? (
            <p className="p-3 text-sm text-gray-500">Laden...</p>
          ) : projects.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">Geen projecten gevonden</p>
          ) : (
            projects.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSwitch(p.id)}
                disabled={switching || p.id === currentProjectId}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  p.id === currentProjectId ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                }`}
              >
                {p.logo && (
                  <img src={p.logo} alt="" className="w-6 h-6 rounded object-cover shrink-0" />
                )}
                <span className="truncate">{typeof p.name === 'string' ? p.name : (p.name as any)?.en || (p.name as any)?.nl || JSON.stringify(p.name)}</span>
                {p.id === currentProjectId && (
                  <span className="ml-auto text-blue-500 shrink-0">✓</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
