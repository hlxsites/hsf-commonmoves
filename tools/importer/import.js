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

class BlockBuilder {
  constructor(document, pageMetadata = {}) {
    this.doc = document;
    this.children = [];
    this.pageMetadata = pageMetadata;
  }

  jumpTo(e) {
    this.current=e;
    return this;
  }

  up() {return this.jumpTo(this.current?.parentElement);}

  upToTag(tag) {
    while (this.current && this.current?.tagName !== tag.toUpperCase()) this.up();
    return this;
  }

  append(e) {
    this.current ? this.current.append(e) : this.children.push(e);
    return this;
  }

  replaceChildren(parent) {
    this.#writeSectionMeta().metaBlock("Metadata", this.pageMetadata);
    return parent.replaceChildren(...this.children);
  }

  element(tag, attrs={}) {
    const e = this.doc.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    return this.append(e).jumpTo(e);
  }

  text(text) {return this.append(this.doc.createTextNode(text));}

  withText(text) {return this.text(text).up();}

  section(meta = {}) {return (this.children.length ? this.#writeSectionMeta().element("hr").up() : this).withSectionMetadata(meta);}

  withSectionMetadata(meta) {
    this.sectionMeta = meta;
    return this;
  }

  addSectionMetadata(key, value) {
    (this.sectionMeta = this.sectionMeta || {})[key] = value;
    return this;
  }

  block(name, colspan=2, createRow=true) {
    this.endBlock().element("table").element("tr").element("th", {colspan:colspan}).text(name);
    return createRow ? this.row() : this;
  }

  row(attrs={}) {return this.upToTag("table").element("tr").element("td", attrs);}

  column(attrs={}) {return this.upToTag("tr").element("td", attrs);}

  endBlock() {return this.jumpTo(undefined);}

  metaBlock(name, meta) {
    if (meta && Object.entries(meta).length > 0) {
      this.block(name, 2, false);
      for (const [k, v] of Object.entries(meta)) this.row().text(k).column().text(v);
      this.endBlock();
    }
    return this;
  }

  #writeSectionMeta() {return this.metaBlock("Section Metadata", this.sectionMeta).withSectionMetadata(undefined);}
}

const getMetadata = (document, prop) => {
  const metaElement = document.querySelector(`head meta[property='${prop}']`)
  return metaElement?.content;
}

const createMetadata = (document) => {
    const meta = {};

    const title = getMetadata(document, 'og:title');
    if (title) {
      meta.Title = title.replace(/[\n\t]/gm, '');
    }
  
    const desc = getMetadata(document, "og:description");
    if (desc) {
      meta.Description = desc;
    }

    const community = document.querySelector("#community-detail-hero-component meta[itemProp='name']")?.content;
    meta["LiveBy Community"]=community;
  
    const img = document.querySelector('[property="og:image"]');
    if (img && img.content) {
      const el = document.createElement('img');
      el.src = img.content;
      meta.Image = el;
    }
  
    return meta;
  };
  
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
    transformDOM: ({
      // eslint-disable-next-line no-unused-vars
      document, url, html, params,
    }) => {
      // Extract metadata
      const metadata = createMetadata(document);

      // define the main element: the one that will be transformed to Markdown
      const builder = new BlockBuilder(document, metadata);
      
      // Create hero
      const heroImageSrc = document.querySelector('#community-detail-hero-component div[data-cy="hero"] meta[itemprop="image"]')?.content;
      const community = metadata["LiveBy Community"];
      const heroSubtitle = document.querySelector('#directory-search h2').textContent;
      builder
        .element("img", {src: heroImageSrc}).up()
        .element("h1").withText(community)
        .element("h2").withText(heroSubtitle)
        .addSectionMetadata("Style", "narrow");

      // TOC
      const canonicalName = community.toLowerCase().replaceAll(' ','-');
      builder
        .section({Style:"no-padding"})
        .block("TOC (tabs)")
        .text("Jump To")
        .element("ul")
        .element("li").element("a", {href:`#${canonicalName}-demographics`}).withText('Demographics').up()
        .element("li").element("a", {href:`#schools-near-${canonicalName}`}).withText('Schools').up()
        .element("li").element("a", {href:`#${canonicalName}-map`}).withText('Map').up()
        .element("li").element("a", {href:`#living-in-${canonicalName}`}).withText('Amenities').up()
      
      // Demographics
      const demographicsAtttribution = document.querySelector("#demographics > div > h2 div[class^='styles_info-content']");
      builder
        .section({Style:"bottom-border"})
        .element("h2").withText(`${community} Demographics`)
        .block("Info Mouseover").append(demographicsAtttribution)
        .block("LiveBy Demographics")

      // Schools
      const schoolDiggerInfo = document.querySelector("#schools > div > h2 div[class^='styles_info-content']");
      const schoolText = document.querySelector("#schools > div > p");

      builder
        .section({Style: "bottom-border, center"})
        .element("h2").withText(`Schools Near ${community}`)
        .block("Info Mouseover").append(schoolDiggerInfo).endBlock()
        .append(schoolText)
        .block("LiveBy Schools")
        .text("Per page").column().text("500")
      
      // Maps
      builder
        .section({Style: "bottom-border"})
        .element("h2").withText(`${community} Map`)
        .block("LiveBy Map")
        .block("Listings")
        .section()
        .metaBlock("Property Listing", {
          Title: "Nearby Homes for Sale",
          MinPrice: 800000,
          PageSize: 8,
          "Sort Direction": "Descending",
          "Search Type": "Community"
        })

      // Amenities
      const amenitiesInfo = document.querySelector("#amenities > div > h2 div[class^='styles_info-content']");
      const amenitiesContent = document.querySelector("#amenities > div > p");
      builder
        .section({Style: "center"})
        .element("h2").withText(`Living in ${community}`)
        .block("Info Mouseover")
        .append(amenitiesInfo)
        .endBlock()
        .append(amenitiesContent)
        .block("LiveBy Yelp")
        .text("Amenities").column().element("ul")
        .element("li").withText("Dining")
        .element("li").withText("Shopping")
        .element("li").withText("Active")
        .element("li").withText("Nightlife")
        .element("li").withText("Beauty")

      // Build document and store into main element
      builder.replaceChildren(document.body);
      
      return document.body;
    },
  
    /**
     * Return a path that describes the document being transformed (file name, nesting...).
     * The path is then used to create the corresponding Word document.
     * @param {HTMLDocument} document The document
     * @param {string} url The url of the page imported
     * @param {string} html The raw html (the document is cleaned up during preprocessing)
     * @param {object} params Object containing some parameters given by the import process.
     * @return {string} The path
     */
    generateDocumentPath: ({
      // eslint-disable-next-line no-unused-vars
      document, url, html, params,
    }) => WebImporter.FileUtils.sanitizePath(new URL(url).pathname.replace(/\.html$/, '').replace(/\/$/, '')),
  };