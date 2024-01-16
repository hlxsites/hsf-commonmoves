/*
 * API for interacting with the User system.
 */

const urlParams = new URLSearchParams(window.location.search);
export const DOMAIN = urlParams.get('env') === 'stage' ? 'ignite-staging.bhhs.com' : 'www.bhhs.com';
const API_URL = `https://${DOMAIN}/bin/bhhs`;

/**
 * Authenticates the user based on the username and password.
 *
 * @param {object} credentials
 * @param {string} credentials.username
 * @param {string} credentials.password
 * @return {Promise<void>}
 */
export async function login(credentials) {
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
    console.log('Success!');
  }
}
