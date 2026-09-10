"use client";

import Script from "next/script";
import { VisitCounter } from "../visit-counter";

export default function PreDeparturePage() {
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
                <span id="countdown" className="countdown" />
                <div className="progress-wrap">
                  <span id="progress-text">0%</span>
                  <div className="progress-track">
                    <div id="progress-fill" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="filter-row">
              <button
                type="button"
                onClick={() => window.setFilter("all")}
                id="btn-all"
                className="filter-btn is-active"
              >
                All
              </button>
              <button
                type="button"
                onClick={() => window.setFilter("pending")}
                id="btn-pending"
                className="filter-btn"
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => window.setFilter("completed")}
                id="btn-completed"
                className="filter-btn"
              >
                Completed
              </button>
            </div>
          </div>
        </header>

        <main>
          <div id="checklist-container" />
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

      <div id="note-modal" className="modal hidden">
        <div className="modal-card">
          <h3>Add Note</h3>
          <p id="note-item-title">For: Item Name</p>
          <textarea id="note-input" placeholder="Type your reminder here..." />
          <div className="modal-actions">
            <button
              type="button"
              onClick={() => window.closeNoteModal()}
              className="btn-text"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => window.saveNote()}
              className="btn-primary"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>

      <Script src="/ws-pre-departure/script.js" strategy="afterInteractive" />
    </>
  );
}
