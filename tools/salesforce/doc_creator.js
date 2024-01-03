/*
Given a JSON payload as input, generate a word doc file and return the file path.

Payload looks like this:
{
    "type": "AddAction",
    "object": {
      "type": "RealEstateAgent",
      "additionalName": "Johnny,John",
      "address": {
        "type": "PostalAddress",
        "name": "Home",
        "addressCountry": "USA",
        "addressCounty": "Gotham County",
        "addressLocality": "Gotham City",
        "addressRegion": "New Jersey",
        "addressSubdivision": "Gotham Heights",
        "postalCode": "10010",
        "postOfficeBoxNumber": "Box 1234",
        "streetAddress": "1007 Mountain Gate Rd"
      },
      "certification": {
        "type": "Certification",
        "name": "e-Agent Certified",
        "issuedBy": {
          "type": "RealEstateOrganization",
          "id": "https://example.com/profile/card#me",
          "name": "Gotham City Real Estate"
        },
        "issuedTo": {
          "type": "RealEstateAgent",
          "id": "http://example.com",
          "name": "string"
        }
      },
      "contactPoint": {
        "type": "ContactPoint",
        "name": "Work",
        "telephone": "555-555-5555",
        "faxNumber": "555-555-5555",
        "email": "bob@example.com",
        "url": "https://www.facebook.com/hallandoates"
      },
      "email": "user@example.com",
      "familyName": "Smith",
      "givenName": "John",
      "id": "http://example.com",
      "identifier": {
        "bhhsconsumerid": "12345"
      },
      "image": [
        {
          "type": "ImageObject",
          "@id": "http://example.com",
          "id": "http://user.example.com/public/logo/image.jpg",
          "name": "image.jpg",
          "encodingFormat": "image/jpeg",
          "about": "http://user.example.com/profile/card#me",
          "url": "http://user.example.com/public/profile/image.jpg"
        }
      ],
      "jobTitle": [
        "CEO"
      ],
      "memberOf": [
        {
          "type": "OrganizationRole",
          "roleName": "Owner",
          "memberOf": {
            "type": "RealEstateOrganization",
            "id": "http://orgid.example.com/profile/card#me"
          },
          "member": "https://memberid.example.com/profile/card#me",
          "startDate": "2019-08-24T14:15:22Z",
          "endDate": "2019-08-24T14:15:22Z"
        }
      ],
      "name": "string",
      "parentOrganization": [
        "http://example.com"
      ],
      "permit": {
        "type": "Permit",
        "name": "DRE Number",
        "issuedBy": {
          "type": "State",
          "name": "California"
        },
        "issuedThrough": {
          "type": "Service",
          "name": "Department of Real Estate"
        },
        "validIn": {},
        "validFrom": "2019-08-24T14:15:22Z",
        "validUntil": "2019-08-24T14:15:22Z"
      },
      "subOrganization": [
        "http://example.com"
      ],
      "url": "http://example.com"
    }
  }

*/
import {
  Document,
  HeadingLevel,
  ImageRun,
  // Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx';
import fetch from 'node-fetch';

// If the contents are a string, wrap them in a paragraph
function valueToCellContents(value) {
  return (typeof value === 'string')
    ? new Paragraph(value) : new Paragraph({ children: [value] });
}

function component(componentName, content) {
  // If content is an object, convert it to a table
  const rows = [];
  if (typeof content !== 'string') {
    // convert an object of name/value pairs to a table
    Object.entries(content).forEach(([name, value]) => rows.push(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(name)] }),
        new TableCell({ children: [valueToCellContents(value)] }),
      ],
    })));
  } else {
    rows.push(new TableRow({
      children: [
        new TableCell({ children: [valueToCellContents(content)] }),
      ],
    }));
  }
  // Insert a header row at the beginning
  rows.unshift(new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph(componentName)],
        columnSpan: 2,
        shading: { fill: 'A0A0FF' },
      }),
    ],
  }));
  const table = new Table({
    rows,
    width: {
      size: 90,
      type: 'pct',
    },
  });
  return table;
}

function divider() {
  return new Paragraph({
    children: [new TextRun({ text: '---' })],
  });
}

async function extractContactDetails(contactDetails) {
  const details = contactDetails.object ? contactDetails.object : contactDetails;
  const { address, image, contactPoint } = details;
  const contact = {
    firstName: details.givenName,
    lastName: details.familyName,
  };
  if (address) {
    contact.streetAddress = address.streetAddress || address.postOfficeBoxNumber;
    contact.city = address.addressLocality;
    contact.state = address.addressRegion;
    contact.zip = address.postalCode;
    contact.subdivision = address.addressSubdivision;
  }

  if (contactPoint) {
    contact.phone = contactPoint.telephone;
    contact.email = contactPoint.email;
    contact.website = contactPoint.url;
  }

  // If there is an image, add it to the contact object
  if (image && image.length > 0) {
    const { url, encodingFormat } = image[0];
    const imageFormat = encodingFormat.split('/').pop();
    contact.photo = new ImageRun({
      type: imageFormat,
      data: Buffer.from(await fetch(url).then((response) => response.arrayBuffer())),
      transformation: {
        width: 400,
        height: 400,
      },
    });
  }
  return contact;
}

export default async function generateWordDoc(contactDetails) {
  const contact = await extractContactDetails(contactDetails);
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: 'Your Local Real Estate Expert',
          heading: HeadingLevel.TITLE,
        }),
        component('Contact Details', contact),
        divider(),
        component('Embed', '/embed/common_about.docx'),
        divider(),
        component('Embed', '/embed/home_value.docx'),
        divider(),
        component('Closed Transactions', {}),
        divider(),
        component('Embed', `/embed/communities/explore_${contact.subdivision}.docx`),
        divider(),
        component('New to Market', {}),
        divider(),
        component('Embed', '/embed/giving back.docx'),
        divider(),
        component('Metadata', {
          Title: `${contact.firstName} ${contact.lastName}`,
          Description: 'This is a description of the document',
          Robots: 'index,follow',
          Image: contact.photo,
          Template: 'Agent Profile',
        }),
      ],
    }],
  });
  return doc;
}
