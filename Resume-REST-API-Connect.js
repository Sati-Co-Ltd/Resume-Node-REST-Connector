/**
 * @module Resume-REST-API-Connect
 */
/**
 * @file Resume-REST-API-Connect.js - Node.JS module for HTTPS RESTful Resume API Client
 * @author Tanapat Kahabodeekanokkul
 * @copyright Tanapat Kahabodeekanokkul 2021
 * @license Tanapat-Kahabodeekanokkul
 */

const CONFIG = require('./config');
const axios = require('axios');
const oauth = require('axios-oauth-client');
const tokenProvider = require('axios-token-interceptor');
const FormData = require('form-data');
const setCookie = require('set-cookie-parser');

/**
 * Response data in ResumeSessionResponse
 * @typedef ResumeNewSessionData
 * @property {string} session_id Session ID of Resume Transcription API
 * @property {string|int} section_id Section ID given by user, response for feedback checking
 */


/**
 * Object contains keys - part of document following Terminology of "C-CDA 1.1.0 on FHIR resource profile" (see README.md), and values - array of sentences or pharse (join into one string). `{"problem_section":["This is sentence one.","more pharse here..."]}`
 * @summary Object contains keys - part of document (as C-CDA on FHIR), and values - array of string.
 * @typedef GroupText
 * @type {Object.<string,string[]>}
 */

/**
 * Transcript response of sent sound from Resume API
 * @typedef Transcript
 * @type {object}
 * @property {Array.<string[]>} [RawTxt] - array of sentence. Each sentence is array of word. `[["This","is","first","sentence","."],["...","next","and","more"]]`
 * @property {int[]} [RawSpk] - array of speaker index correlated with sentence in RawTxt, starting from zero.
 * @property {GroupText} [MlGroupTxt] - object of formatted and groupped text by Resume API Algorithm
 * @property {GroupText} [TagRawTxt] - object of raw sentence groupped by client tag (`ResumeOne.tag`).
 * @property {GroupText} [user_transcript] - object of user-input form data
 */

/**
 * Main format for sound chunk request and Transcript response of sent sound from Resume API
 * @typedef ResumeSoundInfo
 * @type {object}
 * @property {Array.<string[]>} [RawTxt] array of sentence. Each sentence is array of word. `[["This","is","first","sentence","."],["...","next","and","more"]]`
 * @property {Date} datetime datetime that Resume.js send chunk of sound
 * @property {Boolean} is_end true if user or Resume.js end the transcription Resume session
 * @property {string} [tag] tag (form input name) used in Dictation or Combination mode should correlate Terminology of "C-CDA 1.1.0 on FHIR resource profile" (see README.md)
 * @property {int[]} [_id] array of sound chunk index
 * @property {GroupText} [user_transcript] object of user-input form data
 */


/**
 * Returns from newSession method
 * @typedef ResumeSessionResponse
 * @property {int} status HTTP response status
 * @property {ResumeNewSessionData} data response from Resume API containing session id and its information
 * @property {Date} clientStartTime time that function called in server-sided Node.JS (client of API)
 * @property {Date} userStartTime time that user (client-sided JavaScript) requests new Resume Session ID
 * @property {string} [pseudoIdentifier] fake (pseudo) identifier generated by Resume REST API Client and sent to server
 * @property {string} cookies HTTP header-encoded cookies string that Resume API responses. It must be included in consequenct resquest in same Session ID. Because it is important for API server routing.
 */

/*
{
    status: res.status,
    data: res.data,
    clientStartTime: time,
    userStartTime: userStartTime,
    pseudoIdentifier: pseudoIden,
    cookies: setCookie.parse(res, { decodeValues: false }).map((cookie) => {
        console.log('Cookie:', JSON.stringify(cookie));
        return cookie.name + '=' + cookie.value
    }).join('; ')
}
 */

/**
 * Class for connect Resume API via HTTPS/1.1 REST API
 */
class ResumeHttpAPIClient {
    /** 
     * Create ResumeHttpAPIClient
     * @param {string} [host] - full host path for Resume API (https://resume.sati.co.th)
     * @param {string} [username] - API username if leave blank Resume will load from credentials.json or environmental variable by config.js
     * @param {string} [password] - API password if leave blank Resume will load from credentials.json or environmental variable by config.js
     */
    constructor(host, username, password) {
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
    }
    /** 
     * Test Resume API connection
     */
    test() {
        Promise.all([this.client.get('user'), this.client.get('test')])
            .then((res) => res.forEach((v, k) => console.log('Test connection', k, "Response:\n", v.data)))
            .catch(err => console.log('Fail Test connection', err));
    }
    /** 
     * Request new Resume Transcript Session from Resume API.
     * @property {(int|string)} sectionId ID of section e.g. department number, section of organization name
     * @property {string[]} lang language hints must be BCP-47 language code in string type or array of string type ordered by highest priority to suggest the speech-to-text API - the default is located in ./public/lang.json . See more detail of [BCP-47](https://github.com/libyal/libfwnt/wiki/Language-Code-identifiers)
     * @property {string} docFormat Format of document to let the speech-to-text API to generate returned data - reference the name from "C-CDA 1.1.0 on FHIR" otherwise will be "Default". Please read [README.md](../README.md) and http://hl7.org/fhir/us/ccda/artifacts.html
     * @property {Boolean} multiSpeaker mode of transcription automatically given from ResumeOne().newSession(...)
     * @property {Date} userStartTime session starting datetime automatically given from ResumeOne().newSession(...)
     * @return {Promise<ResumeSessionResponse>} Promise object of Session ID
     */
    newSession(sectionID, lang, hint, docFormat, multiSpeaker, userStartTime) {
        // check for doc format and lang

        // generate pseudo-identifier to send to server
        let time = Date.now();
        let pseudoIden = (time.toString(36) + Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)).substr(0, 32);

        // create promist and send to server 
        return this.client.post("",
            {
                section_id: sectionID || CONFIG.section_id_default,
                lang: lang || CONFIG.lang,
                hint: hint || null,
                multi_speaker: multiSpeaker || false,
                doc_format: docFormat || null,
                user_start_time: new Date(userStartTime).toJSON(),
                client_start_time: new Date(time).toJSON(),
                identifier: pseudoIden
            }).then((res) => {
                // Read cookie
                return {
                    status: res.status,
                    data: res.data,
                    clientStartTime: time,
                    userStartTime: userStartTime,
                    pseudoIdentifier: pseudoIden,
                    cookies: setCookie.parse(res, { decodeValues: false }).map((cookie) => {
                        console.log('Cookie:', JSON.stringify(cookie));
                        return cookie.name + '=' + cookie.value
                    }).join('; ')
                };
            });
    }


    /**
     * Send sound chunk to Resume API
     * @param {string} sessionId Resume API Session ID from newSession method
     * @param {string|int} sectionID ID of section e.g. department number, section of organization name
     * @param {ResumeSoundInfo} info sound chunk information for Resume API
     * @param {Blob} soundStream chunk of sound in WAV format
     * @param {string} cookies HTTP header-encoded cookies string from newSession return, important for Resume API server process
     * @returns {Promise<ResumeSoundInfo>} Promise object of ResumeSoundInfo from Resume API
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
            tag: info.tag
        };
        if (info.user_transcript)
            //form.append("user_transcript", msgpack.pack(data.user_transcript,true));
            infoSubmit.user_transcript = info.user_transcript
        form.append("info", JSON.stringify(infoSubmit));

        if (soundStream)
            form.append("wav", soundStream, {
                filename: '_id' + info._id + '.wav' || '0.wav',
                contentType: 'audio/wav'
            }); //'audio/webm'
        //console.log('Append wav:: ' + form.getBuffer().length);
        //console.log('Headers ' + JSON.stringify(form.getHeaders()));

        //console.log('Put sound', session_id);
        return this.client.put("",
            form.getBuffer(), {
            headers: {
                ...form.getHeaders(),
                Cookie: cookies
            }
        }).then(ResumeHttpAPIClient.responseResolve);

    }

    /**
     * Request for Resume API transcription result
     * @param {string} sessionId Resume API Session ID from newSession method
     * @param {string|int} sectionID ID of section e.g. department number, section of organization name
     * @param {Date} [lastUpdate] Last update datetime if user has caching.
     * @param {string} cookies  HTTP header-encoded cookies string from newSession return, important for Resume API server process
     * @returns {Promise<ResumeSoundInfo>} Promise object of ResumeSoundInfo from Resume API, **null** if there is no new update for lastUpdate time.
     */
    updateResult(sessionId, sectionID, lastUpdate, cookies) {
        return this.client.get("", {
            params: {
                session_id: sessionId,
                section_id: sectionID,
                last_update: lastUpdate || 0
            },
            headers: {
                Cookies: cookies
            }
        }).then(ResumeHttpAPIClient.responseResolve);
    }

    /**
     * Process Response from Resume HTTP REST API
     * @param {AxiosResponse} res AxiosResponse object
     * @returns {ResumeSoundInfo} response from Resume API
     */
    static responseResolve(res) {
        console.log('Response result :: new set-cookie:', setCookie.parse(res));
        return res.data;
    }

}

module.exports = ResumeHttpAPIClient