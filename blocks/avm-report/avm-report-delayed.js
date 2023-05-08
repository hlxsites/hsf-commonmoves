function initGooglePlacesAPI() {
    const CALLBACK_FN = 'initAvmPlaces';
    const API_KEY = 'AIzaSyC-Ii5k8EaPU0ZuYnke7nb1uDnJ7g4O76M';
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.innerHTML = `
        window.${CALLBACK_FN} = function(){
            const input = document.querySelector('form input[name="avmaddress"]');
            const autocomplete = new google.maps.places.Autocomplete(input, {fields:['formatted_address'], types: ['establishment']});
        }
        const script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=${CALLBACK_FN}";
            document.head.append(script);
    `;
    document.head.append(script);
}

initGooglePlacesAPI();