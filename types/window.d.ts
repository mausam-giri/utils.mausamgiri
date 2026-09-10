declare global {
  interface Window {
    setFilter: (type: string) => void;
    closeNoteModal: () => void;
    saveNote: () => void;
    toggleCheck: (id: string) => void;
    toggleFlag: (id: string) => void;
    openNoteModal: (id: string) => void;
    toggleSubsection: (key: string) => void;
  }
}

export {};
