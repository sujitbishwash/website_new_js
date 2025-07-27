document.addEventListener('DOMContentLoaded', () => {
  const pricingBoxes = document.querySelectorAll('.pricing-box');
  const selectPlanBtn = document.getElementById('selectPlanBtn');

  let selectedPlan = null;

  pricingBoxes.forEach(box => {
    box.addEventListener('click', () => {
      // Remove 'selected' class from all boxes
      pricingBoxes.forEach(pb => pb.classList.remove('selected'));
      
      // Add 'selected' class to the clicked box
      box.classList.add('selected');
      selectedPlan = box.dataset.plan;
      
      // Enable the button
      selectPlanBtn.disabled = false;
    });
  });

  selectPlanBtn.addEventListener('click', () => {
    if (selectedPlan) {
      // In a real application, you would proceed with the selected plan.
      // For this example, we'll just log it.
      alert(`Plan selected: ${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}`);
      console.log('Selected plan:', selectedPlan);
      // You might want to redirect or show a confirmation modal here.
    } else {
      // This case should ideally not be reached if button is properly disabled
      alert('Please select a plan first.');
    }
  });
});
