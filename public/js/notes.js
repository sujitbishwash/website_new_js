document.addEventListener('DOMContentLoaded', () => {
  const notesContainer = document.getElementById('notesContainer');
  const noteInput = document.getElementById('noteInput');
  const toggleExpandBtn = document.getElementById('toggleExpandBtn');
  const iconExpand = toggleExpandBtn.querySelector('.icon-expand');
  const iconCollapse = toggleExpandBtn.querySelector('.icon-collapse');

  let isExpanded = false;

  const toggleView = () => {
    isExpanded = !isExpanded;
    notesContainer.classList.toggle('expanded', isExpanded);

    if (isExpanded) {
      iconExpand.style.display = 'none';
      iconCollapse.style.display = 'inline-block';
      toggleExpandBtn.setAttribute('aria-label', 'Collapse note editor');
      toggleExpandBtn.title = 'Collapse';
      // Optional: Focus input after expanding
      // noteInput.focus(); 
    } else {
      iconExpand.style.display = 'inline-block';
      iconCollapse.style.display = 'none';
      toggleExpandBtn.setAttribute('aria-label', 'Expand note editor');
      toggleExpandBtn.title = 'Expand';
    }
  };

  toggleExpandBtn.addEventListener('click', toggleView);

  // Keyboard accessibility for the button
  toggleExpandBtn.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent scrolling on Space
      toggleView();
    }
  });

  // Optional: Auto-resize textarea height based on content (simple version)
  // This is a basic implementation. For more robust auto-resizing,
  // you might need to calculate scrollHeight more carefully or use a hidden div.
  // noteInput.addEventListener('input', () => {
  //   if (!isExpanded) { // Only auto-resize in normal mode if desired
  //     noteInput.style.height = 'auto'; // Reset height
  //     noteInput.style.height = `${noteInput.scrollHeight}px`;
  //   }
  // });

  // Preserve text: Text is naturally preserved in the textarea element
  // unless explicitly cleared or the page is reloaded without saving.
});
