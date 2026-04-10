'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Bold, Eye, EyeOff, Heading2, Heading3, Italic, Pilcrow } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PressShell } from '@/components/press/PressShell';
import { RequirePressAuth } from '@/components/press/RequirePressAuth';
import { usePressArticles } from '@/components/press/PressArticlesContext';
import { usePressAuth } from '@/components/press/PressAuthContext';
import { usePressToast } from '@/components/press/PressToastContext';
import { navSections, type NewsSection } from '@/data/newsSiteData';
import type { PressArticle } from '@/lib/press/types';
import { usePressHref } from '@/lib/press/paths';

function blankArticle(id: string, author: string): PressArticle {
  return {
    id,
    title: '',
    subtitle: '',
    category: 'News',
    image: '',
    content: '<p></p>',
    status: 'draft',
    author,
    createdAt: new Date().toISOString(),
  };
}

export function PressEditorPage() {
  const params = useSearchParams();
  const idParam = params?.get('id') ?? null;
  const { session, ready: authReady } = usePressAuth();
  const { getById, upsert, ready: dataReady } = usePressArticles();
  const { show } = usePressToast();
  const router = useRouter();
  const listHref = usePressHref('/articles');
  const submissionsHref = usePressHref('/submissions');
  const editorNewHref = usePressHref('/editor');

  const newId = useMemo(() => crypto.randomUUID(), []);

  const [article, setArticle] = useState<PressArticle | null>(null);
  const [preview, setPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    initRef.current = false;
  }, [idParam]);

  useEffect(() => {
    if (!authReady || !dataReady || !session?.email || initRef.current) return;

    if (idParam) {
      const found = getById(idParam);
      if (found) {
        setArticle({ ...found });
        initRef.current = true;
        return;
      }
      show('Article not found — opening a new draft.');
      router.replace(editorNewHref);
      setArticle(blankArticle(newId, session.email));
      initRef.current = true;
      return;
    }

    setArticle(blankArticle(newId, session.email));
    initRef.current = true;
  }, [authReady, dataReady, session?.email, idParam, getById, router, show, editorNewHref, newId]);

  const scheduleAutosave = useCallback(
    (next: PressArticle) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        upsert(next);
        saveTimer.current = null;
      }, 900);
    },
    [upsert],
  );

  const onInput = () => {
    const el = editorRef.current;
    if (!el || !article) return;
    const html = el.innerHTML;
    const next = { ...article, content: html };
    setArticle(next);
    scheduleAutosave(next);
  };

  const lastLoadedId = useRef<string | null>(null);
  const prevPreview = useRef(false);

  useEffect(() => {
    if (!article || preview) {
      prevPreview.current = preview;
      return;
    }
    const el = editorRef.current;
    if (!el) return;

    const idChanged = lastLoadedId.current !== article.id;
    const leavingPreview = prevPreview.current && !preview;
    if (idChanged || leavingPreview) {
      el.innerHTML = article.content;
      lastLoadedId.current = article.id;
    }
    prevPreview.current = preview;
  }, [article, preview]);

  const runCmd = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    onInput();
  };

  const updateField = <K extends keyof PressArticle>(key: K, value: PressArticle[K]) => {
    setArticle((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      scheduleAutosave(next);
      return next;
    });
  };

  const saveDraft = () => {
    if (!article) return;
    const next = { ...article, status: 'draft' as const };
    setArticle(next);
    upsert(next);
    show('Saved as draft');
  };

  const submitReview = () => {
    if (!article) return;
    const next = { ...article, status: 'submitted' as const };
    setArticle(next);
    upsert(next);
    show('Submitted for review');
    router.push(submissionsHref);
  };

  if (!article) {
    return (
      <RequirePressAuth>
        <PressShell>
          <p className="press-empty">Loading editor…</p>
        </PressShell>
      </RequirePressAuth>
    );
  }

  return (
    <RequirePressAuth>
      <PressShell>
        <div className="press-page press-page--editor">
          <header className="press-editor__header">
            <div>
              <h1 className="press-page__h1">Article editor</h1>
              <p className="press-page__lede">
                <Link href={listHref} className="press-inline-link">
                  ← Back to files
                </Link>
              </p>
            </div>
            <div className="press-editor__header-actions">
              <button type="button" className="press-btn press-btn--ghost" onClick={() => setPreview((p) => !p)}>
                {preview ? <EyeOff size={18} /> : <Eye size={18} />}
                {preview ? 'Edit' : 'Preview'}
              </button>
              <button type="button" className="press-btn press-btn--ghost" onClick={saveDraft}>
                Save draft
              </button>
              <button type="button" className="press-btn press-btn--primary" onClick={submitReview}>
                Submit for review
              </button>
            </div>
          </header>

          <div className="press-editor__grid">
            <div className="press-editor__fields">
              <label className="press-field">
                <span>Title</span>
                <input
                  value={article.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Headline"
                />
              </label>
              <label className="press-field">
                <span>Subtitle</span>
                <input
                  value={article.subtitle}
                  onChange={(e) => updateField('subtitle', e.target.value)}
                  placeholder="Deck / subhead"
                />
              </label>
              <label className="press-field">
                <span>Category</span>
                <select
                  value={article.category}
                  onChange={(e) => updateField('category', e.target.value as NewsSection)}
                >
                  {navSections.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="press-field">
                <span>Featured image URL</span>
                <input
                  value={article.image}
                  onChange={(e) => updateField('image', e.target.value)}
                  placeholder="https://…"
                />
              </label>
            </div>

            <div className="press-editor__workspace">
              <div className="press-editor__toolbar">
                <button type="button" className="press-toolbar__btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCmd('bold')} title="Bold">
                  <Bold size={18} />
                </button>
                <button type="button" className="press-toolbar__btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCmd('italic')} title="Italic">
                  <Italic size={18} />
                </button>
                <button type="button" className="press-toolbar__btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCmd('formatBlock', 'H2')} title="Heading 2">
                  <Heading2 size={18} />
                </button>
                <button type="button" className="press-toolbar__btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCmd('formatBlock', 'H3')} title="Heading 3">
                  <Heading3 size={18} />
                </button>
                <button type="button" className="press-toolbar__btn" onMouseDown={(e) => e.preventDefault()} onClick={() => runCmd('formatBlock', 'P')} title="Paragraph">
                  <Pilcrow size={18} />
                </button>
              </div>

              <div className="press-editor__body-wrap">
                {preview ? (
                  <article className="press-editor__preview">
                    {article.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.image} alt="" className="press-editor__preview-img" />
                    ) : null}
                    <p className="press-editor__preview-kicker">{article.category}</p>
                    <h1 className="press-editor__preview-title">{article.title || 'Untitled'}</h1>
                    {article.subtitle ? <p className="press-editor__preview-sub">{article.subtitle}</p> : null}
                    <div className="press-editor__preview-body" dangerouslySetInnerHTML={{ __html: article.content }} />
                  </article>
                ) : (
                  <div
                    ref={editorRef}
                    className="press-editor__rte"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={onInput}
                    role="textbox"
                    aria-multiline="true"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </PressShell>
    </RequirePressAuth>
  );
}
