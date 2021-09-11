# Resume API Configuration ::  config.js
Store configuration for Node.JS module for HTTPS RESTful Resume API Client

<a name="module_config"></a>

## config
<a name="module_config..ResumeCredentials"></a>

### config~ResumeCredentials
Credentials object for Resume API

**Kind**: inner typedef of [<code>config</code>](#module_config)
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [CREDENTIALS_FILE] | <code>string</code> | path to credentials file - default is from `process.env.CREDENTIALS_FILE` or "credentials.json". |
| [host] | <code>string</code> | full host path to Resume API - default is from `process.env.REST_HOST`. |
| [username] | <code>string</code> | username for Resume API - default is from `process.env.REST_USER`. |
| [password] | <code>string</code> | password for Resume API - default is from `process.env.REST_PW`. |
| [section_id_default] | <code>string</code> \| <code>int</code> | default Section ID, information for Resume API - default is from `process.env.REST_DEFAULT_SECTION` or 0. |
| [lang] | <code>Array.&lt;string&gt;</code> | language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in `./public/lang.json` . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) - default also can load from `process.env.LANG_JSON` path or `process.env.REST_LANG` environment variable. |
| [lang_json] | <code>string</code> | path to lang.json, Please see example in [../public/lang.json](../public/lang.json), Default is `process.env.LANG_JSON` or "public/lang.json". |
  
-------
&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of `RESUME`.