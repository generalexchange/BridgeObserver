'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Eye,
  FileText,
  Folder,
  FolderOpen,
  Grid3X3,
  ImageIcon,
  LayoutList,
  Search,
  Send,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';
import { PressShell } from '@/components/press/PressShell';
import { RequirePressAuth } from '@/components/press/RequirePressAuth';
import { usePressAuth } from '@/components/press/PressAuthContext';
import { usePressFiles } from '@/components/press/PressFilesContext';
import { usePressToast } from '@/components/press/PressToastContext';
import type { PressFile, PressFileComment, PressFileStatus } from '@/lib/press/files';

type FileFilter = 'all' | 'draft' | 'review' | 'approved' | 'published' | 'media';

function iconForType(file: PressFile) {
  if (file.isFolder) return <FolderOpen size={16} aria-hidden />;
  if (file.type === 'article') return <FileText size={16} aria-hidden />;
  if (file.type === 'image') return <ImageIcon size={16} aria-hidden />;
  if (file.type === 'video') return <Video size={16} aria-hidden />;
  return <Folder size={16} aria-hidden />;
}

function statusLabel(status: PressFileStatus): string {
  if (status === 'review') return 'In Review';
  if (status === 'approved') return 'Approved';
  if (status === 'published') return 'Published';
  return 'Draft';
}

export function PressFilesPage() {
  const { session } = usePressAuth();
  const { show } = usePressToast();
  const {
    files,
    ready,
    uploadFile,
    createFolder,
    updateFile,
    deleteFile,
    moveFile,
    reorder,
    submitForReview,
    addComment,
    markViewed,
  } = usePressFiles();
  const [filter, setFilter] = useState<FileFilter>('all');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number; id: string } | null>(null);

  const filtered = useMemo(() => {
    let base = files;
    if (filter === 'draft') base = base.filter((f) => f.status === 'draft');
    if (filter === 'review') base = base.filter((f) => f.status === 'review');
    if (filter === 'approved') base = base.filter((f) => f.status === 'approved');
    if (filter === 'published') base = base.filter((f) => f.status === 'published');
    if (filter === 'media') base = base.filter((f) => f.type === 'image' || f.type === 'video');
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((f) => f.name.toLowerCase().includes(q) || f.author.toLowerCase().includes(q));
  }, [files, filter, query]);

  const selected = useMemo(() => files.find((f) => f.id === selectedId) ?? null, [files, selectedId]);
  const rootComments = useMemo(() => selected?.comments.filter((c) => !c.parentId) ?? [], [selected?.comments]);

  useEffect(() => {
    const fileId = new URLSearchParams(window.location.search).get('fileId');
    if (fileId) setSelectedId(fileId);
  }, []);

  const pickFile = async (id: string) => {
    setSelectedId(id);
    if (session?.email) await markViewed(id, session.email);
  };

  const onUpload = async () => {
    await uploadFile({
      author: session?.email ?? 'writer@press.local',
      type: 'doc',
      name: `Upload ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.doc`,
      content: 'Uploaded file placeholder.',
    });
    show('Uploaded file (mock).');
  };

  const onNewFolder = async () => {
    await createFolder('New Folder', session?.email ?? 'writer@press.local');
    show('Folder created.');
  };

  const openContextMenu = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    setCtx({ x: event.clientX, y: event.clientY, id });
  };

  const runCtxAction = async (action: 'rename' | 'move' | 'delete' | 'submit') => {
    if (!ctx) return;
    const target = files.find((f) => f.id === ctx.id);
    if (!target) return;

    if (action === 'rename') {
      const next = window.prompt('Rename file', target.name);
      if (next && next.trim()) {
        await updateFile(target.id, { name: next.trim() });
        show('Renamed file.');
      }
    } else if (action === 'move') {
      const folders = files.filter((f) => f.isFolder);
      const folderName = window.prompt(
        `Move to folder (name). Available: ${folders.map((f) => f.name).join(', ') || 'none'}`,
        folders[0]?.name ?? '',
      );
      const folder = folders.find((f) => f.name.toLowerCase() === (folderName ?? '').trim().toLowerCase());
      await moveFile(target.id, folder?.id);
      show(folder ? `Moved to ${folder.name}.` : 'Moved to root.');
    } else if (action === 'delete') {
      await deleteFile(target.id);
      if (selectedId === target.id) setSelectedId(null);
      show('Deleted file.');
    } else if (action === 'submit') {
      await submitForReview(target.id);
      show('Submitted for review.');
    }
    setCtx(null);
  };

  const submitComment = async () => {
    if (!selected || !commentDraft.trim()) return;
    await addComment(selected.id, session?.email ?? 'writer@press.local', commentDraft, replyTo ?? undefined);
    setCommentDraft('');
    setReplyTo(null);
    show('Comment added.');
  };

  const renderComment = (comment: PressFileComment) => {
    const replies = selected?.comments.filter((c) => c.parentId === comment.id) ?? [];
    return (
      <li key={comment.id} className="press-comment">
        <div className="press-comment__head">
          <strong>{comment.author}</strong>
          <time dateTime={comment.timestamp}>{new Date(comment.timestamp).toLocaleString()}</time>
        </div>
        <p>{comment.message}</p>
        <button type="button" className="press-link-btn" onClick={() => setReplyTo(comment.id)}>
          Reply
        </button>
        {replies.length ? <ul className="press-comment__replies">{replies.map(renderComment)}</ul> : null}
      </li>
    );
  };

  return (
    <RequirePressAuth>
      <PressShell>
        <div className="press-page press-files">
          <header className="press-page__hero">
            <h1 className="press-page__h1">Files</h1>
            <p className="press-page__lede">Dropbox-style newsroom workspace for articles, media, and review flow.</p>
          </header>

          <section className="press-files__layout">
            <aside className="press-files__sidebar">
              <h2 className="press-files__side-title">Library</h2>
              {([
                ['all', 'All Files'],
                ['draft', 'Drafts'],
                ['review', 'In Review'],
                ['approved', 'Approved'],
                ['published', 'Published'],
                ['media', 'Media'],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`press-files__filter${filter === key ? ' is-active' : ''}`}
                  onClick={() => setFilter(key)}
                >
                  {label}
                </button>
              ))}
            </aside>

            <div className="press-files__main" onClick={() => setCtx(null)}>
              <div className="press-files__toolbar">
                <div className="press-files__toolbar-left">
                  <button type="button" className="press-btn press-btn--primary" onClick={onUpload}>
                    <Upload size={16} aria-hidden /> Upload
                  </button>
                  <button type="button" className="press-btn press-btn--ghost" onClick={onNewFolder}>
                    <Folder size={16} aria-hidden /> New Folder
                  </button>
                </div>
                <label className="press-files__search">
                  <Search size={16} aria-hidden />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search files"
                    aria-label="Search files"
                  />
                </label>
                <div className="press-files__view-toggle">
                  <button type="button" className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')}>
                    <LayoutList size={16} />
                  </button>
                  <button type="button" className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')}>
                    <Grid3X3 size={16} />
                  </button>
                </div>
              </div>

              {!ready ? (
                <p className="press-empty">Loading files…</p>
              ) : (
                <div className={view === 'grid' ? 'press-files__grid' : 'press-files__list'}>
                  {filtered.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      className={`press-file-row${selectedId === file.id ? ' is-selected' : ''}`}
                      onClick={() => void pickFile(file.id)}
                      onContextMenu={(e) => openContextMenu(e, file.id)}
                      draggable
                      onDragStart={() => setDragId(file.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragId && dragId !== file.id) void reorder(dragId, file.id);
                        setDragId(null);
                      }}
                    >
                      <span className="press-file-row__name">
                        {iconForType(file)}
                        {file.name}
                      </span>
                      <span>{file.isFolder ? 'folder' : file.type}</span>
                      <span>{new Date(file.lastEdited).toLocaleString()}</span>
                      <span className={`press-file-status press-file-status--${file.status}`}>{statusLabel(file.status)}</span>
                      <span>{file.author}</span>
                      <span className="press-file-row__meta">
                        <Eye size={14} /> {file.activity.views} · {file.activity.comments} comments
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {ctx ? (
                <div className="press-file-menu" style={{ left: ctx.x, top: ctx.y }}>
                  <button type="button" onClick={() => void runCtxAction('rename')}>
                    Rename
                  </button>
                  <button type="button" onClick={() => void runCtxAction('move')}>
                    Move
                  </button>
                  <button type="button" onClick={() => void runCtxAction('submit')}>
                    Submit for review
                  </button>
                  <button type="button" onClick={() => void runCtxAction('delete')}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ) : null}
            </div>

            <aside className="press-files__preview">
              {!selected ? (
                <p className="press-empty">Select a file to preview.</p>
              ) : (
                <>
                  <header className="press-files__preview-head">
                    <h2>{selected.name}</h2>
                    <p>
                      {selected.type} · {statusLabel(selected.status)} · by {selected.author}
                    </p>
                  </header>

                  <div className="press-files__preview-actions">
                    <button
                      type="button"
                      className="press-btn press-btn--ghost"
                      onClick={() => void updateFile(selected.id, { content: `${selected.content}\n\nEdited at ${new Date().toLocaleTimeString()}` })}
                    >
                      Edit
                    </button>
                    <button type="button" className="press-btn press-btn--primary" onClick={() => void submitForReview(selected.id)}>
                      Submit for Review
                    </button>
                  </div>

                  <article className="press-files__content-preview">
                    <h3>Content preview</h3>
                    <p>{selected.content.slice(0, 420) || 'No preview content available.'}</p>
                  </article>

                  <section className="press-files__meta">
                    <h3>Activity</h3>
                    <p>Views: {selected.activity.views}</p>
                    <p>Edits: {selected.activity.edits}</p>
                    <p>Comments: {selected.activity.comments}</p>
                    <p>
                      Last viewed by {selected.activity.lastViewedBy ?? '—'}
                      {selected.activity.lastViewedAt ? ` · ${new Date(selected.activity.lastViewedAt).toLocaleString()}` : ''}
                    </p>
                  </section>

                  <section className="press-files__comments">
                    <h3>Comments</h3>
                    <ul>{rootComments.map(renderComment)}</ul>
                    {replyTo ? <p className="press-files__replying">Replying in thread…</p> : null}
                    <div className="press-files__comment-form">
                      <textarea
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        placeholder="Add a comment..."
                        rows={3}
                      />
                      <button type="button" className="press-btn press-btn--primary" onClick={() => void submitComment()}>
                        <Send size={15} /> Post
                      </button>
                    </div>
                  </section>
                </>
              )}
            </aside>
          </section>
        </div>
      </PressShell>
    </RequirePressAuth>
  );
}
