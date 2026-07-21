"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/providers/AuthProvider";
import { fetchCustomers } from "@/services/customers";
import { fetchProjects } from "@/services/projects";
import type { Project } from "@/types/project";

type DashboardData = {
  projects: Project[];
  recentProjects: Project[];
  totalProjects: number;
  totalCustomers: number | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useDashboard(): DashboardData {
  const { token } = useAuth();

  const [projects, setProjects] = useState<Project[]>([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalCustomers, setTotalCustomers] =
    useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async (): Promise<void> => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setTotalCustomers(null);

    try {
      const [projectsResponse, customersResponse] =
        await Promise.all([
          fetchProjects(token, { perPage: 5 }),
          fetchCustomers(token, { per_page: 1 }),
        ]);

      setProjects(projectsResponse.data.data);
      setTotalProjects(projectsResponse.data.total);
      setTotalCustomers(
        customersResponse.data.summary.total
      );
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

    Promise.all([
      fetchProjects(token, { perPage: 5 }),
      fetchCustomers(token, { per_page: 1 }),
    ])
      .then(([projectsResponse, customersResponse]) => {
        if (isCancelled) {
          return;
        }

        setProjects(projectsResponse.data.data);
        setTotalProjects(projectsResponse.data.total);
        setTotalCustomers(
          customersResponse.data.summary.total
        );
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

  return {
    projects,
    recentProjects: projects,
    totalProjects,
    totalCustomers,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
