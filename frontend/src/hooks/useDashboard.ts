"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/providers/AuthProvider";
import { fetchProjects } from "@/services/projects";
import type { Project } from "@/types/project";

type DashboardData = {
  projects: Project[];
  recentProjects: Project[];
  totalProjects: number;
  activeProjects: number;
  totalEstimatedBudget: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useDashboard(): DashboardData {
  const { token } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchProjects(token, 1, 100);

      setProjects(response.data.data);
      setTotalProjects(response.data.total);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isCancelled = false;

    fetchProjects(token, 1, 100)
      .then((response) => {
        if (isCancelled) {
          return;
        }

        setProjects(response.data.data);
        setTotalProjects(response.data.total);
        setError(null);
      })
      .catch((caughtError: unknown) => {
        if (isCancelled) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to load dashboard data."
        );
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [token]);

  const recentProjects = useMemo(
    () => projects.slice(0, 5),
    [projects]
  );

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.status === "active"
      ).length,
    [projects]
  );

  const totalEstimatedBudget = useMemo(
    () =>
      projects.reduce((total, project) => {
        const amount = Number(project.estimated_budget ?? 0);

        return Number.isFinite(amount)
          ? total + amount
          : total;
      }, 0),
    [projects]
  );

  return {
    projects,
    recentProjects,
    totalProjects,
    activeProjects,
    totalEstimatedBudget,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
