document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('linkInputModalOverlay');
  const cancelButton = document.getElementById('cancelButton');
  const addButton = document.getElementById('addButton');
  const linkUrlInput = document.getElementById('linkUrl');
  const linkNotesTextarea = document.getElementById('linkNotes');

  if (cancelButton) {
    cancelButton.addEventListener('click', () => {
      console.log('Cancel button clicked');
      // Example: Hide the modal
      // if (modalOverlay) modalOverlay.style.display = 'none';
    });
  }

  if (addButton) {
    addButton.addEventListener('click', () => {
      const url = linkUrlInput ? linkUrlInput.value : '';
      const notes = linkNotesTextarea ? linkNotesTextarea.value : '';
      console.log('Add button clicked');
      console.log('URL:', url);
      console.log('Notes:', notes);
      // Redirect to dashboard.html
      window.location.href = 'dashboard.html';
    });
  }

  // To make this modal truly pluggable, you might want functions to show/hide it:
  // window.showLinkInputModal = () => {
  //   if (modalOverlay) modalOverlay.style.display = 'flex';
  // };
  // window.hideLinkInputModal = () => {
  //   if (modalOverlay) modalOverlay.style.display = 'none';
  // };

  // By default, the modal is visible as per link-input.html.
  // If you want it hidden by default and shown by a trigger,
  // you would set `display: none;` on `.modal-overlay` in CSS
  // and then call `showLinkInputModal()` when needed.
});
