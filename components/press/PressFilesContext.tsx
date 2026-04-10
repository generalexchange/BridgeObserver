'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { articles as seedNewsArticles } from '@/data/newsSiteData';
import { FileService } from '@/lib/press/fileService';
import type { PressFile, PressNotification } from '@/lib/press/files';
import { PRESS_FILES_KEY, PRESS_NOTIFICATIONS_KEY } from '@/lib/press/files';
import { readArticles } from '@/lib/press/storage';

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function seedFiles(author = 'writer@press.local'): PressFile[] {
  const localArticles = readArticles();
  const articleFiles = localArticles.map((a) => ({
    id: a.id,
    name: a.title || 'Untitled article',
    type: 'article' as const,
    status: a.status === 'submitted' ? ('review' as const) : a.status === 'approved' ? ('published' as const) : ('draft' as const),
    content: a.content || '',
    author: a.author || author,
    lastEdited: a.createdAt,
    comments: [],
    activity: { views: 0, edits: 0, comments: 0 },
  }));

  const media = seedNewsArticles.slice(0, 4).map((a, i) => ({
    id: `seed-media-${i}`,
    name: `${a.slug}.jpg`,
    type: 'image' as const,
    status: 'approved' as const,
    content: a.imageUrl,
    author,
    lastEdited: new Date(Date.now() - (i + 1) * 3600_000).toISOString(),
    comments: [],
    activity: { views: i + 2, edits: 0, comments: 0 },
  }));

  return [...articleFiles, ...media];
}

type Ctx = {
  files: PressFile[];
  notifications: PressNotification[];
  ready: boolean;
  refresh: () => Promise<void>;
  uploadFile: (input: { name?: string; type?: PressFile['type']; author: string; content?: string; folderId?: string }) => Promise<void>;
  createFolder: (name: string, author: string) => Promise<void>;
  updateFile: (id: string, patch: Partial<PressFile>) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  moveFile: (id: string, folderId?: string) => Promise<void>;
  reorder: (fromId: string, toId: string) => Promise<void>;
  submitForReview: (id: string) => Promise<void>;
  addComment: (id: string, author: string, message: string, parentId?: string) => Promise<void>;
  markViewed: (id: string, viewer: string) => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
};

const PressFilesContext = createContext<Ctx | null>(null);

export function PressFilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<PressFile[]>([]);
  const [notifications, setNotifications] = useState<PressNotification[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const seeded = seedFiles();
    const localFiles = readJson<PressFile[]>(PRESS_FILES_KEY, []);
    const merged = localFiles.length ? localFiles : seeded;
    setFiles(merged);
    setNotifications(readJson<PressNotification[]>(PRESS_NOTIFICATIONS_KEY, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeJson(PRESS_FILES_KEY, files);
  }, [files, ready]);

  useEffect(() => {
    if (!ready) return;
    writeJson(PRESS_NOTIFICATIONS_KEY, notifications);
  }, [notifications, ready]);

  const pushNotification = useCallback((message: string, type: PressNotification['type'], fileId?: string) => {
    setNotifications((prev) => [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        message,
        type,
        read: false,
        timestamp: new Date().toISOString(),
        fileId,
      },
      ...prev,
    ]);
  }, []);

  const refresh = useCallback(async () => {
    const next = await FileService.getFiles(files);
    setFiles(next);
  }, [files]);

  const uploadFile = useCallback<Ctx['uploadFile']>(
    async (input) => {
      const next = await FileService.uploadFile(files, input);
      setFiles(next);
      pushNotification(`File uploaded: ${input.name || 'Untitled file'}`, 'viewed');
    },
    [files, pushNotification],
  );

  const createFolder = useCallback<Ctx['createFolder']>(
    async (name, author) => {
      const next = await FileService.createFolder(files, name, author);
      setFiles(next);
    },
    [files],
  );

  const updateFile = useCallback<Ctx['updateFile']>(
    async (id, patch) => {
      const next = await FileService.updateFile(files, id, patch);
      setFiles(next);
    },
    [files],
  );

  const deleteFile = useCallback<Ctx['deleteFile']>(
    async (id) => {
      const victim = files.find((f) => f.id === id);
      const next = await FileService.deleteFile(files, id);
      setFiles(next);
      if (victim) pushNotification(`Deleted file: ${victim.name}`, 'viewed');
    },
    [files, pushNotification],
  );

  const moveFile = useCallback<Ctx['moveFile']>(
    async (id, folderId) => {
      const next = await FileService.moveFile(files, id, folderId);
      setFiles(next);
    },
    [files],
  );

  const reorder = useCallback<Ctx['reorder']>(
    async (fromId, toId) => {
      const next = await FileService.reorder(files, fromId, toId);
      setFiles(next);
    },
    [files],
  );

  const submitForReview = useCallback<Ctx['submitForReview']>(
    async (id) => {
      const target = files.find((f) => f.id === id);
      const next = await FileService.submitForReview(files, id);
      setFiles(next);
      if (target) pushNotification(`Submitted for review: ${target.name}`, 'review', id);
    },
    [files, pushNotification],
  );

  const addComment = useCallback<Ctx['addComment']>(
    async (id, author, message, parentId) => {
      const target = files.find((f) => f.id === id);
      const next = await FileService.addComment(files, id, author, message, parentId);
      setFiles(next);
      if (target) pushNotification(`Editor commented on ${target.name}`, 'comment', id);
    },
    [files, pushNotification],
  );

  const markViewed = useCallback<Ctx['markViewed']>(
    async (id, viewer) => {
      const target = files.find((f) => f.id === id);
      const next = await FileService.trackView(files, id, viewer);
      setFiles(next);
      if (target) pushNotification(`File viewed: ${target.name}`, 'viewed', id);
    },
    [files, pushNotification],
  );

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      files,
      notifications,
      ready,
      refresh,
      uploadFile,
      createFolder,
      updateFile,
      deleteFile,
      moveFile,
      reorder,
      submitForReview,
      addComment,
      markViewed,
      markNotificationRead,
      markAllRead,
    }),
    [
      files,
      notifications,
      ready,
      refresh,
      uploadFile,
      createFolder,
      updateFile,
      deleteFile,
      moveFile,
      reorder,
      submitForReview,
      addComment,
      markViewed,
      markNotificationRead,
      markAllRead,
    ],
  );

  return <PressFilesContext.Provider value={value}>{children}</PressFilesContext.Provider>;
}

export function usePressFiles() {
  const ctx = useContext(PressFilesContext);
  if (!ctx) throw new Error('usePressFiles requires PressFilesProvider');
  return ctx;
}
