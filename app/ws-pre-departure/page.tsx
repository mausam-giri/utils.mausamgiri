"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { VisitCounter } from "../visit-counter";
import {
  arrivalCard,
  checklistData,
  getAllChecklistItems,
  isEssential,
  sectionPriority,
  type ArrivalCard as ArrivalCardType,
  type ChecklistItem,
  type Section,
} from "./data";
import { getSectionIcon } from "./icons";

const STORAGE_KEY = "wsc-smart-checklist";
const COUNTDOWN_TARGET = new Date("September 19, 2026 00:00:00").getTime();

type Filter = "all" | "pending" | "completed" | "essential";
type ViewMode = "focus" | "browse";

interface PersistedState {
  checks: Record<string, boolean>;
  flags: Record<string, boolean>;
  notes: Record<string, string>;
  collapsed: Record<string, boolean>;
  viewMode?: ViewMode;
}

interface ArrivalStatus {
  key: "upcoming" | "open" | "closed";
  label: string;
}

interface SectionStats {
  id: string;
  title: string;
  done: number;
  total: number;
}

function getSubsectionKey(sectionId: string, subsectionName: string) {
  return `${sectionId}::${subsectionName}`;
}

function getSectionKey(sectionId: string) {
  return `section::${sectionId}`;
}

function getArrivalWindow(card: ArrivalCardType) {
  const arrival = new Date(card.arrivalAt);
  const openAt = new Date(arrival.getTime() - card.openHoursBefore * 3600 * 1000);
  const closeAt = new Date(arrival.getTime() - card.closeHoursBefore * 3600 * 1000);
  return { arrival, openAt, closeAt };
}

function formatChinaDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    day: "numeric",
    month: "short",
  }).format(date);
}

function formatDuration(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  if (d > 0) return `${d}d ${h}h`;
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m`;
}

function getArrivalStatus(now = new Date()): ArrivalStatus {
  const { openAt, closeAt } = getArrivalWindow(arrivalCard);
  if (now < openAt) {
    return { key: "upcoming", label: `Opens in ${formatDuration(openAt.getTime() - now.getTime())}` };
  }
  if (now < closeAt) {
    return { key: "open", label: `Window open · closes in ${formatDuration(closeAt.getTime() - now.getTime())}` };
  }
  return { key: "closed", label: "Ideal window has passed - form may still be required" };
}

function formatCountdown(now: number) {
  const delta = Math.max(Math.floor((COUNTDOWN_TARGET - now) / 1000), 0);
  const d = Math.floor(delta / 86400);
  const h = Math.floor((delta % 86400) / 3600);
  const m = Math.floor((delta % 3600) / 60);
  const s = delta % 60;
  return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function progressMessage(done: number, total: number) {
  if (done === total) return "You're all set - have a great competition!";
  const pct = Math.round((done / total) * 100);
  if (pct < 25) return "Start with documents and essentials";
  if (pct < 50) return "Good progress - keep going";
  if (pct < 75) return "More than halfway there";
  return "Almost ready to depart";
}

function matchesFilter(
  id: string,
  filter: Filter,
  checks: Record<string, boolean>,
) {
  const checked = !!checks[id];
  if (filter === "all") return true;
  if (filter === "completed") return checked;
  if (filter === "pending") return !checked;
  return !checked && isEssential(id);
}

function matchesSearch(item: ChecklistItem, query: string) {
  if (!query) return true;
  const haystack = `${item.title} ${item.desc ?? ""}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function loadState(): PersistedState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { checks: {}, flags: {}, notes: {}, collapsed: {} };
    const parsed = JSON.parse(saved) as Partial<PersistedState>;
    return {
      checks: parsed.checks ?? {},
      flags: parsed.flags ?? {},
      notes: parsed.notes ?? {},
      collapsed: parsed.collapsed ?? {},
      viewMode: parsed.viewMode,
    };
  } catch {
    return { checks: {}, flags: {}, notes: {}, collapsed: {} };
  }
}

function MaterialIcon({
  name,
  filled = false,
  className = "",
}: {
  name: string;
  filled?: boolean;
  className?: string;
}) {
  return (
    <span className={`material-icon${filled ? " material-icon-filled" : ""} ${className}`.trim()}>
      {name}
    </span>
  );
}

function SectionIcon({ sectionId, className = "" }: { sectionId: string; className?: string }) {
  return <MaterialIcon name={getSectionIcon(sectionId)} className={className} />;
}

function CheckIcon({ checked }: { checked: boolean }) {
  return (
    <div className="custom-checkbox pointer-events-none">
      <input type="checkbox" className="hidden" checked={checked} readOnly tabIndex={-1} />
      <div>
        <svg
          className={`check-icon-svg${checked ? "" : " hidden"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}

function ItemRow({
  item,
  isChecked,
  isFlagged,
  hasNote,
  onToggleCheck,
  onToggleFlag,
  onOpenNote,
}: {
  item: ChecklistItem;
  isChecked: boolean;
  isFlagged: boolean;
  hasNote: boolean;
  onToggleCheck: () => void;
  onToggleFlag: () => void;
  onOpenNote: () => void;
}) {
  return (
    <div
      className={`item-row${isChecked ? " item-completed" : ""}${isFlagged ? " is-flagged" : ""}`}
      onClick={onToggleCheck}
    >
      <CheckIcon checked={isChecked} />
      <div className="item-main">
        <div className="item-title-row">
          <p className="item-text truncate">{item.title}</p>
          {!isEssential(item.id) && <span className="optional-badge">Optional</span>}
          {hasNote && <MaterialIcon name="chat_bubble" filled className="icon-sm" />}
        </div>
        {item.desc && <p className="item-desc">{item.desc}</p>}
      </div>
      <div className="item-actions" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onToggleFlag} className="flag-btn" aria-label="Flag item">
          <MaterialIcon name="flag" />
        </button>
        <button
          type="button"
          onClick={onOpenNote}
          className={hasNote ? "has-note-btn" : ""}
          aria-label="Add comment"
        >
          <MaterialIcon name="add_comment" filled={hasNote} />
        </button>
      </div>
    </div>
  );
}

function ArrivalCardSection({
  isChecked,
  isFlagged,
  hasNote,
  arrivalStatus,
  onToggleCheck,
  onToggleFlag,
  onOpenNote,
}: {
  isChecked: boolean;
  isFlagged: boolean;
  hasNote: boolean;
  arrivalStatus: ArrivalStatus;
  onToggleCheck: () => void;
  onToggleFlag: () => void;
  onOpenNote: () => void;
}) {
  const { openAt, closeAt } = getArrivalWindow(arrivalCard);

  return (
    <section className="action-section">
      <div className={`card action-card${isChecked ? " is-done" : ""}${isFlagged ? " is-flagged" : ""}`}>
        <div
          className={`item-row${isChecked ? " item-completed" : ""}${isFlagged ? " is-flagged" : ""}`}
          onClick={onToggleCheck}
        >
          <CheckIcon checked={isChecked} />
          <div className="item-main">
            <div className="item-title-row">
              <p className="item-text">{arrivalCard.title}</p>
              {hasNote && <MaterialIcon name="chat_bubble" filled className="icon-sm" />}
            </div>
            <p className="item-desc">{arrivalCard.desc}</p>
          </div>
          <div className="item-actions" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={onToggleFlag} className="flag-btn" aria-label="Flag item">
              <MaterialIcon name="flag" />
            </button>
            <button
              type="button"
              onClick={onOpenNote}
              className={hasNote ? "has-note-btn" : ""}
              aria-label="Add comment"
            >
              <MaterialIcon name="add_comment" filled={hasNote} />
            </button>
          </div>
        </div>
        <div className="action-card-body">
          <p className="action-window-row">
            <span className="action-meta">
              Fill window: {formatChinaDate(openAt)} – {formatChinaDate(closeAt)}
            </span>
            <span className="action-status" data-status={arrivalStatus.key}>
              {arrivalStatus.label}
            </span>
          </p>
          <a
            className="action-link"
            href={arrivalCard.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Open official form
            <MaterialIcon name="open_in_new" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const complete = done === total && total > 0;

  return (
    <span className={`section-ring${complete ? " is-complete" : ""}`} aria-hidden="true">
      {complete ? <MaterialIcon name="check" className="ring-check" /> : `${pct}%`}
    </span>
  );
}

const shortSectionTitles: Record<string, string> = {
  "travel-docs": "Documents",
  "nsdc-items": "NSDC Kit",
  "health-hygiene": "Health",
  clothing: "Clothing",
  "tech-power": "Tech",
  "travel-gear": "Gear",
  "food-snacks": "Food",
  info: "Reminders",
};

function CategoryChips({
  stats,
  onSelect,
}: {
  stats: SectionStats[];
  onSelect: (sectionId: string) => void;
}) {
  return (
    <div className="category-chips" role="list" aria-label="Category progress">
      {stats.map((section) => {
        const complete = section.done === section.total;
        const label = shortSectionTitles[section.id] ?? section.title;
        return (
          <button
            key={section.id}
            type="button"
            role="listitem"
            className={`category-chip${complete ? " is-complete" : ""}`}
            onClick={() => onSelect(section.id)}
            aria-label={`${section.title}: ${section.done} of ${section.total} complete`}
          >
            <SectionIcon sectionId={section.id} className="chip-icon" />
            <span className="chip-label">{label}</span>
            <span className="chip-count">{section.done}/{section.total}</span>
          </button>
        );
      })}
    </div>
  );
}

function NoteModal({
  open,
  itemTitle,
  noteText,
  onNoteChange,
  onClose,
  onSave,
}: {
  open: boolean;
  itemTitle: string;
  noteText: string;
  onNoteChange: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!open) return null;

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="note-modal-title">
      <div className="modal-card">
        <h3 id="note-modal-title">Add Note</h3>
        <p>For: {itemTitle}</p>
        <textarea
          className="note-input"
          value={noteText}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Type your reminder here..."
        />
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-text">
            Cancel
          </button>
          <button type="button" onClick={onSave} className="btn-primary">
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PreDeparturePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<ViewMode>("focus");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [focusSectionId, setFocusSectionId] = useState<string | null>(null);
  const [noteItemId, setNoteItemId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [countdown, setCountdown] = useState("");
  const [arrivalStatus, setArrivalStatus] = useState<ArrivalStatus>(() => getArrivalStatus());
  const [hydrated, setHydrated] = useState(false);

  const allChecklistItems = useMemo(() => getAllChecklistItems(), []);
  const allTrackableItems = useMemo(
    () => [arrivalCard, ...allChecklistItems],
    [allChecklistItems],
  );
  const itemTitles = useMemo(
    () => new Map(allTrackableItems.map((item) => [item.id, item.title])),
    [allTrackableItems],
  );

  const doneCount = useMemo(
    () => allTrackableItems.filter((item) => checks[item.id]).length,
    [allTrackableItems, checks],
  );
  const progress = useMemo(
    () => Math.round((doneCount / allTrackableItems.length) * 100),
    [doneCount, allTrackableItems.length],
  );
  const essentialPendingCount = useMemo(
    () =>
      allChecklistItems.filter((item) => isEssential(item.id) && !checks[item.id]).length +
      (!checks[arrivalCard.id] ? 1 : 0),
    [allChecklistItems, checks],
  );

  const sectionStats = useMemo<SectionStats[]>(() => {
    return sectionPriority
      .map((sectionId) => {
        const section = checklistData.find((s) => s.id === sectionId);
        if (!section) return null;
        const items = section.subsections.flatMap((sub) => sub.items);
        const done = items.filter((item) => checks[item.id]).length;
        return { id: section.id, title: section.title, done, total: items.length };
      })
      .filter((s): s is SectionStats => s !== null);
  }, [checks]);

  const browseSections = useMemo(() => {
    const query = search.trim();
    return checklistData
      .map((section) => {
        const subsections = section.subsections
          .map((subsection) => {
            const items = subsection.items.filter(
              (item) =>
                matchesFilter(item.id, filter, checks) && matchesSearch(item, query),
            );
            return items.length > 0 ? { ...subsection, items } : null;
          })
          .filter((sub): sub is Section["subsections"][number] => sub !== null);

        if (subsections.length === 0) return null;
        return { ...section, subsections };
      })
      .filter((section): section is Section => section !== null);
  }, [filter, checks, search]);

  const arrivalVisible = useMemo(() => {
    if (!matchesFilter(arrivalCard.id, filter, checks)) return false;
    if (!search.trim()) return true;
    return matchesSearch(arrivalCard, search.trim());
  }, [filter, checks, search]);

  const hasBrowseResults = arrivalVisible || browseSections.length > 0;

  useEffect(() => {
    const state = loadState();
    setChecks(state.checks);
    setFlags(state.flags);
    setNotes(state.notes);
    setCollapsed(state.collapsed);
    if (state.viewMode) setViewMode(state.viewMode);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ checks, flags, notes, collapsed, viewMode }),
    );
  }, [checks, flags, notes, collapsed, viewMode, hydrated]);

  useEffect(() => {
    const tick = () => {
      setCountdown(formatCountdown(Date.now()));
      setArrivalStatus(getArrivalStatus());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const toggleCheck = useCallback((id: string) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const toggleFlag = useCallback((id: string) => {
    setFlags((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });
  }, []);

  const toggleSubsection = useCallback((key: string, defaultCollapsed = false) => {
    setCollapsed((prev) => {
      const isCollapsed = prev[key] ?? defaultCollapsed;
      return { ...prev, [key]: !isCollapsed };
    });
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    const key = getSectionKey(sectionId);
    setCollapsed((prev) => {
      const isCollapsed = prev[key] ?? true;
      return { ...prev, [key]: !isCollapsed };
    });
  }, []);

  const openNoteModal = useCallback(
    (id: string) => {
      setNoteItemId(id);
      setNoteText(notes[id] ?? "");
    },
    [notes],
  );

  const closeNoteModal = useCallback(() => {
    setNoteItemId(null);
    setNoteText("");
  }, []);

  const saveNote = useCallback(() => {
    if (!noteItemId) return;
    const text = noteText.trim();
    setNotes((prev) => {
      const next = { ...prev };
      if (text) next[noteItemId] = text;
      else delete next[noteItemId];
      return next;
    });
    closeNoteModal();
  }, [noteItemId, noteText, closeNoteModal]);

  const jumpToSection = useCallback((sectionId: string) => {
    setViewMode("browse");
    setFilter("all");
    setSearch("");
    setFocusSectionId(sectionId);
    setCollapsed((prev) => ({
      ...prev,
      [getSectionKey(sectionId)]: false,
    }));
  }, []);

  useEffect(() => {
    if (!focusSectionId || viewMode !== "browse") return;
    const el = document.getElementById(`section-${focusSectionId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFocusSectionId(null);
  }, [focusSectionId, viewMode, browseSections]);

  const renderSubsection = (
    section: Section,
    subsection: Section["subsections"][number],
    defaultCollapsed: boolean,
  ) => {
    const subKey = getSubsectionKey(section.id, subsection.name);
    const isCollapsed = collapsed[subKey] ?? defaultCollapsed;

    return (
      <div key={subKey} className="card">
        <button
          type="button"
          onClick={() => toggleSubsection(subKey, defaultCollapsed)}
          className={`subsection-toggle${isCollapsed ? " is-collapsed" : ""}`}
          aria-expanded={!isCollapsed}
        >
          <span className="subsection-name">{subsection.name}</span>
          <span className="subsection-meta">
            {subsection.items.filter((item) => checks[item.id]).length}/{subsection.items.length}
          </span>
          <MaterialIcon name={isCollapsed ? "expand_more" : "expand_less"} className="collapse-icon" />
        </button>
        {!isCollapsed && (
          <div>
            {subsection.items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                isChecked={!!checks[item.id]}
                isFlagged={!!flags[item.id]}
                hasNote={!!notes[item.id]}
                onToggleCheck={() => toggleCheck(item.id)}
                onToggleFlag={() => toggleFlag(item.id)}
                onOpenNote={() => openNoteModal(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="page">
        <header>
          <div className="header-inner">
            <div className="header-top">
              <div className="header-title">
                <h1>WSC 2026 Checklist</h1>
                <p>Pre-Departure</p>
              </div>
              <div className="header-meta">
                <span className="countdown">{countdown}</span>
                <div className="progress-wrap" aria-label={`${doneCount} of ${allTrackableItems.length} items complete`}>
                  <span>{doneCount}/{allTrackableItems.length}</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="view-toggle" role="tablist" aria-label="Checklist view">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "focus"}
                className={`view-btn${viewMode === "focus" ? " is-active" : ""}`}
                onClick={() => setViewMode("focus")}
              >
                <MaterialIcon name="task_alt" />
                Focus
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === "browse"}
                className={`view-btn${viewMode === "browse" ? " is-active" : ""}`}
                onClick={() => setViewMode("browse")}
              >
                <MaterialIcon name="list" />
                Browse all
              </button>
            </div>

            {viewMode === "browse" && (
              <>
                <div className="search-wrap">
                  <MaterialIcon name="search" className="search-icon" />
                  <input
                    type="search"
                    className="search-input"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search checklist items"
                  />
                  {search && (
                    <button
                      type="button"
                      className="search-clear"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <MaterialIcon name="close" />
                    </button>
                  )}
                </div>
                <div className="filter-row">
                  {(["all", "pending", "completed", "essential"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilter(type)}
                      className={`filter-btn${filter === type ? " is-active" : ""}`}
                    >
                      {type === "essential" ? "Essentials" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        <main>
          {viewMode === "focus" ? (
            <div className="checklist-container">
              <section className="focus-summary card">
                <div className="focus-summary-top">
                  <div className="focus-summary-text">
                    <p className="focus-kicker">Your readiness</p>
                    <h2 className="focus-headline">{progressMessage(doneCount, allTrackableItems.length)}</h2>
                    <p className="focus-subline">
                      {essentialPendingCount > 0
                        ? `${essentialPendingCount} essential${essentialPendingCount === 1 ? "" : "s"} left to pack`
                        : "All essentials done - optional items remain"}
                    </p>
                  </div>
                  <div className="focus-progress-badge" aria-hidden="true">
                    <span className="focus-progress-value">{progress}%</span>
                    <span className="focus-progress-label">ready</span>
                  </div>
                </div>
                <CategoryChips stats={sectionStats} onSelect={jumpToSection} />
              </section>

              {!checks[arrivalCard.id] && (
                <section className="focus-block">
                  <h2 className="section-label">Time-sensitive</h2>
                  <ArrivalCardSection
                    isChecked={!!checks[arrivalCard.id]}
                    isFlagged={!!flags[arrivalCard.id]}
                    hasNote={!!notes[arrivalCard.id]}
                    arrivalStatus={arrivalStatus}
                    onToggleCheck={() => toggleCheck(arrivalCard.id)}
                    onToggleFlag={() => toggleFlag(arrivalCard.id)}
                    onOpenNote={() => openNoteModal(arrivalCard.id)}
                  />
                </section>
              )}

              {doneCount === allTrackableItems.length && (
                <p className="celebration-state">
                  <MaterialIcon name="celebration" filled />
                  Everything is checked off. You&apos;re ready for Shanghai!
                </p>
              )}

              <button
                type="button"
                className="browse-link-btn"
                onClick={() => {
                  setViewMode("browse");
                  setFilter("all");
                }}
              >
                Open full checklist ({allTrackableItems.length} items)
                <MaterialIcon name="open_in_new" />
              </button>
            </div>
          ) : (
            <div className="checklist-container">
              {arrivalVisible && (
                <ArrivalCardSection
                  isChecked={!!checks[arrivalCard.id]}
                  isFlagged={!!flags[arrivalCard.id]}
                  hasNote={!!notes[arrivalCard.id]}
                  arrivalStatus={arrivalStatus}
                  onToggleCheck={() => toggleCheck(arrivalCard.id)}
                  onToggleFlag={() => toggleFlag(arrivalCard.id)}
                  onOpenNote={() => openNoteModal(arrivalCard.id)}
                />
              )}

              {browseSections.map((section) => {
                const sectionKey = getSectionKey(section.id);
                const isSectionCollapsed = collapsed[sectionKey] ?? true;
                const sectionItems = section.subsections.flatMap((sub) => sub.items);
                const sectionDone = sectionItems.filter((item) => checks[item.id]).length;

                return (
                  <section key={section.id} id={`section-${section.id}`} className="browse-section">
                    <button
                      type="button"
                      className={`section-header${isSectionCollapsed ? " is-collapsed" : ""}`}
                      onClick={() => toggleSection(section.id)}
                      aria-expanded={!isSectionCollapsed}
                    >
                      <SectionIcon sectionId={section.id} className="section-icon" />
                      <div className="section-header-text">
                        <h2>{section.title}</h2>
                        <p>{sectionDone} of {sectionItems.length} complete</p>
                      </div>
                      <SectionProgressRing done={sectionDone} total={sectionItems.length} />
                      <MaterialIcon
                        name={isSectionCollapsed ? "expand_more" : "expand_less"}
                        className="collapse-icon"
                      />
                    </button>
                    {!isSectionCollapsed && (
                      <div className="section-body">
                        {section.subsections.map((subsection) =>
                          renderSubsection(section, subsection, false),
                        )}
                      </div>
                    )}
                  </section>
                );
              })}

              {!hasBrowseResults && (
                <p className="empty-state">No items match your search or filter.</p>
              )}
            </div>
          )}
        </main>

        <footer>
          <div className="footer-inner">
            <a
              className="credit"
              href="https://mausamgiri.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="name">Mausam Giri</span>
              <span className="site">mausamgiri.in</span>
            </a>
            <div className="footer-right">
              <a
                className="explore-tools"
                href="https://tools.mausamgiri.in"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore Tools
              </a>
              <span className="last-updated">Last Updated: Sep 10, 2026</span>
              <VisitCounter />
            </div>
          </div>
        </footer>
      </div>

      <NoteModal
        open={noteItemId !== null}
        itemTitle={noteItemId ? (itemTitles.get(noteItemId) ?? "Item") : ""}
        noteText={noteText}
        onNoteChange={setNoteText}
        onClose={closeNoteModal}
        onSave={saveNote}
      />
    </>
  );
}
