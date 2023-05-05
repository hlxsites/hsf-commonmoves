import {
  showModal,
} from '../../scripts/util.js';

async function observeAddressEntry() {
  // const { Map } = await google.maps.importLibrary("places");
  const input = document.querySelector('form > input[name="avmaddress"]');
  const autocomplete = new google.maps.places.PlaceAutocompleteElement({ inputElement: input });
}

let alreadyDeferred = false;
function initGooglePlacesAPI() {
  const CALLBACK_FN = 'avm_places_callback';
  const API_KEY = 'AIzaSyC-Ii5k8EaPU0ZuYnke7nb1uDnJ7g4O76M';
  if (alreadyDeferred) {
    return;
  }

  alreadyDeferred = true;
  window[CALLBACK_FN] = observeAddressEntry;
  const script = document.createElement('script');
  script.type = 'text/partytown';
  script.innerHTML = `
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=${CALLBACK_FN}';
    document.head.append(script);
  `;
  document.head.append(script);
}

export default async function decorate(block) {
  const form = document.createElement('form');
  form.setAttribute('action', '/home-value');
  form.innerHTML = `
    <div class="avm-input">
      <input type="text" name="avmaddress" placeholder="Enter Address" aria-label="Enter Address" autocomplete="off">
      <input type="text" name="avmunit" placeholder="Unit #" aria-label="Unit #" autocomplete="off">
    </div>
    <button type="submit" aria-label="Get Report">Get Report</button>
  `;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const address = form.querySelector('input[name="avmaddress"]').value;
    if (!address) {
      showModal('Please enter valid address.<br/>Example: 1234 Main Street, Apt 123, New Milford, CT 06776');
      return;
    }

    let redirect = `/home-value?address=${address}`;

    const unit = form.querySelector('input[name="avmunit"]').value;
    if (unit) {
      redirect += `&unit=${unit}`;
    }
    window.location = redirect;
    initGooglePlacesAPI();
  });
  block.append(form);
}
