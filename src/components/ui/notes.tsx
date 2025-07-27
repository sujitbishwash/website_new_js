import React, { useState, useEffect, useRef } from 'react';
import styles from './notes.module.css';

interface NotesProps {
  initialNotes?: string;
  onNotesChange?: (notes: string) => void;
}

const Notes: React.FC<NotesProps> = ({ initialNotes = '', onNotesChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialNotes) {
      setNotes(initialNotes);
    }
  }, [initialNotes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    onNotesChange?.(newNotes);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={styles.notesComponentWrapper}>
      <div className={`${styles.notesContainer} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.notesHeader}>
          <button
            className={styles.notesActionBtn}
            onClick={toggleExpand}
            aria-label={isExpanded ? 'Collapse note editor' : 'Expand note editor'}
            title={isExpanded ? 'Collapse' : 'Expand/Collapse'}
          >
            <svg
              className="icon-expand"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
              style={{ display: isExpanded ? 'none' : 'inline-block' }}
            >
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
            <svg
              className="icon-collapse"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="18"
              height="18"
              style={{ display: isExpanded ? 'inline-block' : 'none' }}
            >
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
            </svg>
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className={styles.noteInput}
          value={notes}
          onChange={handleNotesChange}
          placeholder="Write your notes here..."
          aria-label="Note input area"
        />
      </div>
    </div>
  );
};

export default Notes;
