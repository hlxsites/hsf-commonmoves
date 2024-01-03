import assert from 'assert';
import { Packer, Document } from 'docx';
import fs from 'fs';
import generateWordDoc from '../doc_creator.js';

const testContact = {
  type: 'AddAction',
  object: {
    type: 'RealEstateAgent',
    additionalName: 'Johnny,John',
    address: {
      type: 'PostalAddress',
      name: 'Home',
      addressCountry: 'USA',
      addressCounty: 'Gotham County',
      addressLocality: 'Gotham City',
      addressRegion: 'New Jersey',
      addressSubdivision: 'Gotham Heights',
      postalCode: '10010',
      postOfficeBoxNumber: 'Box 1234',
      streetAddress: '1007 Mountain Gate Rd',
    },
    certification: {
      type: 'Certification',
      name: 'e-Agent Certified',
      issuedBy: {
        type: 'RealEstateOrganization',
        id: 'https://example.com/profile/card#me',
        name: 'Gotham City Real Estate',
      },
      issuedTo: {
        type: 'RealEstateAgent',
        id: 'http://example.com',
        name: 'string',
      },
    },
    contactPoint: {
      type: 'ContactPoint',
      name: 'Work',
      telephone: '555-555-5555',
      faxNumber: '555-555-5555',
      email: 'bob@example.com',
      url: 'https://www.facebook.com/hallandoates',
    },
    email: 'user@example.com',
    familyName: 'Smith',
    givenName: 'John',
    id: 'http://example.com',
    identifier: {
      bhhsconsumerid: '12345',
    },
    image: [
      {
        type: 'ImageObject',
        '@id': 'http://example.com',
        id: 'https://hsflibrary.s3-us-west-2.amazonaws.com/bhhsagents/1107231/profileimages/1107231-profileimage.jpg',
        name: 'image.jpg',
        encodingFormat: 'image/jpeg',
        about: 'http://user.example.com/profile/card#me',
        url: 'https://hsflibrary.s3-us-west-2.amazonaws.com/bhhsagents/1107231/profileimages/1107231-profileimage.jpg',
      },
    ],
    jobTitle: [
      'Sales Associate',
    ],
    memberOf: [
      {
        type: 'OrganizationRole',
        roleName: 'Owner',
        memberOf: {
          type: 'RealEstateOrganization',
          id: 'http://orgid.example.com/profile/card#me',
        },
        member: 'https://memberid.example.com/profile/card#me',
        startDate: '2019-08-24T14:15:22Z',
        endDate: '2019-08-24T14:15:22Z',
      },
    ],
    name: 'string',
    parentOrganization: [
      'http://example.com',
    ],
    permit: {
      type: 'Permit',
      name: 'DRE Number',
      issuedBy: {
        type: 'State',
        name: 'California',
      },
      issuedThrough: {
        type: 'Service',
        name: 'Department of Real Estate',
      },
      validIn: {},
      validFrom: '2019-08-24T14:15:22Z',
      validUntil: '2019-08-24T14:15:22Z',
    },
    subOrganization: [
      'http://example.com',
    ],
    url: 'http://example.com',
  },
};

// Mocha test for doc_creator
describe('doc_creator', () => {
  it('should create a document', async () => {
    const doc = await generateWordDoc(testContact);
    // Assert that doc is an instance of Document using assert
    assert(Object.getPrototypeOf(doc) === Document.prototype);
    // Write the doc to a file in /tmp
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('/tmp/test.docx', buffer);
  });
});
