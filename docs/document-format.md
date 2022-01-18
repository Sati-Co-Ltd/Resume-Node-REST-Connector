# Document format

## Nomenclature
  
Names of forms should follow [C-CDA (Consolidated Clinical Document Architecture)](http://hl7.org/fhir/us/ccda/artifacts.html).

- http://build.fhir.org/ig/HL7/ccda-on-fhir/artifacts.html
- http://hl7.org/fhir/us/ccda/artifacts.html
- http://hl7.org/fhir/us/ccda/history.html


## How to use this document
### Give the document format to API
Provide string as same as Constant variable part of document  
```js
// let the API knows we are in OPD card (History and Physical Exam document)
// The `Constant variable` part of History and Physical Exam document is 'HistoryAndPhysical'
let doc = 'HistoryAndPhysical';

```

### Take standard response from API
```js
let mlCC = response.MlGroupTxt.history_of_present_illness_section; // history_of_present_illness_section
let dictPI= response.RawTagTxt.history_of_present_illness_section; // history_of_present_illness_section
let dictCC = response.RawTagTxt.chief_complaint_section; // take Chief complaint from chief_complaint_section
```

### Give standard tag to API
Give the fields' name in Standard field
```js
let tag = 'chief_complaint_section';
```

### Give extension tag to API
Give the fields' name in Standard field
```js
let tag = 'physical_exam_section_HEENT';

let tag = 'other';
let tag = 'other_doctor_note';
```

## Document forms

### Identification

### Care Plan Document
**Other name, or abbreviation**:  
**Description**: 
**Constant variable**: ``  
**Standard fields**  
| Fields | User interface | Description |
|---|---|---|
|   |   | |
  
**Extended fields**  
| Fields | User interface | Description |
|---|---|---|
|   |   | |

###