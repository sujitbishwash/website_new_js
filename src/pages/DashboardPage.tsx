import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { VideoDetail, VideoChapter } from '@/lib/api-client';
import { videoApi } from '@/lib/api-client';
import Notes from '@/components/ui/notes';
import Chat from '@/components/ui/Chat';
import Quiz from '@/components/ui/Quiz';
import Flashcard from '@/components/ui/Flashcard';
import styles from './DashboardPage.module.css';

interface LocationState {
  videoDetails: VideoDetail;
  notes?: string;
}

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const { videoDetails, notes } = (location.state as LocationState) || {};
  
  const [activeMainTab, setActiveMainTab] = useState('chaptersContent');
  const [activeRightTab, setActiveRightTab] = useState('chat-screen.html');
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [chapters, setChapters] = useState<VideoChapter[]>([]);
  const [isLoadingChapters, setIsLoadingChapters] = useState(false);
  const [chaptersError, setChaptersError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>('');
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);

  if (!videoDetails) {
    return (
      <div className={styles.dashboardLayout}>
        <div className={styles.errorMessage}>
          No video details found. Please add a video first.
        </div>
      </div>
    );}

  useEffect(() => {
    const fetchChapters = async () => {
      if (!videoDetails?.external_source_id) return;

      try {
        setIsLoadingChapters(true);
        setChaptersError(null);
        const response = await videoApi.getVideoChapters(videoDetails.external_source_id);
        setChapters(response.chapters);
      } catch (err: any) {
        setChaptersError(err.message || 'Failed to fetch chapters');
        console.error('Error fetching chapters:', err);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [videoDetails?.external_source_id]);

  useEffect(() => {
    const fetchTranscript = async () => {
      if (!videoDetails?.external_source_id) return;

      try {
        setIsLoadingTranscript(true);
        setTranscriptError(null);
        const response = await videoApi.getVideoTranscript(videoDetails.external_source_id);
        setTranscript(response.transcript);
      } catch (err: any) {
        setTranscriptError(err.message || 'Failed to fetch transcript');
        console.error('Error fetching transcript:', err);
      } finally {
        setIsLoadingTranscript(false);
      }
    };

    fetchTranscript();
  }, [videoDetails?.external_source_id]);

  const handleMainTabClick = (tabId: string) => {
    setActiveMainTab(tabId);
  };

  const handleRightTabClick = (contentSrc: string) => {
    setActiveRightTab(contentSrc);
  };

  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(!isLeftSidebarOpen);
  };

  return (
    <div className={styles.dashboardLayout}>
      <button 
        className={styles.hamburgerMenu} 
        aria-label="Toggle sidebar" 
        aria-expanded={isLeftSidebarOpen}
        onClick={toggleLeftSidebar}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      </button>

      <aside className={`${styles.leftSidebar} ${isLeftSidebarOpen ? styles.open : ''}`}>
        <iframe src="/sidebar.html" frameBorder="0" title="Main Navigation Sidebar"></iframe>
      </aside>

      <main className={styles.mainContentArea}>
        <section className={styles.videoPlayerSection}>
          <div className={styles.videoPlayerWrapper}>
            <iframe 
              width="560" 
              height="315" 
              src={`https://www.youtube.com/embed/${videoDetails.external_source_id}`}
              title={videoDetails.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            />
          </div>
        </section>

        <section className={styles.contentTabsNotesSection}>
          <div className={styles.tabsAndContent}>
            <div className={styles.mainTabsControls}>
              <button 
                className={`${styles.mainTabButton} ${activeMainTab === 'chaptersContent' ? styles.active : ''}`}
                onClick={() => handleMainTabClick('chaptersContent')}
              >
                Chapters
              </button>
              <button 
                className={`${styles.mainTabButton} ${activeMainTab === 'transcriptsContent' ? styles.active : ''}`}
                onClick={() => handleMainTabClick('transcriptsContent')}
              >
                Transcripts
              </button>
            </div>
            <div className={styles.mainTabContentPanels}>
              <div 
                className={`${styles.mainTabPanel} ${activeMainTab === 'chaptersContent' ? styles.active : ''}`}
              >
                {isLoadingChapters ? (
                  <div className={styles.loadingMessage}>Loading chapters...</div>
                ) : chaptersError ? (
                  <div className={styles.errorMessage}>{chaptersError}</div>
                ) : chapters.length > 0 ? (
                  <ul className={styles.chaptersList}>
                    {chapters.map((chapter, index) => (
                      <li key={index} className={styles.chapterItem}>
                        <div className={styles.chapterTimestamp}>{chapter.timestamp}</div>
                        <div className={styles.chapterContent}>
                          <h4 className={styles.chapterTitle}>{chapter.title}</h4>
                          <p className={styles.chapterDescription}>{chapter.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.noChaptersMessage}>No chapters available for this video.</div>
                )}
              </div>
              <div 
                className={`${styles.mainTabPanel} ${activeMainTab === 'transcriptsContent' ? styles.active : ''}`}
              >
                {isLoadingTranscript ? (
                  <div className={styles.loadingMessage}>Loading transcript...</div>
                ) : transcriptError ? (
                  <div className={styles.errorMessage}>{transcriptError}</div>
                ) : transcript ? (
                  <div className={styles.transcriptContent}>
                    {transcript.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className={styles.noContentMessage}>No transcript available for this video.</div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.notesComponentContainer}>
            <Notes 
              initialNotes={notes || ''} 
              onNotesChange={(newNotes) => {
                // You can handle note changes here if needed
                console.log('Notes updated:', newNotes);
              }}
            />
          </div>
        </section>
      </main>

      <aside className={styles.rightSidebar}>
        <div className={styles.rightSidebarControls}>
          <button 
            className={`${styles.rightSidebarTabButton} ${activeRightTab === 'chat-screen.html' ? styles.active : ''}`}
            onClick={() => handleRightTabClick('chat-screen.html')}
          >
            AI Chat
          </button>
          <button 
            className={`${styles.rightSidebarTabButton} ${activeRightTab === 'quiz.html' ? styles.active : ''}`}
            onClick={() => handleRightTabClick('quiz.html')}
          >
            Question
          </button>
          <button 
            className={`${styles.rightSidebarTabButton} ${activeRightTab === 'flashcard.html' ? styles.active : ''}`}
            onClick={() => handleRightTabClick('flashcard.html')}
          >
            Flash Cards
          </button>
        </div>
        <div className={styles.rightSidebarContentWrapper}>
          {activeRightTab === 'chat-screen.html' ? (
            <Chat videoId={videoDetails.external_source_id} />
          ) : activeRightTab === 'quiz.html' ? (
            <Quiz videoId={videoDetails.external_source_id} />
          ) : activeRightTab === 'flashcard.html' ? (
            <Flashcard videoId={videoDetails.external_source_id} />
          ) : (
            <iframe 
              src={activeRightTab} 
              frameBorder="0" 
              title="Dynamic Content Area"
            />
          )}
          <p 
            className={`${styles.rightSidebarPlaceholder} ${activeRightTab ? styles.hidden : ''}`}
          >
            Select an option above to load content.
          </p>
        </div>
      </aside>
    </div>
  );
};

export default DashboardPage; 