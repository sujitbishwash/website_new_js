document.addEventListener('DOMContentLoaded', () => {
  // Basic setup for the sidebar component
  console.log('Sidebar component loaded.');

  // Example: Add 'active' class to clicked item (and remove from others)
  const navLinks = document.querySelectorAll('.sidebar-nav li a');

  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      // Remove 'active' class from all parent 'li' elements
      navLinks.forEach(l => l.parentElement.classList.remove('active'));
      
      // Add 'active' class to the clicked link's parent 'li'
      this.parentElement.classList.add('active');
      
      // Prevent default link behavior if it's just a demo
      // event.preventDefault(); 
      console.log('Clicked:', this.querySelector('span').textContent);
    });
  });

  // You can add more specific JavaScript interactions here if needed,
  // for example, handling submenu toggles or dynamic content loading.
});
