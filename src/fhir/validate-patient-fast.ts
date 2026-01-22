/**
 * Optimized Patient validation - performance focused
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

// Pre-computed Sets for O(1) lookup (moved outside function)
const GENDER_CODES = new Set(["male", "female", "other", "unknown"]);
const LINK_TYPE_CODES = new Set(["replaced-by", "replaces", "refer", "seealso"]);
const NAME_USE_CODES = new Set(["usual", "official", "temp", "nickname", "anonymous", "old", "maiden"]);
const ADDRESS_USE_CODES = new Set(["home", "work", "temp", "old", "billing"]);
const ADDRESS_TYPE_CODES = new Set(["postal", "physical", "both"]);
const CONTACT_POINT_SYSTEM_CODES = new Set(["phone", "fax", "email", "pager", "url", "sms", "other"]);
const CONTACT_POINT_USE_CODES = new Set(["home", "work", "temp", "old", "mobile"]);
const IDENTIFIER_USE_CODES = new Set(["usual", "official", "temp", "secondary", "old"]);

const KNOWN_PROPERTIES = new Set([
  "resourceType", "id", "meta", "implicitRules", "language", "text", "contained",
  "extension", "modifierExtension", "identifier", "active", "name", "telecom",
  "gender", "birthDate", "deceasedBoolean", "deceasedDateTime", "address",
  "maritalStatus", "multipleBirthBoolean", "multipleBirthInteger", "photo",
  "contact", "communication", "generalPractitioner", "managingOrganization", "link"
]);

// Pre-compiled regex patterns
const DATE_PATTERN = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const DATETIME_PATTERN = /^\d{4}(-\d{2}(-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?)?)?$/;

// Validation context to track errors and error count
interface ValidationContext {
  errors: ValidationError[];
  errorCount: number;
}

function addError(ctx: ValidationContext, path: string, message: string, isWarning = false): void {
  ctx.errors.push({ path, message, severity: isWarning ? "warning" : "error" });
  if (!isWarning) ctx.errorCount++;
}

// Inline type checks for performance
const isStr = (v: unknown): v is string => typeof v === "string";
const isBool = (v: unknown): v is boolean => typeof v === "boolean";
const isInt = (v: unknown): v is number => typeof v === "number" && (v | 0) === v;
const isArr = Array.isArray;
const isObj = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !isArr(v);

function validateIdentifier(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected Identifier object"); return; }
  const use = v.use;
  if (use !== undefined && (!isStr(use) || !IDENTIFIER_USE_CODES.has(use))) {
    addError(ctx, path + ".use", "Invalid identifier use code", !isStr(use));
  }
  if (v.system !== undefined && !isStr(v.system)) addError(ctx, path + ".system", "Expected string");
  if (v.value !== undefined && !isStr(v.value)) addError(ctx, path + ".value", "Expected string");
}

function validateHumanName(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected HumanName object"); return; }
  const use = v.use;
  if (use !== undefined && (!isStr(use) || !NAME_USE_CODES.has(use))) {
    addError(ctx, path + ".use", "Invalid name use code", !isStr(use));
  }
  if (v.family !== undefined && !isStr(v.family)) addError(ctx, path + ".family", "Expected string");
  const given = v.given;
  if (given !== undefined) {
    if (!isArr(given)) {
      addError(ctx, path + ".given", "Expected array");
    } else {
      for (let i = 0; i < given.length; i++) {
        if (!isStr(given[i])) addError(ctx, path + ".given[" + i + "]", "Expected string");
      }
    }
  }
  if (v.prefix !== undefined && !isArr(v.prefix)) addError(ctx, path + ".prefix", "Expected array");
  if (v.suffix !== undefined && !isArr(v.suffix)) addError(ctx, path + ".suffix", "Expected array");
}

function validateContactPoint(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected ContactPoint object"); return; }
  const sys = v.system;
  if (sys !== undefined && (!isStr(sys) || !CONTACT_POINT_SYSTEM_CODES.has(sys))) {
    addError(ctx, path + ".system", "Invalid system code", !isStr(sys));
  }
  if (v.value !== undefined && !isStr(v.value)) addError(ctx, path + ".value", "Expected string");
  const use = v.use;
  if (use !== undefined && (!isStr(use) || !CONTACT_POINT_USE_CODES.has(use))) {
    addError(ctx, path + ".use", "Invalid use code", !isStr(use));
  }
  if (v.rank !== undefined && !isInt(v.rank)) addError(ctx, path + ".rank", "Expected integer");
}

function validateAddress(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected Address object"); return; }
  const use = v.use;
  if (use !== undefined && (!isStr(use) || !ADDRESS_USE_CODES.has(use))) {
    addError(ctx, path + ".use", "Invalid use code", !isStr(use));
  }
  const type = v.type;
  if (type !== undefined && (!isStr(type) || !ADDRESS_TYPE_CODES.has(type))) {
    addError(ctx, path + ".type", "Invalid type code", !isStr(type));
  }
  if (v.line !== undefined && !isArr(v.line)) addError(ctx, path + ".line", "Expected array");
  if (v.city !== undefined && !isStr(v.city)) addError(ctx, path + ".city", "Expected string");
  if (v.district !== undefined && !isStr(v.district)) addError(ctx, path + ".district", "Expected string");
  if (v.state !== undefined && !isStr(v.state)) addError(ctx, path + ".state", "Expected string");
  if (v.postalCode !== undefined && !isStr(v.postalCode)) addError(ctx, path + ".postalCode", "Expected string");
  if (v.country !== undefined && !isStr(v.country)) addError(ctx, path + ".country", "Expected string");
}

function validateCodeableConcept(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected CodeableConcept object"); return; }
  const coding = v.coding;
  if (coding !== undefined) {
    if (!isArr(coding)) {
      addError(ctx, path + ".coding", "Expected array");
    } else {
      for (let i = 0; i < coding.length; i++) {
        const c = coding[i];
        if (!isObj(c)) {
          addError(ctx, path + ".coding[" + i + "]", "Expected Coding object");
        } else {
          if (c.system !== undefined && !isStr(c.system)) addError(ctx, path + ".coding[" + i + "].system", "Expected string");
          if (c.code !== undefined && !isStr(c.code)) addError(ctx, path + ".coding[" + i + "].code", "Expected string");
        }
      }
    }
  }
  if (v.text !== undefined && !isStr(v.text)) addError(ctx, path + ".text", "Expected string");
}

function validateReference(ctx: ValidationContext, path: string, v: unknown, targetTypes?: readonly string[]): void {
  if (!isObj(v)) { addError(ctx, path, "Expected Reference object"); return; }
  const ref = v.reference;
  if (ref !== undefined) {
    if (!isStr(ref)) {
      addError(ctx, path + ".reference", "Expected string");
    } else if (targetTypes && ref[0] !== "#" && ref.slice(0, 4) !== "urn:") {
      const slashIdx = ref.indexOf("/");
      if (slashIdx > 0) {
        const refType = ref.slice(0, slashIdx);
        let found = false;
        for (let i = 0; i < targetTypes.length; i++) {
          if (targetTypes[i] === refType) { found = true; break; }
        }
        if (!found) addError(ctx, path + ".reference", "Invalid reference target", true);
      }
    }
  }
  if (v.type !== undefined && !isStr(v.type)) addError(ctx, path + ".type", "Expected string");
  if (v.display !== undefined && !isStr(v.display)) addError(ctx, path + ".display", "Expected string");
}

function validateAttachment(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected Attachment object"); return; }
  if (v.contentType !== undefined && !isStr(v.contentType)) addError(ctx, path + ".contentType", "Expected string");
  if (v.data !== undefined && !isStr(v.data)) addError(ctx, path + ".data", "Expected string");
  if (v.url !== undefined && !isStr(v.url)) addError(ctx, path + ".url", "Expected string");
}

function validatePeriod(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected Period object"); return; }
  if (v.start !== undefined && (!isStr(v.start) || !DATETIME_PATTERN.test(v.start))) {
    addError(ctx, path + ".start", "Invalid dateTime");
  }
  if (v.end !== undefined && (!isStr(v.end) || !DATETIME_PATTERN.test(v.end))) {
    addError(ctx, path + ".end", "Invalid dateTime");
  }
}

const GP_TARGETS = ["Organization", "Practitioner", "PractitionerRole"] as const;
const LINK_TARGETS = ["Patient", "RelatedPerson"] as const;
const ORG_TARGETS = ["Organization"] as const;

function validatePatientContact(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected object"); return; }

  // pat-1 constraint
  if (!v.name && !v.telecom && !v.address && !v.organization) {
    addError(ctx, path, "Contact SHALL have name, telecom, address, or organization (pat-1)");
  }

  const rel = v.relationship;
  if (rel !== undefined) {
    if (!isArr(rel)) {
      addError(ctx, path + ".relationship", "Expected array");
    } else {
      for (let i = 0; i < rel.length; i++) {
        validateCodeableConcept(ctx, path + ".relationship[" + i + "]", rel[i]);
      }
    }
  }

  if (v.name !== undefined) validateHumanName(ctx, path + ".name", v.name);

  const tel = v.telecom;
  if (tel !== undefined) {
    if (!isArr(tel)) {
      addError(ctx, path + ".telecom", "Expected array");
    } else {
      for (let i = 0; i < tel.length; i++) {
        validateContactPoint(ctx, path + ".telecom[" + i + "]", tel[i]);
      }
    }
  }

  if (v.address !== undefined) validateAddress(ctx, path + ".address", v.address);

  const gender = v.gender;
  if (gender !== undefined && (!isStr(gender) || !GENDER_CODES.has(gender))) {
    addError(ctx, path + ".gender", "Invalid gender code", !isStr(gender));
  }

  if (v.organization !== undefined) validateReference(ctx, path + ".organization", v.organization, ORG_TARGETS);
  if (v.period !== undefined) validatePeriod(ctx, path + ".period", v.period);
}

function validatePatientCommunication(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected object"); return; }

  if (v.language === undefined) {
    addError(ctx, path + ".language", "Required field missing");
  } else {
    validateCodeableConcept(ctx, path + ".language", v.language);
  }

  if (v.preferred !== undefined && !isBool(v.preferred)) {
    addError(ctx, path + ".preferred", "Expected boolean");
  }
}

function validatePatientLink(ctx: ValidationContext, path: string, v: unknown): void {
  if (!isObj(v)) { addError(ctx, path, "Expected object"); return; }

  if (v.other === undefined) {
    addError(ctx, path + ".other", "Required field missing");
  } else {
    validateReference(ctx, path + ".other", v.other, LINK_TARGETS);
  }

  const type = v.type;
  if (type === undefined) {
    addError(ctx, path + ".type", "Required field missing");
  } else if (!isStr(type) || !LINK_TYPE_CODES.has(type)) {
    addError(ctx, path + ".type", "Invalid link type code");
  }
}

export function validatePatient(resource: unknown): ValidationResult {
  const ctx: ValidationContext = { errors: [], errorCount: 0 };

  if (!isObj(resource)) {
    addError(ctx, "Patient", "Resource must be an object");
    return { valid: false, errors: ctx.errors };
  }

  // resourceType check
  if (resource.resourceType !== "Patient") {
    addError(ctx, "Patient.resourceType", "Expected 'Patient'");
  }

  // Simple field validations
  if (resource.id !== undefined && !isStr(resource.id)) addError(ctx, "Patient.id", "Expected string");
  if (resource.meta !== undefined && !isObj(resource.meta)) addError(ctx, "Patient.meta", "Expected object");
  if (resource.implicitRules !== undefined && !isStr(resource.implicitRules)) addError(ctx, "Patient.implicitRules", "Expected string");
  if (resource.language !== undefined && !isStr(resource.language)) addError(ctx, "Patient.language", "Expected string");
  if (resource.active !== undefined && !isBool(resource.active)) addError(ctx, "Patient.active", "Expected boolean");

  // identifier array
  const identifier = resource.identifier;
  if (identifier !== undefined) {
    if (!isArr(identifier)) {
      addError(ctx, "Patient.identifier", "Expected array");
    } else {
      for (let i = 0; i < identifier.length; i++) {
        validateIdentifier(ctx, "Patient.identifier[" + i + "]", identifier[i]);
      }
    }
  }

  // name array
  const name = resource.name;
  if (name !== undefined) {
    if (!isArr(name)) {
      addError(ctx, "Patient.name", "Expected array");
    } else {
      for (let i = 0; i < name.length; i++) {
        validateHumanName(ctx, "Patient.name[" + i + "]", name[i]);
      }
    }
  }

  // telecom array
  const telecom = resource.telecom;
  if (telecom !== undefined) {
    if (!isArr(telecom)) {
      addError(ctx, "Patient.telecom", "Expected array");
    } else {
      for (let i = 0; i < telecom.length; i++) {
        validateContactPoint(ctx, "Patient.telecom[" + i + "]", telecom[i]);
      }
    }
  }

  // gender code
  const gender = resource.gender;
  if (gender !== undefined && (!isStr(gender) || !GENDER_CODES.has(gender))) {
    addError(ctx, "Patient.gender", "Invalid gender code");
  }

  // birthDate
  const birthDate = resource.birthDate;
  if (birthDate !== undefined && (!isStr(birthDate) || !DATE_PATTERN.test(birthDate))) {
    addError(ctx, "Patient.birthDate", "Invalid date format");
  }

  // deceased[x]
  const deceasedBoolean = resource.deceasedBoolean;
  const deceasedDateTime = resource.deceasedDateTime;
  if (deceasedBoolean !== undefined && deceasedDateTime !== undefined) {
    addError(ctx, "Patient.deceased[x]", "Cannot have both deceasedBoolean and deceasedDateTime");
  }
  if (deceasedBoolean !== undefined && !isBool(deceasedBoolean)) addError(ctx, "Patient.deceasedBoolean", "Expected boolean");
  if (deceasedDateTime !== undefined && (!isStr(deceasedDateTime) || !DATETIME_PATTERN.test(deceasedDateTime))) {
    addError(ctx, "Patient.deceasedDateTime", "Invalid dateTime");
  }

  // address array
  const address = resource.address;
  if (address !== undefined) {
    if (!isArr(address)) {
      addError(ctx, "Patient.address", "Expected array");
    } else {
      for (let i = 0; i < address.length; i++) {
        validateAddress(ctx, "Patient.address[" + i + "]", address[i]);
      }
    }
  }

  // maritalStatus
  if (resource.maritalStatus !== undefined) {
    validateCodeableConcept(ctx, "Patient.maritalStatus", resource.maritalStatus);
  }

  // multipleBirth[x]
  const multipleBirthBoolean = resource.multipleBirthBoolean;
  const multipleBirthInteger = resource.multipleBirthInteger;
  if (multipleBirthBoolean !== undefined && multipleBirthInteger !== undefined) {
    addError(ctx, "Patient.multipleBirth[x]", "Cannot have both multipleBirthBoolean and multipleBirthInteger");
  }
  if (multipleBirthBoolean !== undefined && !isBool(multipleBirthBoolean)) addError(ctx, "Patient.multipleBirthBoolean", "Expected boolean");
  if (multipleBirthInteger !== undefined && !isInt(multipleBirthInteger)) addError(ctx, "Patient.multipleBirthInteger", "Expected integer");

  // photo array
  const photo = resource.photo;
  if (photo !== undefined) {
    if (!isArr(photo)) {
      addError(ctx, "Patient.photo", "Expected array");
    } else {
      for (let i = 0; i < photo.length; i++) {
        validateAttachment(ctx, "Patient.photo[" + i + "]", photo[i]);
      }
    }
  }

  // contact array
  const contact = resource.contact;
  if (contact !== undefined) {
    if (!isArr(contact)) {
      addError(ctx, "Patient.contact", "Expected array");
    } else {
      for (let i = 0; i < contact.length; i++) {
        validatePatientContact(ctx, "Patient.contact[" + i + "]", contact[i]);
      }
    }
  }

  // communication array
  const communication = resource.communication;
  if (communication !== undefined) {
    if (!isArr(communication)) {
      addError(ctx, "Patient.communication", "Expected array");
    } else {
      for (let i = 0; i < communication.length; i++) {
        validatePatientCommunication(ctx, "Patient.communication[" + i + "]", communication[i]);
      }
    }
  }

  // generalPractitioner array
  const gp = resource.generalPractitioner;
  if (gp !== undefined) {
    if (!isArr(gp)) {
      addError(ctx, "Patient.generalPractitioner", "Expected array");
    } else {
      for (let i = 0; i < gp.length; i++) {
        validateReference(ctx, "Patient.generalPractitioner[" + i + "]", gp[i], GP_TARGETS);
      }
    }
  }

  // managingOrganization
  if (resource.managingOrganization !== undefined) {
    validateReference(ctx, "Patient.managingOrganization", resource.managingOrganization, ORG_TARGETS);
  }

  // link array
  const link = resource.link;
  if (link !== undefined) {
    if (!isArr(link)) {
      addError(ctx, "Patient.link", "Expected array");
    } else {
      for (let i = 0; i < link.length; i++) {
        validatePatientLink(ctx, "Patient.link[" + i + "]", link[i]);
      }
    }
  }

  // Unknown properties check
  const keys = Object.keys(resource);
  for (let i = 0; i < keys.length; i++) {
    if (!KNOWN_PROPERTIES.has(keys[i])) {
      addError(ctx, "Patient." + keys[i], "Unknown property", true);
    }
  }

  return { valid: ctx.errorCount === 0, errors: ctx.errors };
}
