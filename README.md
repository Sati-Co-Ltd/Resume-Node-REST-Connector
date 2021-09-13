# Resume Node.JS REST API Connector
Resume API Connector for Node.JS

- [Resume Node.JS REST API Connector](#resume-nodejs-rest-api-connector)
  - [About the Project](#about-the-project)
    - [Built With](#built-with)
  - [Getting Started](#getting-started)
    - [Install](#install)
    - [Pass Credentials and Configuration](#pass-credentials-and-configuration)
      - [Place credentials file](#place-credentials-file)
      - [Pass credentials as environmental variables](#pass-credentials-as-environmental-variables)
    - [Programmatic input](#programmatic-input)
  - [Usage](#usage)
    - [Create the object](#create-the-object)
    - [Request for new Session ID from Resume API](#request-for-new-session-id-from-resume-api)
    - [Push Sound Chunk to Resume API](#push-sound-chunk-to-resume-api)
    - [Get Updated Result from Resume API](#get-updated-result-from-resume-api)
    - [End the Session](#end-the-session)
  - [Differences between Resume API mode](#differences-between-resume-api-mode)
  - [More information](#more-information)

## About the Project

Resume&trade; (RE-SU-ME), the Medical Speech to Clinical Summarized Text, is the API developed by [Thai SaTI Partnership, Limited](https://sati.co.th) (SaTI&trade;).
  <br>

Resume Node.JS REST API Connector provides simplicity to connect Resume API as REST Client (and WebSocket Client in the future).
For more detail about SaTI&apos;s Resume Service, Please follow [sati.co.th](https://sati.co.th).

### Built With
- [Axios](https://axios-http.com/)
- [Axios OAuth 2.0 Client](https://github.com/compwright/axios-oauth-client)
- [Axios-Retry](https://github.com/softonic/axios-retry)
- [Axios Token Interceptor](https://github.com/sandrinodimattia/axios-token-interceptor)
- [Form-Data](https://github.com/form-data/form-data)
- [Set-Cookie-Parser](https://github.com/nfriedly/set-cookie-parser)

<br>

## Getting Started
### Install
```sh
npm install resume-node-rest-connector
```
### Pass Credentials and Configuration
The credentials is for authenication to Resume API. And the configuration will be default values for the API of the client. More details about [`ResumeCredentials`](docs/config.md#module_config..ResumeCredentials) and configuration are in [docs/config.md](docs/config.md).

#### Place credentials file
You can place `credentials.js` file from **Resume Administration System** in server root folder. The `config.js` of `Resume REST API Connector` will parse it when server starts. The example of credentials file locate at [../credentials.template.json](credentials.template.json).  
<br>
Example content in `credentials.js
```JSON
{
  "host": "https://resume.sati.co.th",
  "username": "USERNAME",
  "password": "PASSWORD",
  "section_id_default": 0
}
```
<br>

#### Pass credentials as environmental variables
You can also specified Authenication information for Resume API via environmental variable. This method suits for Docker Container development. Please see [Environment variables in Compose](https://docs.docker.com/compose/environment-variables/) for more details.  
<br>
Example of `docker-compose.yaml` for Resume Socket.IO container. 

```yaml
version: "3.4"

services:
  resume-demo:
    # ...

    environment:
      REST_HOST: https://resume.sati.co.th
      REST_USER: USERNAME
      REST_PW: PASSWORD
    
    # ...

```
  
<br>  

You can also place these secret in [&quot;.env&quot; file](https://docs.docker.com/compose/environment-variables/#the-env-file) as Docker suggestion.
<br>  
Example of `.env` for Resume Socket.IO container.  

```ENV
REST_HOST=https://resume.sati.co.th
REST_USER=USERNAME
REST_PW=PASSWORD
REST_DEFAULT_SECTION=0
REST_LANG=["th","en"]
```

<br>  

### Programmatic input
You can give Resume Host, Username, and Password to the class constructor directly. Please read [create the object](#create-the-object).

  <br>

## Usage

### Create the object

```JS
const { HttpClient } = require('resume-node-rest-connector');
restClient = new HttpClient();
```

You can override credentials from configuration in `ResumeCredentials` by passing as constructor parameters.
```JS
const { HttpClient } = require('resume-node-rest-connector');

const HOST = "https://resume.sati.co.th";
const USER = "USERNAME";
const PW = "PASSWORD";

const restClient = new HttpClient(HOST, USER, PW);
```

[HttpClient constructor](#new_module_Resume-REST-API-Connect..ResumeHttpAPIClient_new)
  
  <br>
  
### Request for new Session ID from Resume API
```JS
restClient.newSession(sectionId, lang, hint, docFormat, multiSpeaker, userStartTime)
    .then(res => {
        var sessionID = res.data.session_id;
        var pseudoIdentifier = res.data.pseudoIdentifier;
        var cookies = res.cookies;
    })
    .catch(err => { /*  Error handling  */ });
```

[HttpClient.newSession method](docs/Resume-REST-API-Connect.md)

***Note:*** the `HttpClient` object is totally stateless. Every method call, it ***always*** needs *session ID*, *section ID*, and *cookies* (for load balancer) to communication with correct session on Resume API.

  <br>


### Push Sound Chunk to Resume API

```JS
/* tell the API to keep the session */
let isEnd = false;

/* create ResumeSoundInfo */
let info = {
    _id: soundID, /* Index of sound chunk in this session, count from 0 - n */
    datetime: new Date().toJSON(),
    is_end: isEnd,
    tag: tag, /* form name for Resume Combination or Dictation mode */
    user_transcript: userTranscript /* User input in this form, used for feedback the transcription result */
}


/* Upload to Resume API */
restClient.sendSound(sessionId, sectionID, info, blob, cookies)
    .then(transcript => {
        /* Resume API feedback that the session is ended. */
        let completeEnd = transcript.is_end; 
        
        /* process the transcript */

        // About the transcript object
        // Please Read docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript
    }).catch(err => { /*  Error handling  */ });
```

- [HttpClient.sendSound method](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeHttpAPIClient+sendSound)
- [Transcript object](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript)
- [ResumeSoundInfo](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeSoundInfo)

***Note:*** Don&apos;t send sound after [the session end](#end-the-session), it will result in `500 HTTP Error`.
  <br>



### Get Updated Result from Resume API

```JS
let lastUpdate = null;   /* set last update time, or null */

restClient.updateResult(sessionId, sectionID, lastUpdate, cookies)
    .then(function (transcript) {
        if (transcript) {
            // transcript is not null.

            /* Handling updated transcript */

        } else {
            // If no updated result since lastUpdate,
            // transcript will be null.
            
        }
    }).catch(err => { /*  Error handling  */ });
```

- [HttpClient.sendSound method](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeHttpAPIClient+updateResult)
- [Transcript object](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript)

***Note:***
1. `transcript` response can be `null`. Please check it before next process to prevent exeception.
2. If the session is [ended](#end-the-session), the server will respond [`Transcript.is_end = true`](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript).
  <br>



### End the Session
Set [`ResumeSoundInfo.is_end = true`](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeSoundInfo)

```JS
/* tell the API to end the session */
let isEnd = true; 

/* create ResumeSoundInfo */
let info = {
    _id: soundID, /* Index of sound chunk in this session, count from 0 - n */
    datetime: new Date().toJSON(),
    is_end: isEnd,
    tag: tag, /* form name for Resume Combination or Dictation mode */
    user_transcript: userTranscript /* User input in this form, used for feedback the transcription result */
}


/* Upload to Resume API */
restClient.sendSound(sessionId, sectionID, info, blob, cookies)
    .then(transcript => {
        /* Resume API feedback that the session is ended. */
        let completeEnd = transcript.is_end; 
        
        /* process the transcript */

        // About the transcript object
        // Please Read docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript
    }).catch(err => { /*  Error handling  */ });
```

- [HttpClient.sendSound method](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeHttpAPIClient+sendSound)
- [Transcript object](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript)
- [ResumeSoundInfo](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeSoundInfo)
  <br>


## Differences between Resume API mode

| Part | Conversation Mode | Dictation Mode | Combinatory Mode |
| --- | --- | --- | --- |
| [`transcript`](Resume.js.md#Transcript) result | contains [`MlGroupTxt`](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript) | both [`MlGroupTxt`](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript) and [`TagRawTxt`](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript) | same to [Dictation Mode](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript) |
| [`multiSpeaker`](Resume.js.md#RESUME_DEFAULT_OPTION) parameter in [HttpClient.newSession method](docs/Resume-REST-API-Connect.md) | [`true`](#conv-create) | ***[`false`](#dict-create)*** | [`true`](#conv-create) |
| Need to set [`tag`](#module_Resume-REST-API-Connect..ResumeSoundInfo) property | No | Yes: for every [sound chunk](#push-sound-chunk-to-resume-api) | Every [sound chunk](#push-sound-chunk-to-resume-api) in Dictation periods.<br> Set to `null` for sound chunks in Conversation mode. |

- [HttpClient.sendSound method](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeHttpAPIClient+sendSound)
- [Transcript object](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..Transcript)
- [ResumeSoundInfo](docs/Resume-REST-API-Connect.md#module_Resume-REST-API-Connect..ResumeSoundInfo)
  
  <br/>

## More information
- [docs/config.md](docs/config.md)
- [docs/Resume-REST-API-Connect.md](docs/Resume-REST-API-Connect.md)
- [SaTI.co.th](https://sati.co.th)

-------
&copy; 2021 - copyright by Tanapat Kahabodeekanokkul - the founder of `RESUME`.