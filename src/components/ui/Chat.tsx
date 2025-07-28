import React, { useEffect, useRef, useState } from 'react';
import styles from './Chat.module.css';
import { chatApi } from '@/lib/api-client';

interface ChatProps {
  videoId: string;
}

const Chat: React.FC<ChatProps> = ({ videoId }) => {
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'ai'; timestamp: string }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSuggestionsExpanded, setIsSuggestionsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setIsLoading(true);
        // First try to get chat history
        const historyResponse = await chatApi.getChatHistory(videoId);
        
        if (historyResponse.memory.length > 0) {
          // If there's history, convert it to our message format
          const formattedMessages = historyResponse.memory.map(msg => ({
            text: msg.content,
            sender: msg.role === 'assistant' ? 'ai' as const : 'user' as const,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setMessages(formattedMessages);
        } else {
          // If no history, start a new chat
          const startResponse = await chatApi.startChat(videoId);
          setMessages([{
            text: startResponse.content,
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([{
          text: "Sorry, I couldn't initialize the chat. Please try again later.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [videoId]);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      sender: 'user' as const,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await chatApi.sendMessage(videoId, inputValue);
      const aiMessage = {
        text: response.content,
        sender: 'ai' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        text: "Sorry, I couldn't process your message. Please try again.",
        sender: 'ai' as const,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Optional: Show a temporary "Copied!" message
        console.log('Message copied to clipboard');
      })
      .catch(err => console.error('Failed to copy: ', err));
  };

  return (
    <div className={styles.chatScreenContainer}>
      <main className={styles.chatMainContent}>
        <div className={styles.chatWindowArea} ref={chatWindowRef}>
          {isLoading ? (
            <div className={styles.loadingMessage}>
              Initializing chat...
            </div>
          ) : (
            <div className={styles.chatMessages}>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`${styles.messageGroup} ${message.sender === 'user' ? styles.userMessageGroup : styles.aiMessageGroup}`}
                >
                  {message.sender === 'ai' && (
                    <div className={styles.messageAvatar}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                      </svg>
                    </div>
                  )}
                  <div className={styles.messageContentWrapper}>
                    {message.sender === 'ai' && (
                      <div className={styles.messageSenderInfo}>
                        <span className={styles.senderName}>AI Assistant</span>
                        <span className={styles.senderStatus}>Online</span>
                      </div>
                    )}
                    <div className={styles.messageBubble}>
                      <p dangerouslySetInnerHTML={{ __html: message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/`(.*?)`/g, '<code>$1</code>')
                        .replace(/~~(.*?)~~/g, '<del>$1</del>')
                        .replace(/\n/g, '<br/>') }} />
                      <div className={styles.messageActions}>
                        <span className={styles.messageTimestamp}>{message.timestamp}</span>
                        <button 
                          className={styles.copyIcon} 
                          onClick={() => copyMessage(message.text)}
                          aria-label="Copy message"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.learnSuggestions}>
            <button 
              className={styles.suggestionsToggle} 
              onClick={() => setIsSuggestionsExpanded(!isSuggestionsExpanded)}
              aria-expanded={isSuggestionsExpanded}
            >
              <span>Learn suggestions</span>
              <svg 
                className={`${styles.toggleArrow} ${!isSuggestionsExpanded ? styles.collapsed : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {isSuggestionsExpanded && (
              <div className={styles.suggestionsContent}>
                <button 
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick("Can you explain the main concepts in this video?")}
                >
                  Explain main concepts
                </button>
                <button 
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick("What are the key takeaways from this video?")}
                >
                  Key takeaways
                </button>
                <button 
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick("Can you create a quiz based on this video?")}
                >
                  Create a quiz
                </button>
              </div>
            )}
          </div>
        </div>

        <footer className={styles.chatInputBar}>
          <div className={styles.inputBarTopRow}>
            <div className={styles.inputModeSelector}>
              <select aria-label="Select input mode">
                <option value="default">Default</option>
                <option value="creative">Creative</option>
                <option value="precise">Precise</option>
              </select>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            <button className={`${styles.tagButton} ${styles.learnPlusButton}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              Learn+
            </button>
            <button className={`${styles.tagButton} ${styles.filterButton}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 3H2l8 9.46V19l4 2v-8.46L22 3z"></path>
              </svg>
              Questions
            </button>
          </div>
          <div className={styles.inputBarMainRow}>
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              rows={1}
              disabled={isLoading}
            />
            <button 
              onClick={handleSendMessage}
              className={styles.sendMessageButton}
              aria-label="Send message"
              disabled={isLoading || !inputValue.trim()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Chat;
