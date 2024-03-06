### Property Search 

Search bar contains all filters, details on what will be searched.

* Opening advanced search, or changing viewport to < 900px, synchronizes the Property attributes from the bar to the advanced filter list.

* Closing the advanced search, changing the viewport to > 900px, or applying the parameters, synchronizes the Property attributes from the advanced list, to the bar.

#### Event order

1. Clicking the search button or using the `Apply` button in advanced filters, converts the parameters into a JSON object and stores it in session storage.

1. Search bar updates the URL and Hash location

1. Hash change initiates the search on the property result listing block.
