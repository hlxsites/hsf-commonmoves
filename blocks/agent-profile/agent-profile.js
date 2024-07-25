import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import {
  a, div, h1, ul, li, img, span,
} from '../../scripts/dom-helpers.js';
import { getDesign, loadTemplateCSS } from '../../scripts/util.js';

const getPhoneDiv = () => {
  let phoneDiv;
  let phoneUl;

  if (getMetadata('direct-phone')) {
    phoneUl = ul();
    phoneUl.append(li('Direct: ', getMetadata('direct-phone')));
  }

  if (getMetadata('office-phone')) {
    phoneUl = phoneUl || ul();
    phoneUl.append(li('Office: ', getMetadata('office-phone')));
  }

  if (phoneUl) {
    phoneDiv = div({ class: 'phone' });
    phoneDiv.append(phoneUl);
    return phoneDiv;
  }

  return phoneDiv;
};

const getWebsiteDiv = () => {
  let websiteDiv;
  const websiteUrl = getMetadata('website');

  if (websiteUrl) {
    const text = 'my website';
    const anchor = a({ href: websiteUrl, title: text, 'aria-label': text }, text);
    websiteDiv = div({ class: 'website' }, anchor);
  }

  return websiteDiv;
};

const getEmailDiv = () => {
  let emailDiv;
  const agentEmail = getMetadata('email');

  if (agentEmail) {
    const anchor = a({ href: `mailto:${agentEmail}`, title: agentEmail, 'aria-label': agentEmail }, agentEmail);
    emailDiv = div({ class: 'email' }, anchor);
  }

  return emailDiv;
};

const getImageDiv = () => {
  const agentPhoto = getMetadata('photo');
  return div({ class: 'profile-image' }, img({ src: agentPhoto, alt: getMetadata('name'), loading: 'lazy' }));
};

const getSocialDiv = () => {
  const socialDiv = div({ class: 'social' });
  let socialUl;

  ['facebook', 'instagram', 'linkedin'].forEach((x) => {
    const url = getMetadata(x);
    socialUl = socialUl || ul();
    if (url) {
      const socialLi = li(a({
        href: url, class: x, title: x, 'aria-label': x,
      }, span({ class: `icon icon-${x}` })));
      socialUl.append(socialLi);
    }
  });

  if (socialUl) {
    socialDiv.append(socialUl);
    return socialDiv;
  }

  return null;
};

const defaultDesign = (block) => {
  const profileImage = getImageDiv();
  const profileContent = div({ class: 'profile-content' },
    div({ class: 'name' }, h1(getMetadata('name'))),
    div({ class: 'designation' }, getMetadata('designation')),
  );

  const licenseNumber = getMetadata('license-number');
  if (licenseNumber) {
    profileContent.append(div({ class: 'license-number' }, `LIC# ${licenseNumber}`));
  }

  const emailDiv = getEmailDiv();
  if (emailDiv) {
    profileContent.append(emailDiv);
  }

  const websiteDiv = getWebsiteDiv();
  if (websiteDiv) {
    profileContent.append(websiteDiv);
  }

  const phoneDiv = getPhoneDiv();
  if (phoneDiv) {
    profileContent.append(phoneDiv);
  }

  const contactMeText = 'Contact Me';
  profileContent.append(div({ class: 'contact-me' },
    a({ href: '#', title: contactMeText, 'aria-label': contactMeText }, contactMeText)));

  const socialDiv = getSocialDiv();
  if (socialDiv) {
    profileContent.append(socialDiv);
  }
  decorateIcons(profileContent);
  block.replaceChildren(profileImage, profileContent);
};

const getCol = (list) => {
  const colsUl = ul();
  list.split(',').forEach((x) => {
    colsUl.append(li(x.trim()));
  });
  return colsUl;
};

const viewMoreOnClickDesign1 = (name, anchor, block) => {
  anchor.addEventListener('click', (event) => {
    event.preventDefault();
    if (anchor.classList.contains(`${name}-view-more`)) {
      anchor.classList.remove(`${name}-view-more`);
      anchor.classList.add(`${name}-view-less`);
      block.querySelector(`.${name}`).classList.remove('hide');
      block.querySelector(`.${name}-truncate`).classList.add('hide');
    } else {
      anchor.classList.remove(`${name}-view-less`);
      anchor.classList.add(`${name}-view-more`);
      block.querySelector(`.${name}`).classList.add('hide');
      block.querySelector(`.${name}-truncate`).classList.remove('hide');
    }
  });
};

const changeAboutDesign1 = (profileContent) => {
  const name = 'about';
  const about = profileContent.querySelector(`.${name}`);
  const threshold = 245;

  if (about.textContent.length > threshold) {
    about.classList.add('hide');
    profileContent.append(div({ class: `${name}-truncate` },
      `${about.textContent.substring(0, threshold)}...`));

    const anchor = a({ class: `${name}-view-more`, href: '#' });
    profileContent.append(anchor);
    viewMoreOnClickDesign1(name, anchor, profileContent);
  }
};

const changeLangAndPADesign1 = (langOrPA, name) => {
  const threshold = 3;
  const liItems = langOrPA.querySelectorAll(`.${name} li`);
  const lan = langOrPA.querySelector(`.${name}`);

  if (liItems.length > threshold) {
    lan.classList.add('hide');
    const tempUl = ul();
    Array.from(lan.querySelectorAll('li'))
      .slice(0, threshold).forEach((liItem) => {
        const tempLi = li(liItem.textContent);
        tempUl.append(tempLi);
      });

    langOrPA.append(div({ class: `${name}-truncate` }, tempUl));
    const anchor = a({ class: `${name}-view-more`, href: '#' });
    langOrPA.append(anchor);
    viewMoreOnClickDesign1(name, anchor, langOrPA);
  }
};

/**
 * Design 1
 * @param {*} block
 */
const design1 = (block) => {
  const profileImage = getImageDiv();
  const profileContent = div({ class: 'profile-content' },
    div({ class: 'name' }, h1(getMetadata('name'))),
    div({ class: 'designation' }, getMetadata('designation')),
  );

  const licenseNumber = getMetadata('license-number');
  if (licenseNumber) {
    profileContent.append(div({ class: 'license-number' }, `LIC# ${licenseNumber}`));
  }

  const emailDiv = getEmailDiv();
  if (emailDiv) {
    profileContent.append(emailDiv);
  }

  const websiteDiv = getWebsiteDiv();
  if (websiteDiv) {
    profileContent.append(websiteDiv);
  }

  const phoneDiv = getPhoneDiv();
  if (phoneDiv) {
    profileContent.append(phoneDiv);
  }

  const aboutText = getMetadata('about');
  const accreditations = getMetadata('professional-accreditations');
  const languages = getMetadata('languages');

  profileContent.append(div({ class: 'about' }, aboutText));
  changeAboutDesign1(profileContent);

  const professionalAccreditationsLangDiv = div({ class: 'professional-acc-lang' });
  professionalAccreditationsLangDiv.append(div({ class: 'professional-accreditations-text' }, 'accreditations'));
  const professionalAccreditationsDiv = div({ class: 'professional-accreditations' }, getCol(accreditations));
  professionalAccreditationsLangDiv.append(professionalAccreditationsDiv);
  changeLangAndPADesign1(professionalAccreditationsLangDiv, 'professional-accreditations');

  const languagesDiv = div({ class: 'languages' }, getCol(languages));
  professionalAccreditationsLangDiv.append(div({ class: 'languages-text' }, 'languages'));
  professionalAccreditationsLangDiv.append(languagesDiv);
  changeLangAndPADesign1(professionalAccreditationsLangDiv, 'languages');
  profileContent.append(professionalAccreditationsLangDiv);

  changeLangAndPADesign1(profileContent);
  changeLangAndPADesign1(profileContent);

  const contactMeText = 'Contact Me';
  profileContent.append(div({ class: 'contact-me' },
    a({ href: '#', title: contactMeText, 'aria-label': contactMeText }, contactMeText)));

  decorateIcons(profileContent);
  block.replaceChildren(profileImage, profileContent);
};

export default async function decorate(block) {
  const blockName = block.getAttribute('data-block-name');
  const designType = getMetadata('template');
  const func = getDesign(designType, defaultDesign, design1);
  loadTemplateCSS(blockName, designType);

  if (func !== null) {
    func(block);
  }
}
