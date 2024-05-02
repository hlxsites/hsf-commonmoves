/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */
/**
 * Sanitizes a string for use as class name.
 * @param {string} name The unsanitized string
 * @returns {string} The class name
 */
export function toClassName(name) {
  return typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    : '';
}

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */
  transform: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    // define the main element: the one that will be transformed to Markdown
    const main = document.body;

    // attempt to remove non-content elements
    WebImporter.DOMUtils.remove(main, [
      'style',
      '.cmp-google-analytics-ad-tracking',
      '.cmp-utility-header',
      '.cmp-page-header-navigation',
      '.row--header',
      '.cmp-footer-franchisee',
      'iframe',
      'noscript',
    ]);

    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
    WebImporter.rules.convertIcons(main, document);

    const path = ((u) => {
      let p = new URL(u).pathname;
      if (p.endsWith('/')) {
        p = `${p}index`;
      }
      return decodeURIComponent(p)
        .toLowerCase()
        .replace(/\.html$/, '')
        .replace(/[^a-z0-9/]/gm, '-');
    })(url);

    const offices = [...document.querySelectorAll('article.cmp-card')];
    return offices
      .filter((office) => office.querySelector('div.cmp-card__content > h3'))
      .map((office) => {
        const result = document.createElement('div');
        // grab information needed
        const location = office.querySelector('.cmp-card__title').textContent;
        const description = 'Meet our agents and contact our office to learn how Berkshire Hathaway HomeServices can help you buy or sell your property.';
        const type = office.querySelector('.cmp-card__label p');
        const address = office.querySelector('article.cmp-card .cmp-card__content .cmp-card__desc p:first-of-type').innerHTML.replace(/^<br>/, '');
        const address1 = address.split('<br>')[0];
        const address2 = address.split('<br>')[1].trim();
        const [city, stateZip] = address2.split(', ');
        const [state, zip] = stateZip.split(' ');
        const phone = address.split('<br>')[2].replace('Office', 'main');
        let fax = address.split('<br>')[3];
        if (fax) fax = fax.replace('Office Fax', 'fax');
        const contact = office.querySelector('article.cmp-card .cmp-card__content .cmp-card__desc p:last-of-type');
        const [contactName, contactTitle, contactPhone, contactEmail] = contact.innerText.split('\n');
        const image = office.querySelector('.cmp-card__image a picture img');
        const title = `${location} Office Detail Page`;

        // build first block
        const cell1 = document.createElement('div');
        cell1.innerHTML = `Berkshire Hathaway HomeServices<br>Commonwealth Real Estate<br>${phone} | ${fax}<br><a href='/contact-us'>Contact Us</a>`;
        const cell2 = document.createElement('div');
        cell2.innerHTML = `<h4>Location</h4>${address1}<br>${address2}<br><a href='https://maps.google.com/maps?q=${address1.replaceAll(' ', '+')}%2C+${city.replaceAll(' ', '+')}%2C+${state}+${zip}'>Directions</a>`;
        const cells = [['Columns'], [cell1, cell2]];
        const table = WebImporter.DOMUtils.createTable(cells, document);
        result.append(table);

        // Add Agents block
        const agentsBlock = [['Offices (agents)'], ['https://main--hsf-commonmoves--hlxsites.hlx.page/offices.json?sheet=agents']];
        result.append(WebImporter.DOMUtils.createTable(agentsBlock, document));

        // Build metadata block
        const meta = {};
        meta.Title = title;
        meta.Description = description;
        meta.Location = location;
        meta.Type = type;
        meta.Address = address1;
        meta.Phone = address.split('<br>')[2];
        meta.Fax = address.split('<br>')[3];
        meta['City State Zip'] = address2;
        meta['Contact Name'] = contactName;
        meta['Contact Title'] = contactTitle;
        meta['Contact Phone'] = contactPhone;
        meta['Contact Email'] = contactEmail;
        meta.Image = image;
        const metadataBlock = WebImporter.Blocks.getMetadataBlock(document, meta);
        result.append(metadataBlock);
        const filename = toClassName(location.trim());
        return ({
          element: result,
          path: WebImporter.FileUtils.sanitizePath(`offices/${filename}`),
        });
      });
  },
};
