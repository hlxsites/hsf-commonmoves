// This is a webhook that is called by Salesforce when a new lead is created.
// It will create a new word document in Office 365 with the lead information.

/*
   This is an example payload:

   {
  'topic': 'realestate/profile#add',
  'data': {
    'type': 'AddAction',
    'object': {
      'type': 'RealEstateAgent',
      'additionalName': 'Johnny,John',
      'address': {
        'type': 'PostalAddress',
        'name': 'Home',
        'addressCountry': 'USA',
        'addressCounty': 'Gotham County',
        'addressLocality': 'Gotham City',
        'addressRegion': 'New Jersey',
        'addressSubdivision': 'Gotham Heights',
        'postalCode': '10010',
        'postOfficeBoxNumber': 'Box 1234',
        'streetAddress': '1007 Mountain Gate Rd'
      },
      'certification': {
        'type': 'Certification',
        'name': 'e-Agent Certified',
        'issuedBy': {
          'type': 'RealEstateOrganization',
          'id': 'https://example.com/profile/card#me',
          'name': 'Gotham City Real Estate'
        },
        'issuedTo': {
          'type': 'RealEstateAgent',
          'id': 'http://example.com',
          'name': 'string'
        }
      },
      'contactPoint': {
        'type': 'ContactPoint',
        'name': 'Work',
        'telephone': '555-555-5555',
        'faxNumber': '555-555-5555',
        'email': 'bob@example.com',
        'url': 'https://www.facebook.com/hallandoates'
      },
      'email': 'user@example.com',
      'familyName': 'Smith',
      'givenName': 'John',
      'id': 'http://example.com',
      'identifier': {
        'bhhsconsumerid': '12345'
      },
      'image': [
        {
          'type': 'ImageObject',
          '@id': 'http://example.com',
          'id': 'http://user.example.com/public/logo/image.jpg',
          'name': 'image.jpg',
          'encodingFormat': 'image/jpeg',
          'about': 'http://user.example.com/profile/card#me',
          'url': 'http://user.example.com/public/profile/image.jpg'
        }
      ],
      'jobTitle': [
        'CEO'
      ],
      'memberOf': [
        {
          'type': 'OrganizationRole',
          'roleName': 'Owner',
          'memberOf': {
            'type': 'RealEstateOrganization',
            'id': 'http://orgid.example.com/profile/card#me'
          },
          'member': 'https://memberid.example.com/profile/card#me',
          'startDate': '2019-08-24T14:15:22Z',
          'endDate': '2019-08-24T14:15:22Z'
        }
      ],
      'name': 'string',
      'parentOrganization': [
        'http://example.com'
      ],
      'permit': {
        'type': 'Permit',
        'name': 'DRE Number',
        'issuedBy': {
          'type': 'State',
          'name': 'California'
        },
        'issuedThrough': {
          'type': 'Service',
          'name': 'Department of Real Estate'
        },
        'validIn': {},
        'validFrom': '2019-08-24T14:15:22Z',
        'validUntil': '2019-08-24T14:15:22Z'
      },
      'subOrganization': [
        'http://example.com'
      ],
      'url': 'http://example.com'
    }
  }
}
*/

import { Packer } from 'docx';
import generateWordDoc from './doc_creator.js';

// This function creates a new Word document in Office 365 with the lead information
function createWordDocument(context, lead) {
  // Get the access token from the cache
  const { accessToken } = context.bindings;

  // Create the Word document
  fetch.post(
    {
      url: 'https://graph.microsoft.com/v1.0/me/drive/root/children',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      json: {
        name: `${lead.givenName} ${lead.familyName}.docx`,
        file: {
          mimeType:
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          hashes: {
            quickXorHash: '',
          },
        },
      },
    },
    async (error, response, body) => {
      if (error) {
        context.log(`Error creating Word document: ${error}`);
      } else {
        context.log('Word document created successfully!');

        // Get the id of the newly created Word document
        const wordDocumentId = body.id;

        // Get the Word document content
        const wordDocumentContent = await Packer.toBuffer(generateWordDoc(lead));

        // Update the Word document content
        fetch.put(
          {
            url:
                `https://graph.microsoft.com/v1.0/me/drive/items/${wordDocumentId}/content`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: wordDocumentContent,
          },
          (err) => {
            if (err) {
              context.log(`Error updating Word document content: ${error}`);
            } else {
              context.log('Word document content updated successfully!');
            }
          },
        );
      }
    },
  );
}

// This is the main entry point for the webhook
export default function main(context, req) {
  // Get the lead information from the request body
  const lead = req.body;

  context.log('Webhook was triggered!');

  // Create a new Word document in Office 365 with the lead information
  createWordDocument(context, lead.data);

  // Send a response back to Salesforce
  context.res = {
    status: 200,
    body: 'OK',
  };

  context.done();
}
