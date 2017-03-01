//LockBoxClient.js
var fetch = require('node-fetch');

module.exports = function() {
  this.encryptionKey = process.env.LOCKBOX_ENCRYPTION_KEY;
  this.apiKey = process.env.LOCKBOX_API_KEY;
  this.apiUrl = process.env.LOCKBOX_API_URL;
  this.boxName = process.env.LOCKBOX_BOX_NAME;
  this.entryKey = process.env.LOCKBOX_ENTRY_KEY;

  this.url = `${this.apiUrl}/boxes/${this.boxName}/entries/${this.entryKey}`;
  this.options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      'X-Encryption-Key': this.encryptionKey
    }
  };

  this.getConfig = async () => {
    let response = await fetch(this.url, this.options);

    return response.json();
  }
};