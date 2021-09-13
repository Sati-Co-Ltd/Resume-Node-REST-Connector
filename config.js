/**
 * @module config
 */

/**
* @file config.js - Server-sided Node.JS config for Resume API
* @author Tanapat Kahabodeekanokkul
* @copyright Tanapat Kahabodeekanokkul 2021
* @license Tanapat-Kahabodeekanokkul
*/

/**
 * Credentials and Configuration object for Resume API. They can be overriden by prioriy: `credentials file` (credentials JSON file) &gt; `process.env.*` &gt; `default API values`. The example of credentials file locate at [../credentials.template.json](credentials.template.json).
 * @summary Credentials object for Resume API, Automatically set by Resume Config.
 * @typedef ResumeCredentials
 * @property {string} [CREDENTIALS_FILE] path to credentials JSON file. If file is not found, `ResumeCredentials` will not override config by credentials file (not raise error, only show warning). <br><br>  ***overriding step:*** `process.env.CREDENTIALS_FILE` &gt; `"credentials.json"` by default.
 * @property {string} [host] full host path to Resume API <br><br>  ***overriding step:*** `"host"` in credentials files &gt; `process.env.REST_HOST` &gt; `"https://resume.sati.co.th"` (default).
 * @property {string} [username] username for Resume API <br><br>  ***overriding step:*** `"username"` in credentials files &gt; `process.env.REST_USER`.
 * @property {string} [password] password for Resume API <br><br>  ***overriding step:*** `"password"` in credentials files &gt; `process.env.REST_PW`.
 * @property {string|int} [section_id_default] default Section ID, information for Resume API <br><br>  ***overriding step:*** `"section_id_default"` in credentials files &gt; `process.env.REST_DEFAULT_SECTION` &gt; `0`.
 * @property {string} [lang_json] path to array of languages hint-storing JSON. If file is not found, `ResumeCredentials.lang` property will skip to next overriding step (not raise error, only show warning). Please see example in [../public/lang.json](../public/lang.json) <br><br>  ***overriding step:*** `process.env.LANG_JSON` &gt; `"public/lang.json"` (default), respectively.
 * @property {string[]} [lang] language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in `./public/lang.json` . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) <br><br>  ***overriding step:***  `"section_id_default"` in credentials files &gt; read JSON file at `this.lang_json` path &gt; `JSON.parse(process.env.REST_LANG)` &gt; Resume API default config.
 */

var credentials = {
    "CREDENTIALS_FILE": process.env.CREDENTIALS_FILE || "credentials.json",
    "host": process.env.REST_HOST || "https://resume.sati.co.th",
    "username": process.env.REST_USER || "",
    "password": process.env.REST_PW || "",
    "section_id_default": process.env.REST_DEFAULT_SECTION || 0,
    "lang_json": process.env.LANG_JSON || "./public/lang.json",
    "lang": null
};

const fs = require('fs');
const path = require('path');
try {
    if (credentials.CREDENTIALS_FILE) {
        let cred = path.resolve(process.cwd(), credentials.CREDENTIALS_FILE);
        if (fs.existsSync(cred)) {
            console.log('Load Credentials file');
            let load = JSON.parse(fs.readFileSync(cred, 'utf-8'));
            credentials = {
                ...credentials,
                ...load
            };
        } else {
            console.warn('Credentials file: ', cred, ' not found. Use config from default or process.env.');
        }
    } else {
        console.info('Credentials file is blank. Use config from default or process.env.');
    }
    if (!credentials.lang) {
        let lang_json = path.resolve(process.cwd(), credentials.lang_json);
        if (fs.existsSync(lang_json)) {
            console.log('Read language JSON from ', lang_json);
            credentials.lang = JSON.parse(fs.readFileSync(lang_json));
        } else if (process.env.REST_LANG) {
            console.log('Parse JSON of language list from environmental variable: ', process.env.REST_LANG);
            credentials.lang = JSON.parse(process.env.REST_LANG);
        } else {
            console.warn('Both language JSON file ', lang_json, ' and REST_LANG ', process.env.REST_LANG, ' are blank. Use default API configuration.')
        }
    }
} catch (e) {
    console.error(e);
}


module.exports = credentials;