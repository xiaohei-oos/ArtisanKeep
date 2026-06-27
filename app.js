/**
 * Texas Cottage Food Label Generator
 * Main Application Logic
 */

// ===== State Management =====
const state = {
  currentStep: 1,
  businessName: '',
  businessAddress: '',
  businessPhone: '',
  productName: '',
  netWeight: '',
  ingredients: '',
  allergens: '',
  isRefrigerated: false,
  dshsRegNumber: '',
  salesChannel: 'direct',
};

// ===== DOM References =====
const pages = {
  home: document.getElementById('page-home'),
  questionnaire: document.getElementById('page-questionnaire'),
  results: document.getElementById('page-results'),
};

// ===== Navigation =====
function showPage(pageId) {
  Object.keys(pages).forEach((key) => {
    pages[key].classList.add('hidden');
  });
  pages[pageId].classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== Toast Notification =====
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

// ===== Step Navigation =====
function goToStep(step) {
  // Hide all steps
  for (let i = 1; i <= 4; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    if (stepEl) stepEl.classList.add('hidden');
  }
  // Show target step
  const target = document.getElementById(`step-${step}`);
  if (target) target.classList.remove('hidden');

  state.currentStep = step;
  updateProgressBar();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar() {
  const steps = document.querySelectorAll('.progress-step');
  const lines = document.querySelectorAll('.progress-line');

  steps.forEach((stepEl) => {
    const stepNum = parseInt(stepEl.dataset.step, 10);
    stepEl.classList.remove('active', 'completed');
    if (stepNum < state.currentStep) {
      stepEl.classList.add('completed');
    } else if (stepNum === state.currentStep) {
      stepEl.classList.add('active');
    }
  });

  lines.forEach((lineEl) => {
    const lineNum = parseInt(lineEl.dataset.line, 10);
    lineEl.classList.toggle('completed', lineNum < state.currentStep);
  });
}

// ===== Form Validation =====
function validateStep(step) {
  switch (step) {
    case 1:
      return state.businessName.trim() !== '' && state.businessAddress.trim() !== '';
    case 2:
      return (
        state.productName.trim() !== '' &&
        state.netWeight.trim() !== '' &&
        state.ingredients.trim() !== '' &&
        state.allergens.trim() !== ''
      );
    case 3:
      return true; // Radio always has a value
    case 4:
      return true; // Radio always has a value
    default:
      return false;
  }
}

// ===== Collect Form Data =====
function collectStepData(step) {
  switch (step) {
    case 1:
      state.businessName = document.getElementById('businessName').value.trim();
      state.businessAddress = document.getElementById('businessAddress').value.trim();
      state.businessPhone = document.getElementById('businessPhone').value.trim();
      break;
    case 2:
      state.productName = document.getElementById('productName').value.trim();
      state.netWeight = document.getElementById('netWeight').value.trim();
      state.ingredients = document.getElementById('ingredients').value.trim();
      state.allergens = document.getElementById('allergens').value.trim();
      break;
    case 3:
      state.isRefrigerated = document.querySelector('input[name="refrigeration"]:checked').value === 'yes';
      state.dshsRegNumber = document.getElementById('dshsRegNumber').value.trim();
      break;
    case 4:
      state.salesChannel = document.querySelector('input[name="salesChannel"]:checked').value;
      break;
  }
}

// ===== Restore Form Data =====
function restoreStepData(step) {
  switch (step) {
    case 1:
      document.getElementById('businessName').value = state.businessName;
      document.getElementById('businessAddress').value = state.businessAddress;
      document.getElementById('businessPhone').value = state.businessPhone;
      break;
    case 2:
      document.getElementById('productName').value = state.productName;
      document.getElementById('netWeight').value = state.netWeight;
      document.getElementById('ingredients').value = state.ingredients;
      document.getElementById('allergens').value = state.allergens;
      break;
    case 3:
      const refValue = state.isRefrigerated ? 'yes' : 'no';
      document.querySelector(`input[name="refrigeration"][value="${refValue}"]`).checked = true;
      document.getElementById('dshsRegNumber').value = state.dshsRegNumber;
      toggleRefrigerationExtra();
      break;
    case 4:
      document.querySelector(`input[name="salesChannel"][value="${state.salesChannel}"]`).checked = true;
      toggleThirdPartyExtra();
      break;
  }
}

// ===== Toggle Extra Sections =====
function toggleRefrigerationExtra() {
  const isRefrigerated = document.querySelector('input[name="refrigeration"]:checked').value === 'yes';
  const extra = document.getElementById('refrigeration-extra');
  if (isRefrigerated) {
    extra.classList.remove('hidden');
  } else {
    extra.classList.add('hidden');
  }
}

function toggleThirdPartyExtra() {
  const salesChannel = document.querySelector('input[name="salesChannel"]:checked').value;
  const extra = document.getElementById('third-party-extra');
  if (salesChannel === 'third-party' || salesChannel === 'both') {
    extra.classList.remove('hidden');
  } else {
    extra.classList.add('hidden');
  }
}

// ===== Label Generation =====
function getTodayFormatted() {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function generateLabelHTML() {
  const productionDate = getTodayFormatted();
  const needsProductionDate =
    state.isRefrigerated ||
    state.salesChannel === 'third-party' ||
    state.salesChannel === 'both';

  let html = '';

  // Business info
  html += `<div class="label-business-name">${escapeHTML(state.businessName)}</div>`;
  html += `<div class="label-address">${escapeHTML(state.businessAddress)}</div>`;
  if (state.businessPhone) {
    html += `<div class="label-phone">${escapeHTML(state.businessPhone)}</div>`;
  }

  // Product info
  html += `<div class="label-product-name">${escapeHTML(state.productName)}</div>`;
  html += `<div class="label-net-weight">Net Wt. ${escapeHTML(state.netWeight)}</div>`;

  // Ingredients
  html += `<div class="label-section-title">Ingredients</div>`;
  html += `<div class="label-section-text">${escapeHTML(state.ingredients)}</div>`;

  // Allergens
  html += `<div class="label-section-title">Allergens</div>`;
  html += `<div class="label-section-text">${escapeHTML(state.allergens)}</div>`;

  // Mandatory Disclaimer (always required)
  html += `<div class="label-disclaimer">THIS PRODUCT WAS PRODUCED IN A PRIVATE RESIDENCE THAT IS NOT SUBJECT TO GOVERNMENTAL LICENSING OR INSPECTION.</div>`;

  // Production date (if required)
  if (needsProductionDate) {
    html += `<div class="label-production-date"><strong>Production Date:</strong> ${productionDate}</div>`;
  }

  // DSHS registration (if refrigerated)
  if (state.isRefrigerated && state.dshsRegNumber) {
    html += `<div class="label-dshs"><strong>DSHS Registration:</strong> ${escapeHTML(state.dshsRegNumber)}</div>`;
  }

  // Safe handling instructions (if refrigerated)
  if (state.isRefrigerated) {
    html += `<div class="label-safe-handling">SAFE HANDLING INSTRUCTIONS: Keep refrigerated at 40&deg;F (4&deg;C) or below. Consume within 3-5 days of opening. Do not leave at room temperature for more than 2 hours.</div>`;
  }

  return html;
}

function generateLabelText() {
  const productionDate = getTodayFormatted();
  const needsProductionDate =
    state.isRefrigerated ||
    state.salesChannel === 'third-party' ||
    state.salesChannel === 'both';

  let text = '';

  text += `${state.businessName}\n`;
  text += `${state.businessAddress}\n`;
  if (state.businessPhone) {
    text += `${state.businessPhone}\n`;
  }
  text += `\n`;
  text += `${state.productName}\n`;
  text += `Net Wt. ${state.netWeight}\n`;
  text += `\n`;
  text += `INGREDIENTS: ${state.ingredients}\n`;
  text += `\n`;
  text += `ALLERGENS: ${state.allergens}\n`;
  text += `\n`;
  text += `THIS PRODUCT WAS PRODUCED IN A PRIVATE RESIDENCE THAT IS NOT SUBJECT TO GOVERNMENTAL LICENSING OR INSPECTION.\n`;
  text += `\n`;

  if (needsProductionDate) {
    text += `Production Date: ${productionDate}\n`;
  }

  if (state.isRefrigerated && state.dshsRegNumber) {
    text += `DSHS Registration: ${state.dshsRegNumber}\n`;
  }

  if (state.isRefrigerated) {
    text += `\n`;
    text += `SAFE HANDLING INSTRUCTIONS: Keep refrigerated at 40°F (4°C) or below. Consume within 3-5 days of opening. Do not leave at room temperature for more than 2 hours.\n`;
  }

  return text;
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderLabel() {
  const preview = document.getElementById('label-preview');
  preview.innerHTML = generateLabelHTML();
}

// ===== Export Functions =====
async function copyLabelText() {
  const text = generateLabelText();
  try {
    await navigator.clipboard.writeText(text);
    showToast('Label text copied to clipboard!');
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('Label text copied to clipboard!');
  }
}

function downloadTxt() {
  const text = generateLabelText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const filename = `${sanitizeFilename(state.productName || 'food-label')}-label.txt`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('TXT file downloaded!');
}

async function downloadPng() {
  const preview = document.getElementById('label-preview');
  const btn = document.getElementById('btn-download-png');

  btn.disabled = true;
  btn.textContent = 'Generating...';

  try {
    const canvas = await html2canvas(preview, {
      backgroundColor: '#FFFEF9',
      scale: 2,
      logging: false,
    });

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const filename = `${sanitizeFilename(state.productName || 'food-label')}-label.png`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('PNG image downloaded!');
    }, 'image/png');
  } catch (err) {
    console.error('PNG export failed:', err);
    showToast('Failed to generate PNG. Please try again.');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2.5" y="4.5" width="15" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="7" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M17.5 13.5l-3.5-3.5L9 15l-2-2-4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Download PNG
    `;
  }
}

function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) || 'food-label';
}

// ===== Reset State =====
function resetState() {
  state.currentStep = 1;
  state.businessName = '';
  state.businessAddress = '';
  state.businessPhone = '';
  state.productName = '';
  state.netWeight = '';
  state.ingredients = '';
  state.allergens = '';
  state.isRefrigerated = false;
  state.dshsRegNumber = '';
  state.salesChannel = 'direct';

  // Reset form fields
  document.getElementById('businessName').value = '';
  document.getElementById('businessAddress').value = '';
  document.getElementById('businessPhone').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('netWeight').value = '';
  document.getElementById('ingredients').value = '';
  document.getElementById('allergens').value = '';
  document.getElementById('dshsRegNumber').value = '';
  document.querySelector('input[name="refrigeration"][value="no"]').checked = true;
  document.querySelector('input[name="salesChannel"][value="direct"]').checked = true;
  document.getElementById('refrigeration-extra').classList.add('hidden');
  document.getElementById('third-party-extra').classList.add('hidden');

  updateProgressBar();
}

// ===== Event Listeners =====
function initEventListeners() {
  // Home page: Start button
  document.getElementById('btn-start').addEventListener('click', () => {
    resetState();
    goToStep(1);
    showPage('questionnaire');
  });

  // Step 1: Next
  document.getElementById('btn-step-1-next').addEventListener('click', () => {
    collectStepData(1);
    if (!validateStep(1)) {
      showToast('Please fill in your business name and address.');
      return;
    }
    goToStep(2);
    restoreStepData(2);
  });

  // Step 1: Back to home
  document.getElementById('btn-back-home').addEventListener('click', () => {
    showPage('home');
  });

  // Step 2: Back
  document.getElementById('btn-step-2-back').addEventListener('click', () => {
    collectStepData(2);
    goToStep(1);
    restoreStepData(1);
  });

  // Step 2: Next
  document.getElementById('btn-step-2-next').addEventListener('click', () => {
    collectStepData(2);
    if (!validateStep(2)) {
      showToast('Please fill in all product details.');
      return;
    }
    goToStep(3);
    restoreStepData(3);
  });

  // Step 3: Back
  document.getElementById('btn-step-3-back').addEventListener('click', () => {
    collectStepData(3);
    goToStep(2);
    restoreStepData(2);
  });

  // Step 3: Next
  document.getElementById('btn-step-3-next').addEventListener('click', () => {
    collectStepData(3);
    goToStep(4);
    restoreStepData(4);
  });

  // Step 4: Back
  document.getElementById('btn-step-4-back').addEventListener('click', () => {
    collectStepData(4);
    goToStep(3);
    restoreStepData(3);
  });

  // Step 4: Generate
  document.getElementById('btn-generate').addEventListener('click', () => {
    collectStepData(4);
    renderLabel();
    showPage('results');
  });

  // Refrigeration toggle
  document.querySelectorAll('input[name="refrigeration"]').forEach((radio) => {
    radio.addEventListener('change', toggleRefrigerationExtra);
  });

  // Sales channel toggle
  document.querySelectorAll('input[name="salesChannel"]').forEach((radio) => {
    radio.addEventListener('change', toggleThirdPartyExtra);
  });

  // Export buttons
  document.getElementById('btn-copy').addEventListener('click', copyLabelText);
  document.getElementById('btn-download-txt').addEventListener('click', downloadTxt);
  document.getElementById('btn-download-png').addEventListener('click', downloadPng);

  // Results actions
  document.getElementById('btn-new-label').addEventListener('click', () => {
    resetState();
    goToStep(1);
    showPage('questionnaire');
  });

  document.getElementById('btn-edit-label').addEventListener('click', () => {
    goToStep(1);
    restoreStepData(1);
    showPage('questionnaire');
  });
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  updateProgressBar();
  showPage('home');
});
