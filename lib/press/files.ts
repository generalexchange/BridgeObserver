export type PressFileType = 'article' | 'image' | 'doc' | 'video';
export type PressFileStatus = 'draft' | 'review' | 'approved' | 'published';

export type PressFileComment = {
  id: string;
  parentId?: string;
  author: string;
  message: string;
  timestamp: string;
};

export type PressFileActivity = {
  views: number;
  edits: number;
  comments: number;
  lastViewedBy?: string;
  lastViewedAt?: string;
};

export type PressFile = {
  id: string;
  name: string;
  type: PressFileType;
  status: PressFileStatus;
  content: string;
  author: string;
  lastEdited: string;
  comments: PressFileComment[];
  activity: PressFileActivity;
  folderId?: string;
  isFolder?: boolean;
};

export type PressNotificationType = 'comment' | 'approved' | 'rejected' | 'viewed' | 'review';

export type PressNotification = {
  id: string;
  fileId?: string;
  message: string;
  type: PressNotificationType;
  read: boolean;
  timestamp: string;
};

export const PRESS_FILES_KEY = 'bridge_press_files';
export const PRESS_NOTIFICATIONS_KEY = 'bridge_press_notifications';
