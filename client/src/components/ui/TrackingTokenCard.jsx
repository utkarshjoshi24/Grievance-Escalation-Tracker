import React, { useState } from 'react';
import clsx from 'clsx';
import Button from './Button';

export const TrackingTokenCard = ({
  token,
  uuid,
  isAnonymous = false,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        'relative bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low border border-primary/30 rounded-2xl p-6 shadow-xl shadow-blue-950/20 overflow-hidden',
        className
      )}
    >
      {/* Decorative background glow */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">token</span>
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
              Official Grievance Token
            </span>
            {isAnonymous && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">enhanced_encryption</span>
                Zero-Knowledge Shielded
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-mono font-black text-on-surface tracking-wider select-all">
              {token || 'GET-XXXX-XXXX'}
            </span>
          </div>

          {uuid && (
            <p className="text-[11px] font-mono text-outline truncate max-w-md">
              UUID: {uuid}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="secondary"
            icon={copied ? 'done' : 'content_copy'}
            onClick={handleCopy}
            className={copied ? 'text-emerald-400 border-emerald-500/50' : ''}
          >
            {copied ? 'Copied to Clipboard' : 'Copy Token'}
          </Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-outline">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">lock</span>
          Keep this token safe to track grievance redressal status anonymously.
        </span>
      </div>
    </div>
  );
};

export default TrackingTokenCard;
