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
  // ImageRun,
  // Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx';

function nvpToTable(componentName, nameValuePairs) {
  // convert an object of name/value pairs to a table
  const table = new Table({
    children: [
      new TableCell({
        children: [new Paragraph(componentName)],
        columnSpan: 2,
      }),
    ],
  });
  Object.entries(nameValuePairs).forEach(([name, value]) => {
    table.addChildElement(new TableRow({
      children: [
        new TableCell({ children: [new Paragraph(name)] }),
        new TableCell({ children: [new Paragraph(value)] }),
      ],
    }));
  });
  return table;
}

function divider() {
  return new Paragraph({
    children: [new TextRun({ text: '---' })],
  });
}

export default function generateWordDoc(contactDetails) {
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: 'Your Local Real Estate Expert',
          heading: HeadingLevel.TITLE,
        }),
        divider(),
        nvpToTable('Contact Details', contactDetails),
      ],
    }],
  });
  return doc;
}
