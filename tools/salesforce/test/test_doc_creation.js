import generateWordDoc from '../doc_creator.js';
import assert from 'assert';
import { Packer, Document } from 'docx';
import fs from 'fs';

// Mocha test for doc_creator
describe('doc_creator', () => {
  it('should create a document', async () => {
    const contactDetails = {
      name: 'John Doe',
      email: 'test@test.test',
      phone: '1234567890',
    };
    const doc = generateWordDoc(contactDetails);
    // Assert that doc is an instance of Document using assert
    assert(Object.getPrototypeOf(doc) === Document.prototype);
    // Write the doc to a file in /tmp
    // const buffer = await Packer.toBuffer(doc);
    // fs.writeFileSync('/tmp/test.docx', buffer);
  });
});
