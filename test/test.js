const RESUME = require('./../Resume-REST-API-Connect');
// Test with username and password
// new RESUME('https://resume.sati.co.th','USERNAME','PASSWORD').test();

// Test without username and password
new RESUME('https://resume.sati.co.th').testAnonymous();