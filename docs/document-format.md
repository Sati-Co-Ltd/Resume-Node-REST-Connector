# Document format

- [Document format](#document-format)
  - [Nomenclature](#nomenclature)
  - [How to use this document](#how-to-use-this-document)
    - [Give the document format to API](#give-the-document-format-to-api)
    - [Take standard response from API](#take-standard-response-from-api)
    - [Give standard tag to API](#give-standard-tag-to-api)
    - [Give extension tag to API](#give-extension-tag-to-api)
  - [Document forms](#document-forms)
    - [Care Plan Document](#care-plan-document)
    - [Consultation Note](#consultation-note)
    - [Continuity of Care Document](#continuity-of-care-document)
    - [Diagnostic Imaging Report](#diagnostic-imaging-report)
    - [Discharge Summary](#discharge-summary)
    - [History and Physical](#history-and-physical)
    - [Operative Note](#operative-note)
    - [Procedure Note](#procedure-note)
    - [Progress Note](#progress-note)
    - [Referral Note](#referral-note)
    - [Transfer Summary](#transfer-summary)

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


### Consultation Note
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


### Continuity of Care Document
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



### Diagnostic Imaging Report
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


### Discharge Summary
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


### History and Physical
**Other name, or abbreviation**: OPD Card (Outpatient department), Admission note, History and Physical Exam document, H&amp;P note  
**Description**: A History and Physical Exam (H&amp;P) note is medical record of patient's present and past conditions. The healthcare providers have to fill the H&amp;P note when patient visit at outpatient department (OPD) or emergency department (ED), upon pre-procedure, and before hospital admission.  
  
**Constant variable**: `HistoryAndPhysical`  
**Standard fields**  

Fields | User interface | Alternative UI | Description 
---|---|---|---
chief_complaint_section | Chief complaint, CC  | |
history_of_present_illness_section | Present Illness, PI |  | 
past_medical_history_section | Past History, Past Illness, PH, PHx, Medical/Trauma history | |
procedures_section | History of Procedure, Surgical history, Obsteric/Gynecologic history | past_medical_history_section | | 
medications_section | Current Medication, History of medication | past_medical_history_section | |
allergies_and_intolerances_section | Allergy, Adverse reaction, Intolerance, Sensitivity | past_md
social_history_section | Social history, Social and Personal history | | Include alcohol, smoking, and substance use
immunizations_section | Vaccination, Vaccine history, Immunization | past_medical_history_section | 
review_of_systems_section | Review of System, Systematic Reviews | | 
vital_signs_section | Vital sign, V/S, VS | physical_exam_section | 
general_status_section | General Status, General Appearance, GA | physical_exam_section | 
physical_exam_section | Physical Exam, PE | | 
problem_section | Problem list, Diagnosis, ICD-10 | | 
assessment_section | Assessment, Progression | problem_section | 
results_section | Lab, Imaging, X-Rays, Diagnostic Test, Diagnostic procedure | | 
plan_of_treatment_section | Plan, Treatment, Plan of procedure | | 
discharge_medications_section | Home Medication, Home Med, HM, Rx | plan_of_treatment_section | *Not in C-CDA*
follow_up_section | Follow up, Appointment, F/U | plan_of_treatment_section | *Not in C-CDA*


**Extended fields**  

Fields | User interface | Alternative UI | Description 
---|---|---|---
reason_for_visit_section  | Reason for visit   |  |  
triage_section | Triage | | *Not in C-CDA* for ED
  
**Reference**:
- http://hl7.org/fhir/us/ccda/StructureDefinition-History-and-Physical.html
- https://www.crhospital.org/webboard/upload/file/13844896107954.pdf

### Operative Note
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


### Procedure Note
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



### Progress Note
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


### Referral Note
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



### Transfer Summary
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
