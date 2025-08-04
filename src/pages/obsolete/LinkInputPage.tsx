import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoApi } from '@/lib/api-client';
import styles from './LinkInputPage.module.css';

const LinkInputPage: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAdd = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!url) {
        throw new Error('Please enter a URL');
      }

      const videoDetails = await videoApi.getVideoDetail(url);
      navigate('/dashboard', { 
        state: { 
          videoDetails,
          notes: notes.trim() || undefined 
        } 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process video');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h2>YouTube, Website, Etc.</h2>
          <p>Enter a YouTube Link, Website URL, Doc, ArXiv, Etc.</p>
        </header>

        <main className={styles.modalBody}>
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <div className={styles.formGroup}>
            <input
              type="text"
              className={styles.input}
              placeholder="https://youtu.be/example"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <div className={`${styles.formGroup} ${styles.textareaGroup}`}>
            <textarea
              className={styles.textarea}
              placeholder="Paste your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
            />
            <div className={styles.clipboardIcon}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
          </div>
        </main>

        <footer className={styles.modalFooter}>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.addButton}`}
            onClick={handleAdd}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Add'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default LinkInputPage; 