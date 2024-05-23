import { getMetadata } from '../../scripts/aem.js';
import {
  a, div, h1, ul, li, img,
} from '../../scripts/dom-helpers.js';

const getPhoneDiv = () => {
  let phoneDiv;
  let phoneUl;

  if (getMetadata('agent-direct-phone')) {
    phoneUl = ul({});
    phoneUl.append(li({}, 'Direct: ', getMetadata('agent-direct-phone')));
  }

  if (getMetadata('agent-office-phone')) {
    phoneUl = phoneUl || ul({});
    phoneUl.append(li({}, 'Office: ', getMetadata('agent-office-phone')));
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
  const websiteUrl = getMetadata('agent-website');

  if (websiteUrl) {
    const anchor = a({ href: websiteUrl, class: 'button', title: 'my website' }, 'my website');
    websiteDiv = div({ class: 'website' }, anchor);
  }

  return websiteDiv;
};

const getEmailDiv = () => {
  let emailDiv;
  const agentEmail = getMetadata('agent-email');

  if (agentEmail) {
    const anchor = a({ href: `mailto:${agentEmail}`, class: 'button', title: agentEmail }, agentEmail);
    emailDiv = div({ class: 'email' }, anchor);
  }

  return emailDiv;
};

const getImageDiv = () => {
  const agentPhoto = getMetadata('agent-photo');
  return div({ class: 'profile-image' }, img({ src: agentPhoto }));
};

export default async function decorate(block) {
  const profileImage = getImageDiv();
  const profileContent = div({ class: 'profile-content' },
    div({ class: 'name' }, h1({}, getMetadata('agent-name'))),
    div({ class: 'designation' }, getMetadata('agent-designation')),
    div({ class: 'license-number' }, getMetadata('agent-license-number')),
  );

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

  profileContent.append(div({ class: 'contact-me' }, a({ href: '#', class: 'button' }, 'Contact Me')));
  block.replaceChildren(profileImage, profileContent);
}
