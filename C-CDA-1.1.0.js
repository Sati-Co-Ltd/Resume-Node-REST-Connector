/**
 * @module C-CDA-1-1-0
 */

// http://www.hl7.org/fhir/us/ccda/artifacts.html

/**
 * @typedef {import('./ResumeCommonFormat').GroupText} GroupText
 */

/**
 * A [History and Physical (H&P) note](http://hl7.org/fhir/us/ccda/StructureDefinition/History-and-Physical) is a medical report that documents the current and past conditions of the patient. It contains essential information that helps determine an individual’s health status.
 * @summary [History and Physical](http://hl7.org/fhir/us/ccda/StructureDefinition/History-and-Physical)
 * @typedef {GroupText & Object} HistoryAndPhysical
 * @property {string[]} allergies_and_intolerances_section allergies_and_intolerances_section
 */

/**
 * @const {HistoryAndPhysical} HA And Physical Exam
 */
const HA = {
    allergies_and_intolerances_section: null
};


module.exports = {
    /**
     * @type {HistoryAndPhysical} History And Physical Exam
     */
    HistoryAndPhysical: HA
}