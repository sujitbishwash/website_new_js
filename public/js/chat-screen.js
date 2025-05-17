document.addEventListener('DOMContentLoaded', () => {
  const chatTabsContainer = document.querySelector('.chat-tabs');
  const chatTabButtons = document.querySelectorAll('.chat-tab-button');
  const chatMessagesContainer = document.querySelector('.chat-messages');
  const messageInput = document.getElementById('chat-message-input');
  const sendMessageButton = document.getElementById('send-message-button');
  const suggestionsToggle = document.querySelector('.suggestions-toggle');
  const suggestionsContent = document.querySelector('.suggestions-content');
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  const userMessageTemplate = document.getElementById('user-message-template');
  const chatWindowArea = document.querySelector('.chat-window-area');
  const menuToggleButton = document.querySelector('.menu-toggle-btn');
  const chatSidebar = document.querySelector('.chat-sidebar');
  const chatMainContent = document.querySelector('.chat-main-content');


  // Tab switching
  if (chatTabsContainer) {
    chatTabsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('chat-tab-button')) {
        chatTabButtons.forEach(button => button.classList.remove('active'));
        e.target.classList.add('active');
        // Add logic here to change tab content if necessary
        console.log('Switched to tab:', e.target.dataset.tab);
      }
    });
  }

  // Auto-resize textarea
  if (messageInput) {
    messageInput.addEventListener('input', () => {
      messageInput.style.height = 'auto'; // Reset height
      messageInput.style.height = `${messageInput.scrollHeight}px`; // Set to scroll height
    });
  }

  // Send message
  const appendMessage = (text, sender = 'user') => {
    if (!text.trim()) return;

    const messageGroup = userMessageTemplate.cloneNode(true);
    messageGroup.removeAttribute('id');
    messageGroup.style.display = 'flex'; // Make it visible

    const messageTextElement = messageGroup.querySelector('.user-message-text');
    const timestampElement = messageGroup.querySelector('.message-timestamp');
    
    if (messageTextElement) messageTextElement.textContent = text;
    if (timestampElement) timestampElement.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (sender === 'user') {
      messageGroup.classList.add('user-message-group');
      messageGroup.classList.remove('ai-message-group'); // Ensure it's not AI
    } else { // For AI responses (not implemented in this version, but structure is there)
      messageGroup.classList.add('ai-message-group');
      messageGroup.classList.remove('user-message-group');
      // Potentially change avatar and sender name for AI
    }
    
    chatMessagesContainer.appendChild(messageGroup);
    
    // Auto-scroll to the latest message
    chatWindowArea.scrollTop = chatWindowArea.scrollHeight;

    if (sender === 'user') {
      messageInput.value = '';
      messageInput.style.height = 'auto'; // Reset textarea height
      messageInput.focus();
    }
  };

  if (sendMessageButton && messageInput) {
    sendMessageButton.addEventListener('click', () => {
      appendMessage(messageInput.value, 'user');
    });

    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevent new line on Enter
        appendMessage(messageInput.value, 'user');
      }
    });
  }

  // Learn suggestions toggle
  if (suggestionsToggle && suggestionsContent) {
    suggestionsToggle.addEventListener('click', () => {
      const isExpanded = suggestionsToggle.getAttribute('aria-expanded') === 'true';
      suggestionsToggle.setAttribute('aria-expanded', !isExpanded);
      // suggestionsContent.style.display = isExpanded ? 'none' : 'flex'; // CSS handles this now
      chatWindowArea.scrollTop = chatWindowArea.scrollHeight; // Scroll after toggle
    });
  }

  // Handle suggestion item click
  if (suggestionItems) {
    suggestionItems.forEach(item => {
      item.addEventListener('click', () => {
        // appendMessage(item.textContent, 'user'); // Send suggestion as user message
        // Or, fill input field:
        messageInput.value = item.textContent;
        messageInput.focus();
        messageInput.style.height = 'auto';
        messageInput.style.height = `${messageInput.scrollHeight}px`;
      });
    });
  }

  // Copy message functionality
  chatMessagesContainer.addEventListener('click', (e) => {
    const copyButton = e.target.closest('.copy-icon');
    if (copyButton) {
      const messageBubble = copyButton.closest('.message-bubble');
      if (messageBubble) {
        const messageText = messageBubble.querySelector('p')?.textContent;
        if (messageText) {
          navigator.clipboard.writeText(messageText)
            .then(() => {
              // Optional: Show a temporary "Copied!" message
              const originalIcon = copyButton.innerHTML;
              copyButton.innerHTML = 'Copied!';
              setTimeout(() => {
                copyButton.innerHTML = originalIcon;
              }, 1500);
            })
            .catch(err => console.error('Failed to copy: ', err));
        }
      }
    }
  });

  // Sidebar toggle for mobile/tablet
  if (menuToggleButton && chatSidebar && chatMainContent) {
    menuToggleButton.addEventListener('click', () => {
      chatSidebar.classList.toggle('open');
      // Optional: Add an overlay or adjust main content margin
      // chatMainContent.classList.toggle('sidebar-open'); 
    });

    // Close sidebar if clicking outside of it on mobile/tablet
    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 1024) { // Only on smaller screens
        const isClickInsideSidebar = chatSidebar.contains(event.target);
        const isClickOnToggleButton = menuToggleButton.contains(event.target);
        if (chatSidebar.classList.contains('open') && !isClickInsideSidebar && !isClickOnToggleButton) {
          chatSidebar.classList.remove('open');
        }
      }
    });
  }
  
  // Initial scroll to bottom if content overflows
  chatWindowArea.scrollTop = chatWindowArea.scrollHeight;
});
