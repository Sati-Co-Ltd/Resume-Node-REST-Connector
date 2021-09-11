const RESUME = require('../index').HttpClient;
// Test with username and password
// new RESUME('https://resume.sati.co.th','USERNAME','PASSWORD').test();

// Test without username and password
new RESUME('https://resume.sati.co.th').testAnonymous();