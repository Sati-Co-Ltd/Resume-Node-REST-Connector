# Resume API Configuration ::  config.js
Store configuration for Node.JS module for HTTPS RESTful Resume API Client

<a name="module_config"></a>

## config
<a name="module_config..ResumeCredentials"></a>

### config~ResumeCredentials
Credentials and Configuration object for Resume API. They can be overriden by prioriy: `credentials file` (credentials JSON file) &gt; `process.env.*` &gt; `default API values`. The example of credentials file locate at [../credentials.template.json](credentials.template.json).

**Kind**: inner typedef of [<code>config</code>](#module_config)  <br>
**Summary**: Credentials object for Resume API, Automatically set by Resume Config.  <br>
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [CREDENTIALS_FILE] | <code>string</code> | path to credentials JSON file. If file is not found, `ResumeCredentials` will not override config by credentials file (not raise error, only show warning). <br><br>  ***overriding step:*** `process.env.CREDENTIALS_FILE` &gt; `"credentials.json"` by default. |
| [host] | <code>string</code> | full host path to Resume API <br><br>  ***overriding step:*** `"host"` in credentials files &gt; `process.env.REST_HOST` &gt; `"https://resume.sati.co.th"` (default). |
| [username] | <code>string</code> | username for Resume API <br><br>  ***overriding step:*** `"username"` in credentials files &gt; `process.env.REST_USER`. |
| [password] | <code>string</code> | password for Resume API <br><br>  ***overriding step:*** `"password"` in credentials files &gt; `process.env.REST_PW`. |
| [section_id_default] | <code>string</code> \| <code>int</code> | default Section ID, information for Resume API <br><br>  ***overriding step:*** `"section_id_default"` in credentials files &gt; `process.env.REST_DEFAULT_SECTION` &gt; `0`. |
| [lang_json] | <code>string</code> | path to array of languages hint-storing JSON. If file is not found, `ResumeCredentials.lang` property will skip to next overriding step (not raise error, only show warning). Please see example in [../public/lang.json](../public/lang.json) <br><br>  ***overriding step:*** `process.env.LANG_JSON` &gt; `"public/lang.json"` (default), respectively. |
| [lang] | <code>Array.&lt;string&gt;</code> | language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in `./public/lang.json` . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers) <br><br>  ***overriding step:***  `"section_id_default"` in credentials files &gt; read JSON file at `this.lang_json` path &gt; `JSON.parse(process.env.REST_LANG)` &gt; Resume API default config. |
  
-------
&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of `RESUME`.