/*
 * API for interacting with the User system.
 */

const urlParams = new URLSearchParams(window.location.search);
export const DOMAIN = urlParams.get('env') === 'stage' ? 'ignite-staging.bhhs.com' : 'www.bhhs.com';
const API_URL = `https://${DOMAIN}/bin/bhhs`;

/**
 * Confirms if user is logged in or not
 * @return {boolean}
 */
export function isLoggedIn() {
  // Check if we have userDetails in session storage
  const userDetails = sessionStorage.getItem('userDetails');
  if (!userDetails) {
    return false;
  }

  // Check for .rwapiauth cookie
  const cookies = document.cookie.split(';');
  const rwapiauthCookie = cookies.find((c) => c.trim().startsWith('.rwapiauth'));
  if (rwapiauthCookie) {
    return true;
  }

  return false;
}

/**
 * Get user details if they are logged in, otherwise return null.
 * @returns {object} user details
 */
export function getUserDetails() {
  if (!isLoggedIn()) {
    return null;
  }

  const userDetails = sessionStorage.getItem('userDetails');
  return JSON.parse(userDetails);
}

async function fetchUserProfile(username) {
  const time = new Date().getTime();
  const profileResponse = await fetch(`${API_URL}/cregUserProfile?Email=${encodeURIComponent(username)}&_=${time}`);
  const json = profileResponse.json();
  return json;
}

/**
 * Attempt to update the user profile.  If successful, also update session copy.
 * Caller must look at response to see if it was successful, etc.
 * @param {Object} Updated user profile
 * @returns response object with status, null if user not logged in
 */
export async function updateProfile(profile) {
  const userDetails = getUserDetails();
  if (userDetails === null) {
    return null;
  }
  const existingProfile = userDetails.profile;

  // Update profile in backend, post object as name/value pairs
  const time = new Date().getTime();
  const url = `${API_URL}/cregUserProfile?Email=${encodeURIComponent(userDetails.username)}&_=${time}`;
  const postBody = {
    FirstName: profile.firstName,
    LastName: profile.lastName,
    MobilePhone: profile.mobilePhone,
    HomePhone: profile.homePhone,
    Email: profile.email,
    EmailNotifications: profile.emailNotifications || existingProfile.emailNotifications || false,
    ContactKey: existingProfile.contactKey,
    signInScheme: profile.signInScheme || existingProfile.signInScheme || 'default',
    HomeAddress1: profile.homeAddress1,
    HomeAddress2: profile.homeAddress2,
    HomeCity: profile.homeCity,
    HomeStateOrProvince: profile.homeStateOrProvince,
    HomePostalCode: profile.homePostalCode,
    Language: profile.language,
    Currency: profile.currency,
    UnitOfMeasure: profile.measure,
  };
  const response = fetch(url, {
    method: 'PUT',
    credentials: 'include',
    mode: 'cors',
    body: new URLSearchParams(postBody).toString(),
  });

  if (response.ok) {
    // Update profile in session storage using a merge
    userDetails.profile = { ...existingProfile, ...profile };
    sessionStorage.setItem('userDetails', JSON.stringify(userDetails));
  }

  return response;
}

/**
 * Logs the user out silently.
 */
export function logout() {
  // Remove session storage
  sessionStorage.removeItem('userDetails');

  // Remove cookies
  const cookies = document.cookie.split(';');
  cookies.forEach((c) => {
    const cookie = c.trim();
    if (cookie.startsWith('.rwapiauth')) {
      document.cookie = `${cookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  });
}

/**
 * Authenticates the user based on the username and password.
 *
 * @param {object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @param {function<Response>} failureCallback Callback provided reponse object.
 * @return {Promise<Object>} User details if login is successful.
 */
export async function login(credentials, failureCallback = null) {
  const url = `${API_URL}/cregLoginServlet`;
  const resp = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: new URLSearchParams({
      Username: credentials.username,
      Password: credentials.password,
    }).toString(),
  });
  if (resp.ok) {
    // Extract contactKey and externalID from response JSON.  Store in session
    const responseJson = await resp.json();
    const { contactKey } = responseJson;
    // const { hsfconsumerid } = JSON.parse(externalID);

    const profile = await fetchUserProfile(credentials.username);

    const sessionData = {
      contactKey,
      // externalID,
      // hsfconsumerid,
      profile,
      username: credentials.username,
    };
    sessionStorage.setItem('userDetails', JSON.stringify(sessionData));
    return sessionData;
  }
  logout();
  if (failureCallback) {
    failureCallback(resp);
  }
  return null;
}
