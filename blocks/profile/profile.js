import { getUserDetails, requestPasswordReset, updateProfile, isLoggedIn } from '../../scripts/apis/user.js';

function prepareTabs(block) {
  const tabs = block.querySelector('tabs');
  const tabNames = tabs.querySelectorAll('tab-name');
  const tabContents = tabs.querySelectorAll('content');
  const tabButtons = [];
  const tabContentsArray = [];

  tabNames.forEach((tabName) => {
    tabButtons.push(tabName);
  });

  tabContents.forEach((tabContent) => {
    tabContentsArray.push(tabContent);
  });

  tabButtons.forEach((tabButton) => {
    tabButton.addEventListener('click', () => {
      const tabName = tabButton.innerHTML;
      tabButtons.forEach((button) => {
        button.classList.remove('active');
      });
      tabButton.classList.add('active');
      tabContentsArray.forEach((tabContent) => {
        if (tabContent.innerHTML.includes(tabName)) {
          tabContent.classList.add('active');
        } else {
          tabContent.classList.remove('active');
        }
      });
    });
  });

  tabButtons[0].click();
}

function populateDropdowns(block) {
  const countryDropdown = block.querySelector('select[name="country"]');
  const languageDropdown = block.querySelector('select[name="language"]');
  const currencyDropdown = block.querySelector('select[name="currency"]');
  const measureDropdown = block.querySelector('select[name="measure"]');
  const countries = [
    { name: 'United States', value: 'US' },
    { name: 'Canada', value: 'CA' },
  ];
  const languages = [
    { name: 'English', value: 'en' },
    { name: 'French', value: 'fr' },
  ];
  const currencies = [
    { name: 'US Dollar', value: 'USD' },
    { name: 'Canadian Dollar', value: 'CAD' },
  ];
  const measures = [
    { name: 'Imperial', value: 'imperial' },
    { name: 'Metric', value: 'metric' },
  ];

  countries.forEach((country) => {
    const option = document.createElement('option');
    option.value = country.value;
    option.innerHTML = country.name;
    countryDropdown.append(option);
  });

  languages.forEach((language) => {
    const option = document.createElement('option');
    option.value = language.value;
    option.innerHTML = language.name;
    languageDropdown.append(option);
  });

  currencies.forEach((currency) => {
    const option = document.createElement('option');

    option.value = currency.value;
    option.innerHTML = currency.name;
    currencyDropdown.append(option);
  });

  measures.forEach((measure) => {
    const option = document.createElement('option');
    option.value = measure.value;
    option.innerHTML = measure.name;
    measureDropdown.append(option);
  });
}

function setupPasswordReset(block) {
  const resetPassword = block.querySelector('.reset-password');
  resetPassword.addEventListener('click', () => {
    requestPasswordReset();
  }
}

function populateForm(block) {
  const profile = getUserDetails().profile;

  if (profile) {
    const firstName = block.querySelector('input[name="firstName"]');
    const lastName = block.querySelector('input[name="lastName"]');
    const email = block.querySelector('input[name="email"]');
    const mobilePhone = block.querySelector('input[name="mobilePhone"]');
    const homePhone = block.querySelector('input[name="homePhone"]');
    const country = block.querySelector('select[name="country"]');
    const address1 = block.querySelector('input[name="address1"]');
    const address2 = block.querySelector('input[name="address2"]');
    const city = block.querySelector('input[name="city"]');
    const stateOrProvince = block.querySelector('input[name="stateOrProvince"]');
    const postalCode = block.querySelector('input[name="postalCode"]');
    const language = block.querySelector('select[name="language"]');
    const currency = block.querySelector('select[name="currency"]');
    const measure = block.querySelector('select[name="measure"]');

    firstName.value = profile.firstName;
    lastName.value = profile.lastName;
    email.value = profile.email;
    mobilePhone.value = profile.mobilePhone;
    homePhone.value = profile.homePhone;
    country.value = profile.country;
    address1.value = profile.address1;

    if (profile.address2) {
      address2.value = profile.address2;
    }

    city.value = profile.city;
    stateOrProvince.value = profile.stateOrProvince;
    postalCode.value = profile.postalCode;
    language.value = profile.language;
    currency.value = profile.currency;
    measure.value = profile.measure;
  }
}

export default async function decorate(block) {
  block.innerHTML = `
    <tabs class="profile-tabs">
      <tab><tab-name>Contact Info</tab-name>
        <content>
          <input type="text" name="firstName" placeholder="First Name" required />
          <input type="text" name="lastName" placeholder="Last Name" required />
          <input type="text" name="email" placeholder="Email" required />
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
        </content>
      </tab>
      <tab><tab-name>Change Password</tab-name>
        <content>
          <p class="help">Click reset, and we will send you a email containing a reset password link.</p>
          <button class="reset-password">Reset Password</button>
        </content>
      </tab>
      <tab><tab-name>Address</tab-name>
        <content>
          <select name="country" required>
            <option value="">Country</option>
          </select>
          <input type="text" name="address1" placeholder="Address 1" />
          <input type="text" name="address2" placeholder="Address 2" />
          <input type="text" name="city" placeholder="City" />
          <input type="text" name="stateOrProvince" placeholder="State" />
          <input type="text" name="postalCode" placeholder="Zip Code" />
        </content>
      </tab>
      <tab><tab-name>Regional Preferences</tab-name>
        <content>
          <p>Set the language for emails and this site.</p>
          <h2>Language</h2>
          <select name="language" required>
            <option value="">Language</option>
          </select>
          <p>Set the language and unit of measurement for this site.
          <h2>Currency</h2>
          <select name="currency" required>
            <option value="">Currency</option>
          </select>
          <h2>Unit of Measurement</h2>
          <select name="measure" required>
            <option value="">Unit of Measurement</option>
          </select>
        </content>
      </tab>
    </tabs>
  `;

  prepareTabs(block);
  setupPasswordReset(block);
  populateDropdowns(block);
  populateForm(block);
}
