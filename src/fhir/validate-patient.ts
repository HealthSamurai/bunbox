/**
 * Hardcoded Patient validation based on FHIR R4 StructureDefinition
 */

export interface ValidationError {
  path: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Valid codes from ValueSets
const GENDER_CODES = ["male", "female", "other", "unknown"];
const LINK_TYPE_CODES = ["replaced-by", "replaces", "refer", "seealso"];
const NAME_USE_CODES = ["usual", "official", "temp", "nickname", "anonymous", "old", "maiden"];
const ADDRESS_USE_CODES = ["home", "work", "temp", "old", "billing"];
const ADDRESS_TYPE_CODES = ["postal", "physical", "both"];
const CONTACT_POINT_SYSTEM_CODES = ["phone", "fax", "email", "pager", "url", "sms", "other"];
const CONTACT_POINT_USE_CODES = ["home", "work", "temp", "old", "mobile"];
const IDENTIFIER_USE_CODES = ["usual", "official", "temp", "secondary", "old"];

// Type checking helpers
function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isBoolean(v: unknown): v is boolean {
  return typeof v === "boolean";
}

function isInteger(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v);
}

function isArray(v: unknown): v is unknown[] {
  return Array.isArray(v);
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Date/DateTime patterns
const DATE_PATTERN = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const DATETIME_PATTERN = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?)?)?$/;
const URI_PATTERN = /^[a-zA-Z][a-zA-Z0-9+.-]*:.+$/;

function isDate(v: unknown): boolean {
  return isString(v) && DATE_PATTERN.test(v);
}

function isDateTime(v: unknown): boolean {
  return isString(v) && DATETIME_PATTERN.test(v);
}

function isUri(v: unknown): boolean {
  return isString(v) && (URI_PATTERN.test(v) || v.startsWith("/") || v.startsWith("#"));
}

// Validation helpers
function addError(errors: ValidationError[], path: string, message: string, severity: "error" | "warning" = "error") {
  errors.push({ path, message, severity });
}

function validateCardinality(
  errors: ValidationError[],
  path: string,
  value: unknown,
  min: number,
  max: string
) {
  if (value === undefined || value === null) {
    if (min > 0) {
      addError(errors, path, `Required field missing (min: ${min})`);
    }
    return false;
  }

  if (max === "*") {
    if (!isArray(value)) {
      addError(errors, path, `Expected array for repeating element`);
      return false;
    }
    if (value.length < min) {
      addError(errors, path, `Array has ${value.length} items, minimum is ${min}`);
      return false;
    }
  } else {
    if (isArray(value)) {
      addError(errors, path, `Expected single value, got array`);
      return false;
    }
  }
  return true;
}

function validateCode(errors: ValidationError[], path: string, value: unknown, validCodes: string[]) {
  if (value === undefined) return;
  if (!isString(value)) {
    addError(errors, path, `Expected code (string), got ${typeof value}`);
    return;
  }
  if (!validCodes.includes(value)) {
    addError(errors, path, `Invalid code '${value}'. Valid codes: ${validCodes.join(", ")}`, "warning");
  }
}

// Complex type validators
function validateIdentifier(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected Identifier object`);
    return;
  }
  if (value.use !== undefined) {
    validateCode(errors, `${path}.use`, value.use, IDENTIFIER_USE_CODES);
  }
  if (value.system !== undefined && !isUri(value.system)) {
    addError(errors, `${path}.system`, `Invalid URI`);
  }
  if (value.value !== undefined && !isString(value.value)) {
    addError(errors, `${path}.value`, `Expected string`);
  }
}

function validateHumanName(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected HumanName object`);
    return;
  }
  if (value.use !== undefined) {
    validateCode(errors, `${path}.use`, value.use, NAME_USE_CODES);
  }
  if (value.family !== undefined && !isString(value.family)) {
    addError(errors, `${path}.family`, `Expected string`);
  }
  if (value.given !== undefined) {
    if (!isArray(value.given)) {
      addError(errors, `${path}.given`, `Expected array of strings`);
    } else {
      value.given.forEach((g, i) => {
        if (!isString(g)) addError(errors, `${path}.given[${i}]`, `Expected string`);
      });
    }
  }
  if (value.prefix !== undefined && !isArray(value.prefix)) {
    addError(errors, `${path}.prefix`, `Expected array`);
  }
  if (value.suffix !== undefined && !isArray(value.suffix)) {
    addError(errors, `${path}.suffix`, `Expected array`);
  }
}

function validateContactPoint(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected ContactPoint object`);
    return;
  }
  if (value.system !== undefined) {
    validateCode(errors, `${path}.system`, value.system, CONTACT_POINT_SYSTEM_CODES);
  }
  if (value.value !== undefined && !isString(value.value)) {
    addError(errors, `${path}.value`, `Expected string`);
  }
  if (value.use !== undefined) {
    validateCode(errors, `${path}.use`, value.use, CONTACT_POINT_USE_CODES);
  }
  if (value.rank !== undefined && !isInteger(value.rank)) {
    addError(errors, `${path}.rank`, `Expected positive integer`);
  }
}

function validateAddress(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected Address object`);
    return;
  }
  if (value.use !== undefined) {
    validateCode(errors, `${path}.use`, value.use, ADDRESS_USE_CODES);
  }
  if (value.type !== undefined) {
    validateCode(errors, `${path}.type`, value.type, ADDRESS_TYPE_CODES);
  }
  if (value.line !== undefined && !isArray(value.line)) {
    addError(errors, `${path}.line`, `Expected array of strings`);
  }
  ["city", "district", "state", "postalCode", "country"].forEach((field) => {
    if (value[field] !== undefined && !isString(value[field])) {
      addError(errors, `${path}.${field}`, `Expected string`);
    }
  });
}

function validateCodeableConcept(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected CodeableConcept object`);
    return;
  }
  if (value.coding !== undefined) {
    if (!isArray(value.coding)) {
      addError(errors, `${path}.coding`, `Expected array`);
    } else {
      value.coding.forEach((c, i) => {
        if (!isObject(c)) {
          addError(errors, `${path}.coding[${i}]`, `Expected Coding object`);
        } else {
          if (c.system !== undefined && !isUri(c.system)) {
            addError(errors, `${path}.coding[${i}].system`, `Invalid URI`);
          }
          if (c.code !== undefined && !isString(c.code)) {
            addError(errors, `${path}.coding[${i}].code`, `Expected string`);
          }
        }
      });
    }
  }
  if (value.text !== undefined && !isString(value.text)) {
    addError(errors, `${path}.text`, `Expected string`);
  }
}

function validateReference(errors: ValidationError[], path: string, value: unknown, targetTypes?: string[]) {
  if (!isObject(value)) {
    addError(errors, path, `Expected Reference object`);
    return;
  }
  if (value.reference !== undefined) {
    if (!isString(value.reference)) {
      addError(errors, `${path}.reference`, `Expected string`);
    } else if (targetTypes && targetTypes.length > 0) {
      const refType = value.reference.split("/")[0];
      if (!targetTypes.includes(refType) && !value.reference.startsWith("#") && !value.reference.startsWith("urn:")) {
        addError(errors, `${path}.reference`, `Reference should be to ${targetTypes.join(" | ")}, got ${refType}`, "warning");
      }
    }
  }
  if (value.type !== undefined && !isUri(value.type)) {
    addError(errors, `${path}.type`, `Invalid URI`);
  }
  if (value.display !== undefined && !isString(value.display)) {
    addError(errors, `${path}.display`, `Expected string`);
  }
}

function validateAttachment(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected Attachment object`);
    return;
  }
  if (value.contentType !== undefined && !isString(value.contentType)) {
    addError(errors, `${path}.contentType`, `Expected string (MIME type)`);
  }
  if (value.data !== undefined && !isString(value.data)) {
    addError(errors, `${path}.data`, `Expected base64 string`);
  }
  if (value.url !== undefined && !isUri(value.url)) {
    addError(errors, `${path}.url`, `Invalid URI`);
  }
}

function validatePeriod(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected Period object`);
    return;
  }
  if (value.start !== undefined && !isDateTime(value.start)) {
    addError(errors, `${path}.start`, `Invalid dateTime`);
  }
  if (value.end !== undefined && !isDateTime(value.end)) {
    addError(errors, `${path}.end`, `Invalid dateTime`);
  }
}

// Patient.contact validator
function validatePatientContact(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected object`);
    return;
  }

  // pat-1: SHALL at least contain a contact's details or a reference to an organization
  const hasDetails = value.name || value.telecom || value.address;
  const hasOrg = value.organization;
  if (!hasDetails && !hasOrg) {
    addError(errors, path, `Contact SHALL have at least name, telecom, address, or organization (pat-1)`);
  }

  if (value.relationship !== undefined) {
    if (!isArray(value.relationship)) {
      addError(errors, `${path}.relationship`, `Expected array`);
    } else {
      value.relationship.forEach((r, i) => validateCodeableConcept(errors, `${path}.relationship[${i}]`, r));
    }
  }

  if (value.name !== undefined) {
    validateHumanName(errors, `${path}.name`, value.name);
  }

  if (value.telecom !== undefined) {
    if (!isArray(value.telecom)) {
      addError(errors, `${path}.telecom`, `Expected array`);
    } else {
      value.telecom.forEach((t, i) => validateContactPoint(errors, `${path}.telecom[${i}]`, t));
    }
  }

  if (value.address !== undefined) {
    validateAddress(errors, `${path}.address`, value.address);
  }

  if (value.gender !== undefined) {
    validateCode(errors, `${path}.gender`, value.gender, GENDER_CODES);
  }

  if (value.organization !== undefined) {
    validateReference(errors, `${path}.organization`, value.organization, ["Organization"]);
  }

  if (value.period !== undefined) {
    validatePeriod(errors, `${path}.period`, value.period);
  }
}

// Patient.communication validator
function validatePatientCommunication(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected object`);
    return;
  }

  // language is required (min: 1)
  if (value.language === undefined) {
    addError(errors, `${path}.language`, `Required field missing (min: 1)`);
  } else {
    validateCodeableConcept(errors, `${path}.language`, value.language);
  }

  if (value.preferred !== undefined && !isBoolean(value.preferred)) {
    addError(errors, `${path}.preferred`, `Expected boolean`);
  }
}

// Patient.link validator
function validatePatientLink(errors: ValidationError[], path: string, value: unknown) {
  if (!isObject(value)) {
    addError(errors, path, `Expected object`);
    return;
  }

  // other is required (min: 1)
  if (value.other === undefined) {
    addError(errors, `${path}.other`, `Required field missing (min: 1)`);
  } else {
    validateReference(errors, `${path}.other`, value.other, ["Patient", "RelatedPerson"]);
  }

  // type is required (min: 1)
  if (value.type === undefined) {
    addError(errors, `${path}.type`, `Required field missing (min: 1)`);
  } else {
    validateCode(errors, `${path}.type`, value.type, LINK_TYPE_CODES);
  }
}

// Main Patient validator
export function validatePatient(resource: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isObject(resource)) {
    addError(errors, "Patient", "Resource must be an object");
    return { valid: false, errors };
  }

  // Check resourceType
  if (resource.resourceType !== "Patient") {
    addError(errors, "Patient.resourceType", `Expected 'Patient', got '${resource.resourceType}'`);
  }

  // Validate id (0..1, string)
  if (resource.id !== undefined && !isString(resource.id)) {
    addError(errors, "Patient.id", `Expected string`);
  }

  // Validate meta (0..1, Meta)
  if (resource.meta !== undefined && !isObject(resource.meta)) {
    addError(errors, "Patient.meta", `Expected Meta object`);
  }

  // Validate implicitRules (0..1, uri)
  if (resource.implicitRules !== undefined && !isUri(resource.implicitRules)) {
    addError(errors, "Patient.implicitRules", `Invalid URI`);
  }

  // Validate language (0..1, code)
  if (resource.language !== undefined && !isString(resource.language)) {
    addError(errors, "Patient.language", `Expected code (string)`);
  }

  // Validate identifier (0..*, Identifier)
  if (resource.identifier !== undefined) {
    if (!isArray(resource.identifier)) {
      addError(errors, "Patient.identifier", `Expected array`);
    } else {
      resource.identifier.forEach((id, i) => validateIdentifier(errors, `Patient.identifier[${i}]`, id));
    }
  }

  // Validate active (0..1, boolean)
  if (resource.active !== undefined && !isBoolean(resource.active)) {
    addError(errors, "Patient.active", `Expected boolean`);
  }

  // Validate name (0..*, HumanName)
  if (resource.name !== undefined) {
    if (!isArray(resource.name)) {
      addError(errors, "Patient.name", `Expected array`);
    } else {
      resource.name.forEach((n, i) => validateHumanName(errors, `Patient.name[${i}]`, n));
    }
  }

  // Validate telecom (0..*, ContactPoint)
  if (resource.telecom !== undefined) {
    if (!isArray(resource.telecom)) {
      addError(errors, "Patient.telecom", `Expected array`);
    } else {
      resource.telecom.forEach((t, i) => validateContactPoint(errors, `Patient.telecom[${i}]`, t));
    }
  }

  // Validate gender (0..1, code)
  if (resource.gender !== undefined) {
    validateCode(errors, "Patient.gender", resource.gender, GENDER_CODES);
  }

  // Validate birthDate (0..1, date)
  if (resource.birthDate !== undefined && !isDate(resource.birthDate)) {
    addError(errors, "Patient.birthDate", `Invalid date format (expected YYYY, YYYY-MM, or YYYY-MM-DD)`);
  }

  // Validate deceased[x] (0..1, boolean | dateTime)
  const deceasedBoolean = resource.deceasedBoolean;
  const deceasedDateTime = resource.deceasedDateTime;
  if (deceasedBoolean !== undefined && deceasedDateTime !== undefined) {
    addError(errors, "Patient.deceased[x]", `Cannot have both deceasedBoolean and deceasedDateTime`);
  }
  if (deceasedBoolean !== undefined && !isBoolean(deceasedBoolean)) {
    addError(errors, "Patient.deceasedBoolean", `Expected boolean`);
  }
  if (deceasedDateTime !== undefined && !isDateTime(deceasedDateTime)) {
    addError(errors, "Patient.deceasedDateTime", `Invalid dateTime`);
  }

  // Validate address (0..*, Address)
  if (resource.address !== undefined) {
    if (!isArray(resource.address)) {
      addError(errors, "Patient.address", `Expected array`);
    } else {
      resource.address.forEach((a, i) => validateAddress(errors, `Patient.address[${i}]`, a));
    }
  }

  // Validate maritalStatus (0..1, CodeableConcept)
  if (resource.maritalStatus !== undefined) {
    validateCodeableConcept(errors, "Patient.maritalStatus", resource.maritalStatus);
  }

  // Validate multipleBirth[x] (0..1, boolean | integer)
  const multipleBirthBoolean = resource.multipleBirthBoolean;
  const multipleBirthInteger = resource.multipleBirthInteger;
  if (multipleBirthBoolean !== undefined && multipleBirthInteger !== undefined) {
    addError(errors, "Patient.multipleBirth[x]", `Cannot have both multipleBirthBoolean and multipleBirthInteger`);
  }
  if (multipleBirthBoolean !== undefined && !isBoolean(multipleBirthBoolean)) {
    addError(errors, "Patient.multipleBirthBoolean", `Expected boolean`);
  }
  if (multipleBirthInteger !== undefined && !isInteger(multipleBirthInteger)) {
    addError(errors, "Patient.multipleBirthInteger", `Expected integer`);
  }

  // Validate photo (0..*, Attachment)
  if (resource.photo !== undefined) {
    if (!isArray(resource.photo)) {
      addError(errors, "Patient.photo", `Expected array`);
    } else {
      resource.photo.forEach((p, i) => validateAttachment(errors, `Patient.photo[${i}]`, p));
    }
  }

  // Validate contact (0..*, BackboneElement)
  if (resource.contact !== undefined) {
    if (!isArray(resource.contact)) {
      addError(errors, "Patient.contact", `Expected array`);
    } else {
      resource.contact.forEach((c, i) => validatePatientContact(errors, `Patient.contact[${i}]`, c));
    }
  }

  // Validate communication (0..*, BackboneElement)
  if (resource.communication !== undefined) {
    if (!isArray(resource.communication)) {
      addError(errors, "Patient.communication", `Expected array`);
    } else {
      resource.communication.forEach((c, i) => validatePatientCommunication(errors, `Patient.communication[${i}]`, c));
    }
  }

  // Validate generalPractitioner (0..*, Reference)
  if (resource.generalPractitioner !== undefined) {
    if (!isArray(resource.generalPractitioner)) {
      addError(errors, "Patient.generalPractitioner", `Expected array`);
    } else {
      resource.generalPractitioner.forEach((gp, i) =>
        validateReference(errors, `Patient.generalPractitioner[${i}]`, gp, ["Organization", "Practitioner", "PractitionerRole"])
      );
    }
  }

  // Validate managingOrganization (0..1, Reference)
  if (resource.managingOrganization !== undefined) {
    validateReference(errors, "Patient.managingOrganization", resource.managingOrganization, ["Organization"]);
  }

  // Validate link (0..*, BackboneElement)
  if (resource.link !== undefined) {
    if (!isArray(resource.link)) {
      addError(errors, "Patient.link", `Expected array`);
    } else {
      resource.link.forEach((l, i) => validatePatientLink(errors, `Patient.link[${i}]`, l));
    }
  }

  // Check for unknown properties
  const knownProperties = new Set([
    "resourceType", "id", "meta", "implicitRules", "language", "text", "contained",
    "extension", "modifierExtension", "identifier", "active", "name", "telecom",
    "gender", "birthDate", "deceasedBoolean", "deceasedDateTime", "address",
    "maritalStatus", "multipleBirthBoolean", "multipleBirthInteger", "photo",
    "contact", "communication", "generalPractitioner", "managingOrganization", "link"
  ]);

  for (const key of Object.keys(resource)) {
    if (!knownProperties.has(key)) {
      addError(errors, `Patient.${key}`, `Unknown property '${key}'`, "warning");
    }
  }

  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors
  };
}
