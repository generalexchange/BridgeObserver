type AdSlotProps = {
  /** Stable id for ad servers (e.g. GPT slot id). */
  slotId: string;
  /** IAB-style label: leaderboard | medium-rectangle | native */
  format?: 'leaderboard' | 'medium-rectangle' | 'native';
  className?: string;
};

const formatClass: Record<NonNullable<AdSlotProps['format']>, string> = {
  leaderboard: 'ad-slot--leaderboard',
  'medium-rectangle': 'ad-slot--mrec',
  native: 'ad-slot--native',
};

/**
 * Reserved DOM region for programmatic ads. Replace inner content with
 * your ad script (GPT, Prebid, etc.); keep the wrapper for layout CLS control.
 */
export function AdSlot({ slotId, format = 'medium-rectangle', className = '' }: AdSlotProps) {
  return (
    <aside
      className={`ad-slot ${formatClass[format]} ${className}`.trim()}
      data-ad-slot={slotId}
      data-ad-format={format}
      aria-label="Advertisement"
    >
      <div className="ad-slot__label">Advertisement</div>
      <div className="ad-slot__placeholder" id={`ad-placeholder-${slotId}`}>
        {/* Ad script mounts here in production, e.g. googletag.display(slotId) */}
        <span className="ad-slot__hint">Ad slot: {slotId}</span>
      </div>
    </aside>
  );
}
