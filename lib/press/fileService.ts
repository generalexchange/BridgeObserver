import type { PressFile, PressFileComment, PressFileStatus } from '@/lib/press/files';

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Service layer for file operations.
 * Current implementation is local/mock; designed to swap with Dropbox/API calls later.
 */
export const FileService = {
  async getFiles(files: PressFile[]): Promise<PressFile[]> {
    return [...files].sort((a, b) => b.lastEdited.localeCompare(a.lastEdited));
  },

  async uploadFile(
    files: PressFile[],
    input: Partial<Pick<PressFile, 'name' | 'type' | 'author' | 'content' | 'folderId'>>,
  ): Promise<PressFile[]> {
    const file: PressFile = {
      id: makeId(),
      name: input.name?.trim() || 'Untitled file',
      type: input.type ?? 'doc',
      status: 'draft',
      content: input.content ?? '',
      author: input.author ?? 'newsroom@bridgeobserver.com',
      lastEdited: nowIso(),
      comments: [],
      activity: { views: 0, edits: 0, comments: 0 },
      folderId: input.folderId,
      isFolder: false,
    };
    return [file, ...files];
  },

  async createFolder(files: PressFile[], name: string, author: string): Promise<PressFile[]> {
    const folder: PressFile = {
      id: makeId(),
      name: name.trim() || 'New Folder',
      type: 'doc',
      status: 'draft',
      content: '',
      author,
      lastEdited: nowIso(),
      comments: [],
      activity: { views: 0, edits: 0, comments: 0 },
      isFolder: true,
    };
    return [folder, ...files];
  },

  async updateFile(files: PressFile[], id: string, patch: Partial<PressFile>): Promise<PressFile[]> {
    return files.map((f) =>
      f.id === id
        ? {
            ...f,
            ...patch,
            lastEdited: nowIso(),
            activity: {
              ...f.activity,
              edits: f.activity.edits + 1,
            },
          }
        : f,
    );
  },

  async deleteFile(files: PressFile[], id: string): Promise<PressFile[]> {
    return files.filter((f) => f.id !== id && f.folderId !== id);
  },

  async moveFile(files: PressFile[], id: string, folderId?: string): Promise<PressFile[]> {
    return files.map((f) => (f.id === id ? { ...f, folderId, lastEdited: nowIso() } : f));
  },

  async submitForReview(files: PressFile[], id: string): Promise<PressFile[]> {
    return files.map((f) =>
      f.id === id
        ? {
            ...f,
            status: 'review' as PressFileStatus,
            lastEdited: nowIso(),
            activity: { ...f.activity, edits: f.activity.edits + 1 },
          }
        : f,
    );
  },

  async trackView(files: PressFile[], id: string, viewer: string): Promise<PressFile[]> {
    return files.map((f) =>
      f.id === id
        ? {
            ...f,
            activity: {
              ...f.activity,
              views: f.activity.views + 1,
              lastViewedBy: viewer,
              lastViewedAt: nowIso(),
            },
          }
        : f,
    );
  },

  async addComment(
    files: PressFile[],
    id: string,
    author: string,
    message: string,
    parentId?: string,
  ): Promise<PressFile[]> {
    const comment: PressFileComment = {
      id: makeId(),
      parentId,
      author,
      message: message.trim(),
      timestamp: nowIso(),
    };
    if (!comment.message) return files;

    return files.map((f) =>
      f.id === id
        ? {
            ...f,
            comments: [...f.comments, comment],
            activity: { ...f.activity, comments: f.activity.comments + 1 },
            lastEdited: nowIso(),
          }
        : f,
    );
  },

  async reorder(files: PressFile[], fromId: string, toId: string): Promise<PressFile[]> {
    const next = [...files];
    const from = next.findIndex((f) => f.id === fromId);
    const to = next.findIndex((f) => f.id === toId);
    if (from < 0 || to < 0 || from === to) return files;
    const moved = next.splice(from, 1)[0];
    if (!moved) return files;
    next.splice(to, 0, moved);
    return next;
  },
};
