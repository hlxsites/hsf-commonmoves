import {
  getUserDetails,
  requestPasswordReset,
  saveProfile,
  isLoggedIn,
  onProfileUpdate,
} from '../../scripts/apis/user.js';

let form = {};

function asHtml(string) {
  const div = document.createElement('div');
  div.innerHTML = string.trim();
  return div.firstChild;
}

let cachedDropdownValues = {};
async function getDropdownValues() {
  if (Object.keys(cachedDropdownValues).length === 0) {
    const response = await fetch('/account/dropdown-values.json');
    cachedDropdownValues = await response.json();
  }
  return cachedDropdownValues;
}

function prepareTabs(block) {
  const tabContainer = block.querySelector('tabs');
  const tabs = tabContainer.querySelectorAll('tab');
  const buttonBar = asHtml('<nav class="tab-buttons"></nav>');

  tabs.forEach((tab) => {
    tab.classList.add('tab');
    const tabButton = asHtml(`<button>${tab.getAttribute('name')}</button>`);
    buttonBar.append(tabButton);

    tabButton.onclick = () => {
      buttonBar.childNodes.forEach((button) => button.classList.remove('active'));
      tabs.forEach((tabContent) => tabContent.classList.remove('active'));
      tabButton.classList.add('active');
      tab.classList.add('active');
    };
  });

  tabContainer.insertBefore(buttonBar, tabContainer.firstChild);
  buttonBar.childNodes[0].click();
}

function populateDropdown(select, data) {
  select.innerHTML += data.map((d) => `<option value="${d.value}">${d.display}</option>`).join('');
}

async function populateDropdowns(block) {
  const dropdownValues = await getDropdownValues();
  populateDropdown(block.querySelector('select[name="country"]'), dropdownValues.country.data);
  populateDropdown(block.querySelector('select[name="language"]'), dropdownValues.language.data);
  populateDropdown(block.querySelector('select[name="currency"]'), dropdownValues.currency.data);
  populateDropdown(block.querySelector('select[name="measure"]'), dropdownValues.measure.data);
}

function populateForm(block) {
  const { profile } = getUserDetails() || { profile: {} };

  form = {
    firstName: block.querySelector('input[name="firstName"]'),
    lastName: block.querySelector('input[name="lastName"]'),
    email: block.querySelector('input[name="email"]'),
    mobilePhone: block.querySelector('input[name="mobilePhone"]'),
    homePhone: block.querySelector('input[name="homePhone"]'),
    country: block.querySelector('select[name="country"]'),
    address1: block.querySelector('input[name="address1"]'),
    address2: block.querySelector('input[name="address2"]'),
    city: block.querySelector('input[name="city"]'),
    stateOrProvince: block.querySelector('input[name="stateOrProvince"]'),
    postalCode: block.querySelector('input[name="postalCode"]'),
    language: block.querySelector('select[name="language"]'),
    currency: block.querySelector('select[name="currency"]'),
    measure: block.querySelector('select[name="measure"]'),
  };

  Object.keys(form).forEach((key) => {
    form[key].value = profile[key] || '';
    // If field is required, append asterisk to placeholder
    if (form[key].required && !form[key].placeholder.endsWith('*')) {
      form[key].placeholder += '*';
    }
  });
}

function clearNotification() {
  const note = document.querySelector('.profile-wrapper .notification');
  if (note) {
    note.parentNode.removeChild(note);
  }
}

function showNotification(type, iconHtml, message, message2) {
  clearNotification();
  let secondPart = '';
  if (message2) {
    secondPart = `
    ${message2.startsWith('<') ? '' : '<p>'}
    ${message2}
    ${message2.startsWith('<') ? '' : '</p>'}
    `;
  }
  const errDiv = asHtml(`
    <div class="notification ${type}">
      <p>
        ${iconHtml}
        ${message}
      </p>
      ${secondPart}
    </div>
  `);
  const nav = document.querySelector('.profile-wrapper nav');
  nav.parentNode.insertBefore(errDiv, nav.nextSibling);
}

function showError(err) {
  showNotification('error', '<img src="/icons/info_circle.svg" aria-hidden="true" alt="Error" class="info-circle">', 'There was a problem processing your request.', err);
}

function showSuccess(message) {
  showNotification('success', '<svg class="success-circle"><use xlink:href="/icons/icons.svg#success"></use></svg>', message);
}

async function getErrorResponseText(errResponse) {
  if (typeof errResponse.message !== 'string') {
    return errResponse.message && errResponse.message.text ? errResponse.message.text() : 'We\'re sorry, but something went wrong.';
  }
  return errResponse.message;
}

function setupPasswordReset(block) {
  const resetPassword = block.querySelector('.reset-password');
  resetPassword.addEventListener('click', async () => {
    try {
      const response = await requestPasswordReset();
      if (response.status === 200) {
        showSuccess('Your password has been reset.<br>Check your email for a link to create a new password.');
      } else {
        throw new Error(await response.text());
      }
    } catch (errResponse) {
      showError(await getErrorResponseText(errResponse));
    }
  });
}

function validateForm() {
  if (!isLoggedIn()) {
    throw new Error('You must be logged in to update your profile.');
  }

  const errors = [];
  Object.keys(form).forEach((key) => {
    if (form[key].required && !form[key].value) {
      let fieldName = form[key].placeholder || key;
      if (fieldName.endsWith('*')) {
        fieldName = fieldName.slice(0, -1);
      }
      errors.push(`${fieldName} is required.`);
    }
  });
  if (errors.length > 0) {
    throw new Error(`<ul><li>${errors.join('</li><li>')}</li></ul>`);
  }
}

async function performSave() {
  validateForm();
  const data = {};
  Object.keys(form).forEach((key) => {
    data[key] = form[key].value;
  });
  const response = await saveProfile(data);
  if (response.status === 200) {
    return response;
  }
  const message = await response.text() || 'There was an error saving changes.';
  throw new Error(message);
}

function setupSaveHandlers(block) {
  const saveButtons = block.querySelectorAll('button.save');
  saveButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        // disable all save buttons
        saveButtons.forEach((b) => {
          b.disabled = true;
        });

        validateForm();
        await performSave();

        showSuccess('You have successfully saved your profile.');
      } catch (errResponse) {
        showError(await getErrorResponseText(errResponse));
      } finally {
        // Re-enable all save buttons
        saveButtons.forEach((b) => {
          b.disabled = false;
        });
      }
    });
  });
}

export default async function decorate(block) {
  block.innerHTML = `
    <tabs class="profile-tabs">
      <tab name="Contact Info">
        <input type="text" name="firstName" placeholder="First Name" required />
        <input type="text" name="lastName" placeholder="Last Name" required />
        <input type="text" name="email" placeholder="Email Address" required />
        <p class="help">Please manage your email preferences by using "Unsubscribe" option at the bottom of emails you receive.</p>
        <input type="text" name="mobilePhone" placeholder="Mobile Phone" />
        <input type="text" name="homePhone" placeholder="Home Phone" />
        <p class="help">
          By providing your telephone number, you are giving permission to Berkshire Hathaway HomeServices and a franchisee
          member of the Berkshire Hathaway HomeServices real estate network to communicate with you by phone or text,
          including automated means, even if your telephone number appears on any "Do Not Call" list. A phone number is not
          required in order to receive real estate brokerage services. Message/data rates may apply. For more about how we will
          use your contact information, please review our <a href="https://www.bhhs.com/terms-of-use">Terms of Use</a>
          and <a href="https://www.bhhs.com/privacy-policy">Privacy Policy.</a>
        </p>
        <button class="save">Save</button>
      </tab>
      <tab name="Change Password">
        <p class="help">Click reset, and we will send you a email containing a reset password link.</p>
        <button class="reset-password">Reset Password</button>
      </tab>
      <tab name="Address">
        <select name="country">
          <option value="">Country</option>
        </select>
        <input type="text" name="address1" placeholder="Street Address 1" />
        <input type="text" name="address2" placeholder="Street Address 2" />
        <input type="text" name="city" placeholder="City" />
        <input type="text" name="stateOrProvince" placeholder="State" />
        <input type="text" name="postalCode" placeholder="Zip" />
        <button class="save">Save</button>
      </tab>
      <tab name="Regional Preferences">
        <p>Set the language for emails and this site.</p>
        <h4>Language</h4>
        <select name="language"></select>
        <p>Set the currency and unit of measurement for this site.</p>
        <h4>Currency</h4>
        <select name="currency"></select>
        <h4>Unit of Measurement</h4>
        <select name="measure"></select>
        <button class="save">Save</button>
      </tab>
    </tabs>
  `;

  prepareTabs(block);
  populateDropdowns(block);
  populateForm(block);
  setupPasswordReset(block);
  setupSaveHandlers(block);
  onProfileUpdate(() => populateForm(block));
}
