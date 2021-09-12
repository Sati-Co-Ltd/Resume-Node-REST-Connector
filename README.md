# Resume Node.JS REST API Connector
Resume API Connector for Node.JS

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
The credentials is for authenication to Resume API. And the configuration will be default values for the API of the client.

#### Place credentials file
You can place `credentials.js` file from **Resume Administration System** in server root folder. The `config.js` of `Resume REST API Connector` will parse it when server starts.  
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
You can give Resume Host, Username, and Password to the class constructor directly. Please read create the object.

## Usage

### Create the object

```JS
const { HttpClient } = require('resume-node-rest-connector');
restClient = new HttpClient();
```

You can override credentials by passing as constructor parameters.
```JS
const { HttpClient } = require('resume-node-rest-connector');

const HOST = "https://resume.sati.co.th";
const USER = "USERNAME";
const PW = "PASSWORD";

restClient = new HttpClient(HOST, USER, PW);
```

### Request for new Session ID from Resume API
```JS

```
***Note:*** the `HttpClient` object is totally stateless. Every method call, it ***always*** needs *session ID* and *section ID* to communication with correct session on Resume API.