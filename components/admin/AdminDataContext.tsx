'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  FullPageData,
  LovePage,
  PageTheme,
  Section,
  TimelineItem,
  Reason,
  Memory,
  Song,
  GameQuestion,
  WheelItem,
  CompatibilityItem,
} from '@/types';
import { MOCK_PAGE_DATA } from '@/lib/mock-data';

interface AdminDataContextType {
  data: FullPageData;
  publishedData: FullPageData | null;
  publishedAt: string | null;
  isLoading: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  isDirty: boolean;
  statusMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  updatePage: (partial: Partial<LovePage>) => void;
  updateTheme: (partial: Partial<PageTheme>) => void;
  updateSections: (sections: Section[]) => void;
  updateSectionConfig: (sectionId: string, config: any) => void;
  updateTimelineItems: (items: TimelineItem[]) => void;
  updateReasons: (reasons: Reason[]) => void;
  updateMemories: (memories: Memory[]) => void;
  updateSongs: (songs: Song[]) => void;
  updateGameQuestions: (questions: GameQuestion[]) => void;
  updateWheelItems: (items: WheelItem[]) => void;
  updateCompatibilityItems: (items: CompatibilityItem[]) => void;
  saveChanges: (newData?: FullPageData) => Promise<boolean>;
  publishChanges: () => Promise<boolean>;
  resetDefaults: () => Promise<boolean>;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FullPageData>(MOCK_PAGE_DATA);
  const [publishedData, setPublishedData] = useState<FullPageData | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const showNotification = useCallback((type: 'success' | 'error' | 'info', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 3500);
  }, []);

  // Fetch initial data from server
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const json = await res.json();
        if (json.draft) {
          setData(json.draft);
          setPublishedData(json.published || null);
          setPublishedAt(json.published_at || null);
          setIsDirty(false);
        }
      } else {
        showNotification('error', 'Failed to load stored data, using fallback');
      }
    } catch {
      showNotification('error', 'Network error loading admin data');
    } finally {
      setIsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updatePage = useCallback((partial: Partial<LovePage>) => {
    setData(prev => ({
      ...prev,
      page: { ...prev.page, ...partial },
    }));
    setIsDirty(true);
  }, []);

  const updateTheme = useCallback((partial: Partial<PageTheme>) => {
    setData(prev => ({
      ...prev,
      theme: { ...prev.theme, ...partial },
    }));
    setIsDirty(true);
  }, []);

  const updateSections = useCallback((sections: Section[]) => {
    setData(prev => ({
      ...prev,
      sections,
    }));
    setIsDirty(true);
  }, []);

  const updateSectionConfig = useCallback((sectionId: string, config: any) => {
    setData(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, config: { ...s.config, ...config } } : s
      ),
    }));
    setIsDirty(true);
  }, []);

  const updateTimelineItems = useCallback((timeline_items: TimelineItem[]) => {
    setData(prev => ({ ...prev, timeline_items }));
    setIsDirty(true);
  }, []);

  const updateReasons = useCallback((reasons: Reason[]) => {
    setData(prev => ({ ...prev, reasons }));
    setIsDirty(true);
  }, []);

  const updateMemories = useCallback((memories: Memory[]) => {
    setData(prev => ({ ...prev, memories }));
    setIsDirty(true);
  }, []);

  const updateSongs = useCallback((songs: Song[]) => {
    setData(prev => ({ ...prev, songs }));
    setIsDirty(true);
  }, []);

  const updateGameQuestions = useCallback((game_questions: GameQuestion[]) => {
    setData(prev => ({ ...prev, game_questions }));
    setIsDirty(true);
  }, []);

  const updateWheelItems = useCallback((wheel_items: WheelItem[]) => {
    setData(prev => ({ ...prev, wheel_items }));
    setIsDirty(true);
  }, []);

  const updateCompatibilityItems = useCallback((compatibility_items: CompatibilityItem[]) => {
    setData(prev => ({ ...prev, compatibility_items }));
    setIsDirty(true);
  }, []);

  const saveChanges = useCallback(
    async (newData?: FullPageData): Promise<boolean> => {
      const dataToSave = newData || data;
      setIsSaving(true);
      try {
        const res = await fetch('/api/admin/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: dataToSave }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.store?.draft) {
            setData(json.store.draft);
            setPublishedData(json.store.published || null);
          }
          setIsDirty(false);
          showNotification('success', 'Changes saved successfully to draft!');
          return true;
        } else {
          showNotification('error', 'Failed to save changes. Please try again.');
          return false;
        }
      } catch {
        showNotification('error', 'Network error while saving changes.');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [data, showNotification]
  );

  const publishChanges = useCallback(async (): Promise<boolean> => {
    setIsPublishing(true);
    try {
      // Save any pending draft changes first
      if (isDirty) {
        await saveChanges();
      }

      const res = await fetch('/api/admin/publish', {
        method: 'POST',
      });

      if (res.ok) {
        const json = await res.json();
        if (json.store) {
          setData(json.store.draft);
          setPublishedData(json.store.published);
          setPublishedAt(json.store.published_at || new Date().toISOString());
        }
        setIsDirty(false);
        showNotification('success', '🎉 Published successfully! Live website updated.');
        return true;
      } else {
        showNotification('error', 'Failed to publish changes.');
        return false;
      }
    } catch {
      showNotification('error', 'Network error while publishing.');
      return false;
    } finally {
      setIsPublishing(false);
    }
  }, [isDirty, saveChanges, showNotification]);

  const resetDefaults = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.store.draft);
        setPublishedData(json.store.published);
        setIsDirty(false);
        showNotification('info', 'Reset all content to default template!');
        return true;
      }
      return false;
    } catch {
      showNotification('error', 'Failed to reset defaults.');
      return false;
    }
  }, [showNotification]);

  return (
    <AdminDataContext.Provider
      value={{
        data,
        publishedData,
        publishedAt,
        isLoading,
        isSaving,
        isPublishing,
        isDirty,
        statusMessage,
        updatePage,
        updateTheme,
        updateSections,
        updateSectionConfig,
        updateTimelineItems,
        updateReasons,
        updateMemories,
        updateSongs,
        updateGameQuestions,
        updateWheelItems,
        updateCompatibilityItems,
        saveChanges,
        publishChanges,
        resetDefaults,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
}
