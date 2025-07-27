document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburgerMenu');
  const leftSidebar = document.getElementById('leftSidebar');
  const mainContentArea = document.getElementById('mainContentArea');
  const rightSidebarContentFrame = document.getElementById('rightSidebarContentFrame');
  const rightSidebarPlaceholder = document.getElementById('rightSidebarPlaceholder');
  const rightSidebarButtons = document.querySelectorAll('.right-sidebar-tab-button');
  const loadAIChatBtn = document.getElementById('loadAIChatBtn'); 
  // const loadQuestionBtn = document.getElementById('loadQuestionBtn'); // If specific logic needed
  // const loadFlashcardsBtn = document.getElementById('loadFlashcardsBtn'); // If specific logic needed

  const closeIconSvg = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
    </svg>`;
  const menuIconSvg = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
    </svg>`;

  function updateHamburgerIcon(isSidebarOpenOrExpanded) {
    if (isSidebarOpenOrExpanded) {
      hamburgerMenu.innerHTML = closeIconSvg;
      hamburgerMenu.setAttribute('aria-expanded', 'true');
    } else {
      hamburgerMenu.innerHTML = menuIconSvg;
      hamburgerMenu.setAttribute('aria-expanded', 'false');
    }
  }

  function handleLeftSidebarToggle() {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      leftSidebar.classList.toggle('open'); // For mobile overlay
      const isOpen = leftSidebar.classList.contains('open');
      updateHamburgerIcon(isOpen);
    } else {
      leftSidebar.classList.toggle('expanded'); // For desktop hide/expand
      const isExpanded = leftSidebar.classList.contains('expanded');
      updateHamburgerIcon(isExpanded);
    }
  }

  if (hamburgerMenu && leftSidebar && mainContentArea) {
    // Initial state setup
    const isMobileInitial = window.innerWidth <= 768;
    if (isMobileInitial) {
      leftSidebar.classList.remove('expanded'); 
      leftSidebar.classList.remove('open'); 
      updateHamburgerIcon(false);
    } else {
      // Desktop: starts hidden (no 'expanded' class)
      leftSidebar.classList.remove('open'); 
      leftSidebar.classList.remove('expanded'); 
      updateHamburgerIcon(false); // Hamburger shows menu icon
    }

    hamburgerMenu.addEventListener('click', handleLeftSidebarToggle);

    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 768 && leftSidebar.classList.contains('open')) {
        if (!leftSidebar.contains(event.target) && !hamburgerMenu.contains(event.target)) {
          leftSidebar.classList.remove('open');
          updateHamburgerIcon(false);
        }
      }
    });

    window.addEventListener('resize', () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        if (leftSidebar.classList.contains('expanded')) {
          leftSidebar.classList.remove('expanded');
        }
        // Update icon based on 'open' state for mobile
        updateHamburgerIcon(leftSidebar.classList.contains('open'));
      } else {
        // Resizing to Desktop
        if (leftSidebar.classList.contains('open')) {
          leftSidebar.classList.remove('open'); // Close mobile overlay
        }
        // Update icon based on 'expanded' state for desktop
        updateHamburgerIcon(leftSidebar.classList.contains('expanded'));
      }
    });
  }

  // Main Content Tabs (Chapters/Transcripts)
  const mainTabButtons = document.querySelectorAll('.main-tab-button');
  const mainTabPanels = document.querySelectorAll('.main-tab-panel');

  mainTabButtons.forEach(button => {
    button.addEventListener('click', () => {
      mainTabButtons.forEach(btn => btn.classList.remove('active'));
      mainTabPanels.forEach(panel => panel.classList.remove('active'));
      button.classList.add('active');
      const targetPanelId = button.getAttribute('data-tab-target');
      const targetPanel = document.querySelector(targetPanelId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
    button.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    });
  });

  // Right Sidebar Content Loading
  if (rightSidebarContentFrame && rightSidebarButtons.length > 0) {
    rightSidebarButtons.forEach(button => {
      button.addEventListener('click', () => {
        const contentSrc = button.getAttribute('data-content-src');
        if (contentSrc) {
          rightSidebarContentFrame.src = contentSrc;
          if (rightSidebarPlaceholder) {
            rightSidebarPlaceholder.classList.add('hidden');
          }
        }
        rightSidebarButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
      button.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          button.click();
        }
      });
    });

    // Load AI Chat by default
    if (loadAIChatBtn) {
        const defaultSrc = loadAIChatBtn.getAttribute('data-content-src');
        if (defaultSrc) {
            rightSidebarContentFrame.src = defaultSrc;
            if (rightSidebarPlaceholder) {
                rightSidebarPlaceholder.classList.add('hidden');
            }
            loadAIChatBtn.classList.add('active');
        }
    } else if (rightSidebarButtons.length > 0) {
        // Fallback to first button if AI chat button not specifically found
        const firstButton = rightSidebarButtons[0];
        const defaultSrc = firstButton.getAttribute('data-content-src');
        if (defaultSrc) {
            rightSidebarContentFrame.src = defaultSrc;
            if (rightSidebarPlaceholder) {
                rightSidebarPlaceholder.classList.add('hidden');
            }
            firstButton.classList.add('active');
        }
    }
  }
});
