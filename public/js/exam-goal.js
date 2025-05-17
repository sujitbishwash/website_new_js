document.addEventListener('DOMContentLoaded', () => {
  const examTypeSelect = document.getElementById('examType');
  const specificExamSelect = document.getElementById('specificExam');
  const continueButton = document.getElementById('continueButton');

  const examMappings = {
    SSC: ['SSC CGL', 'SSC CHSL', 'SSC MTS'],
    RRB: ['RRB NTPC', 'RRB Group D', 'RRB Assistant Loco Pilot', 'RRB Technician'],
    Banks: ['IBPS PO', 'IBPS Clerk', 'IBPS RRB', 'SBI PO', 'SBI Clerk'],
    'Class 10': ['CBSE', 'ICSE', 'State Board'],
  };

  function updateSpecificExamOptions() {
    const selectedType = examTypeSelect.value;
    specificExamSelect.innerHTML = '<option value="">-- Select Specific Exam / Board --</option>'; // Reset

    if (selectedType && examMappings[selectedType]) {
      examMappings[selectedType].forEach(exam => {
        const option = document.createElement('option');
        option.value = exam;
        option.textContent = exam;
        specificExamSelect.appendChild(option);
      });
      specificExamSelect.disabled = false;
    } else {
      specificExamSelect.disabled = true;
    }
    checkButtonState();
  }

  function checkButtonState() {
    const examTypeSelected = examTypeSelect.value !== '';
    const specificExamSelected = specificExamSelect.value !== '';
    continueButton.disabled = !(examTypeSelected && specificExamSelected);
  }

  examTypeSelect.addEventListener('change', updateSpecificExamOptions);
  specificExamSelect.addEventListener('change', checkButtonState);

  if (continueButton) {
    continueButton.addEventListener('click', () => {
      if (!continueButton.disabled) {
        // Redirect to the Link Input component page
        window.location.href = 'link-input.html';
      }
    });
  }

  // Initial check
  updateSpecificExamOptions();
});
