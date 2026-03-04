import { useState, useCallback } from 'react';
import { changeProject as apiChangeProject } from '../api/dashboard';
import { useAuth } from '../auth/useAuth';

export function useProject() {
  const { refreshDashboard } = useAuth();
  const [switching, setSwitching] = useState(false);

  const switchProject = useCallback(async (projectId: number) => {
    setSwitching(true);
    try {
      await apiChangeProject(projectId);
      await refreshDashboard();
    } finally {
      setSwitching(false);
    }
  }, [refreshDashboard]);

  return { switchProject, switching };
}
