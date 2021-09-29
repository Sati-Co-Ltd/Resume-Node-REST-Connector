/**
 * @module Resume-REST-API-Connect
 */
/**
 * @file Resume-REST-API-Connect.js - Node.JS module for HTTPS RESTful Resume API Client
 * @author Tanapat Kahabodeekanokkul
 * @copyright Tanapat Kahabodeekanokkul 2021
 * @license Tanapat-Kahabodeekanokkul
 */

/**
 * @typedef {import('./ResumeCommonFormat')} ResumeCommonFormat
 */

const ResumeCommonFormat = require('./ResumeCommonFormat');

const CONFIG = require('./config');
const axios = require('axios');
const oauth = require('axios-oauth-client');
const axiosRetry = require('axios-retry');
const tokenProvider = require('axios-token-interceptor');
const FormData = require('form-data');
const setCookie = require('set-cookie-parser');
const pino = require('pino');

/**
 * @typedef {object} ResumeClientOption
 * @property {object} [log] - inherited properties to child logger
 */

/**
 * Class for connect Resume API via HTTPS/1.1 REST API
 * ***Note:*** the `HttpClient` object is totally stateless. Every method call, it ***always*** needs *session ID*, *section ID*, and *cookies* (for load balancer) to communication with correct session on Resume API.
 * @summary  Class for connect Resume API via HTTPS/1.1 REST API
 */
class ResumeHttpAPIClient {

    // Plan Add on Server Push Result in WebSocket 
    // onApiPushResult callback
    /** 
     * Create ResumeHttpAPIClient
     * @param {string} [host] - full host path for Resume API (https://resume.sati.co.th)
     * @param {string} [username] - Resume API username if leave blank, will load from ResumeCredentials
     * @param {string} [password] - Resume API password if leave blank, will load from ResumeCredentials
     * @param {ResumeClientOption} [option] - Options
     */
    constructor(host, username, password, option) {
        // set up log
        this.logger = pino(pino.destination({ sync: false }))
            .child(((option && option.log) ? option.log : {}));

        this.host = host || CONFIG.host;
        this.credentials = oauth.client(axios.create(), {
            url: new URL("/auth/token", this.host).toString(),
            grant_type: 'password',
            //client_id: 'foo',
            //client_secret: 'bar',
            username: username || CONFIG.username,
            password: password || CONFIG.password,
            //scope: 'baz'
        });

        this.logger.info({
            className: this.constructor.name,
            host: this.host,
            configUsername: CONFIG.username,
            overridenUsername: username
        },
            'Resume Connector constructor');

        //NODE_ENV
        let agent = { baseURL: this.host };
        if (this.host.indexOf('https://') == 0) {
            if (process.env.NODE_ENV == 'development') {
                process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
                agent.httpsAgent = new require('https').Agent({ rejectUnauthorized: false });
            } else {
                agent.httpsAgent = new require('https').Agent();
            }
            agent.withCredentials = true;
        }

        this.client = axios.create(agent);
        this.client.interceptors.request.use(oauth.interceptor(tokenProvider, this.credentials));

        axiosRetry(this.client, {
            retries: 100,
            retryCondition: function (error) {
                return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
            },
            retryDelay: function (retryCount, error) {
                if ((retryCount < 50) || (error.config && error.config.method && error.config.method == 'post')) {
                    // assume is newSession POST method
                    return 0;
                }
                return axiosRetry.exponentialDelay(retryCount - 50);
            }
        });
    }
    /** 
     * Test Resume API connection and Authenication
     * @returns {Promise<axios.AxiosResponse>} Promise.all() of axios object
     */
    test() {
        return Promise.all([this.client.get('test'), this.client.get('user')])
            .then((res) => {
                res.forEach((v, k) => this.logger.info({ id: k, "response": v.data }, 'Test user connection'));
                return res;
            })
            .catch(err => this.logger.error(err, 'Fail Test user connection'));
    }
    /** 
     * Test Resume API connection without username and password
     * @returns {Promise<axios.AxiosResponse>} Promise of axios object
     */
    testAnonymous() {
        return axios.get(new URL("test", this.host).toString())
            .then((res) => this.logger.info({ "response": res.data }, 'Test connection'))
            .catch(err => this.logger.error(err, 'Fail Test connection'));
    }
    /** 
     * Request new Resume Transcript Session from Resume API.
     * @property {(int|string)} sectionId ID of section e.g. department number, section of organization name
     * @property {string[]} lang language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers)
     * @property {string} docFormat Format of document to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html
     * @property {Boolean} multiSpeaker mode of transcription automatically given from ResumeOne().newSession(...)
     * @property {Date} userStartTime session starting datetime automatically given from ResumeOne().newSession(...)
     * @return {Promise<ResumeCommonFormat.ResumeSessionResponse>} Promise object of Session ID
     */
    newSession(sectionID, lang, hint, docFormat, multiSpeaker, userStartTime) {
        // check for doc format and lang

        // generate pseudo-identifier to send to server
        let time = Date.now();
        let pseudoIden = (time.toString(36) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, 32);


        let params = {
            section_id: sectionID || CONFIG.section_id_default,
            lang: lang || CONFIG.lang,
            hint: hint || null,
            multi_speaker: multiSpeaker || false,
            doc_format: docFormat || null,
            user_start_time: new Date(userStartTime).toJSON(),
            client_start_time: new Date(time).toJSON(),
            identifier: pseudoIden
        };

        this.logger.info({
            className: this.constructor.name,
            ...params
        }, 'Client: create new session');

        // create promist and send to server 
        return this.client.post("", params).then((res) => {
            // Read cookie
            let response = {
                status: res.status,
                data: res.data,
                clientStartTime: time,
                userStartTime: userStartTime,
                pseudoIdentifier: pseudoIden,
                cookies: setCookie.parse(res, { decodeValues: false }).map((cookie) => {
                    this.logger.debug({ cookie: cookie }, 'Client: new session, received cookie');
                    return cookie.name + '=' + cookie.value
                }).join('; ')
            };

            this.logger.info({
                className: this.constructor.name,
                ...params,
                ...response
            }, 'Client: received new session');
            return response;
        });
    }


    /**
     * Send sound chunk to Resume API
     * @param {string} sessionId Resume API Session ID from newSession method
     * @param {string|int} sectionID ID of section e.g. department number, section of organization name
     * @param {ResumeCommonFormat.ResumeSoundInfo} info sound chunk information for Resume API
     * @param {Blob} soundStream chunk of sound in WAV format
     * @param {string} cookies HTTP header-encoded cookies string from newSession return, important for Resume API server process
     * @returns {Promise<ResumeCommonFormat.Transcript>} Promise object of Transcript from Resume API
     */
    sendSound(sessionId, sectionID, info, soundStream, cookies) {
        console.log('Prepare to put sound');

        var form = new FormData({ maxDataSize: 10500000 }); // 10 MB
        form.append("session_id", sessionId);
        form.append("section_id", sectionID || CONFIG.section_id_default);


        let infoSubmit = {
            user_datetime: info.datetime || null,
            client_datetime: (new Date().toJSON()),
            is_end: info.is_end,
            tag: info.tag,
            _id: info._id
        };
        if (info.user_transcript)
            //form.append("user_transcript", msgpack.pack(data.user_transcript,true));
            infoSubmit.user_transcript = info.user_transcript
        form.append("info", JSON.stringify(infoSubmit));

        if (soundStream)
            form.append("wav", soundStream, {
                filename: (info._id.toString() || '0') + '.wav',
                contentType: 'audio/wav'
            }); //'audio/webm'
        //console.log('Append wav:: ' + form.getBuffer().length);
        //console.log('Headers ' + JSON.stringify(form.getHeaders()));

        this.logger.info(
            {
                session_id: sessionId,
                section_id: sectionID || CONFIG.section_id_default,
                info: infoSubmit,
                wav: soundStream ? soundStream.length : null,
                Cookie: cookies
            }, 'Client: send sound to API');

        //console.log('Put sound', session_id);
        let logger = this.logger;
        return this.client.put("",
            form.getBuffer(), {
            headers: {
                ...form.getHeaders(),
                Cookie: cookies
            }
        }).then(res => ResumeHttpAPIClient.responseResolve(res, logger));

    }

    /**
     * Request for Resume API transcription result
     * @param {string} sessionId Resume API Session ID from newSession method
     * @param {string|int} sectionID ID of section e.g. department number, section of organization name
     * @param {Date} [lastUpdate] Last update datetime if user has caching.
     * @param {string} cookies  HTTP header-encoded cookies string from newSession return, important for Resume API server process
     * @returns {Promise<(ResumeCommonFormat.Transcript|null)>} Promise object of Transcript from Resume API, **null** if there is no new update for lastUpdate time.
     */
    updateResult(sessionId, sectionID, lastUpdate, cookies) {
        let params = {
            session_id: sessionId,
            section_id: sectionID,
            last_update: lastUpdate || 0
        }
        this.logger.info(
            {
                ...params,
                ...cookies
            }, 'Client: update result from API');

        let logger = this.logger;
        return this.client.get("", {
            params: params,
            headers: {
                Cookie: cookies
            }
        }).then(res => ResumeHttpAPIClient.responseResolve(res, logger));
    }

    /**
     * Process Response from Resume HTTP REST API
     * @param {AxiosResponse} res AxiosResponse object
     * @returns {ResumeCommonFormat.ResumeSoundInfo} response from Resume API
     */
    static responseResolve(res, logger) {
        if (!logger) {
            logger = console.debug;
        }
        logger.debug({ cookies: setCookie.parse(res) }, 'responseResolve :: new set-cookie:');
        return res.data;
    }

}

module.exports = ResumeHttpAPIClient