-- FHIR R4 PostgreSQL Schema
-- Generated from StructureDefinitions
-- Generated at: 2026-01-22T13:52:56.818Z

-- Patient-related resources (53 tables)
-- These have a patient_id column for efficient patient-scoped queries

-- Account
CREATE TABLE account (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX account_gin_idx ON account USING GIN(resource jsonb_path_ops);
CREATE INDEX account_patient_idx ON account(tenant_id, patient_id);

CREATE TABLE account_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- AdverseEvent
CREATE TABLE adverse_event (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX adverse_event_gin_idx ON adverse_event USING GIN(resource jsonb_path_ops);
CREATE INDEX adverse_event_patient_idx ON adverse_event(tenant_id, patient_id);

CREATE TABLE adverse_event_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- AllergyIntolerance
CREATE TABLE allergy_intolerance (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX allergy_intolerance_gin_idx ON allergy_intolerance USING GIN(resource jsonb_path_ops);
CREATE INDEX allergy_intolerance_patient_idx ON allergy_intolerance(tenant_id, patient_id);

CREATE TABLE allergy_intolerance_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- BodyStructure
CREATE TABLE body_structure (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX body_structure_gin_idx ON body_structure USING GIN(resource jsonb_path_ops);
CREATE INDEX body_structure_patient_idx ON body_structure(tenant_id, patient_id);

CREATE TABLE body_structure_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CarePlan
CREATE TABLE care_plan (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX care_plan_gin_idx ON care_plan USING GIN(resource jsonb_path_ops);
CREATE INDEX care_plan_patient_idx ON care_plan(tenant_id, patient_id);

CREATE TABLE care_plan_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CareTeam
CREATE TABLE care_team (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX care_team_gin_idx ON care_team USING GIN(resource jsonb_path_ops);
CREATE INDEX care_team_patient_idx ON care_team(tenant_id, patient_id);

CREATE TABLE care_team_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ChargeItem
CREATE TABLE charge_item (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX charge_item_gin_idx ON charge_item USING GIN(resource jsonb_path_ops);
CREATE INDEX charge_item_patient_idx ON charge_item(tenant_id, patient_id);

CREATE TABLE charge_item_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Claim
CREATE TABLE claim (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX claim_gin_idx ON claim USING GIN(resource jsonb_path_ops);
CREATE INDEX claim_patient_idx ON claim(tenant_id, patient_id);

CREATE TABLE claim_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ClaimResponse
CREATE TABLE claim_response (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX claim_response_gin_idx ON claim_response USING GIN(resource jsonb_path_ops);
CREATE INDEX claim_response_patient_idx ON claim_response(tenant_id, patient_id);

CREATE TABLE claim_response_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ClinicalImpression
CREATE TABLE clinical_impression (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX clinical_impression_gin_idx ON clinical_impression USING GIN(resource jsonb_path_ops);
CREATE INDEX clinical_impression_patient_idx ON clinical_impression(tenant_id, patient_id);

CREATE TABLE clinical_impression_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Communication
CREATE TABLE communication (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX communication_gin_idx ON communication USING GIN(resource jsonb_path_ops);
CREATE INDEX communication_patient_idx ON communication(tenant_id, patient_id);

CREATE TABLE communication_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CommunicationRequest
CREATE TABLE communication_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX communication_request_gin_idx ON communication_request USING GIN(resource jsonb_path_ops);
CREATE INDEX communication_request_patient_idx ON communication_request(tenant_id, patient_id);

CREATE TABLE communication_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Condition
CREATE TABLE condition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX condition_gin_idx ON condition USING GIN(resource jsonb_path_ops);
CREATE INDEX condition_patient_idx ON condition(tenant_id, patient_id);

CREATE TABLE condition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Consent
CREATE TABLE consent (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX consent_gin_idx ON consent USING GIN(resource jsonb_path_ops);
CREATE INDEX consent_patient_idx ON consent(tenant_id, patient_id);

CREATE TABLE consent_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CoverageEligibilityRequest
CREATE TABLE coverage_eligibility_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX coverage_eligibility_request_gin_idx ON coverage_eligibility_request USING GIN(resource jsonb_path_ops);
CREATE INDEX coverage_eligibility_request_patient_idx ON coverage_eligibility_request(tenant_id, patient_id);

CREATE TABLE coverage_eligibility_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CoverageEligibilityResponse
CREATE TABLE coverage_eligibility_response (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX coverage_eligibility_response_gin_idx ON coverage_eligibility_response USING GIN(resource jsonb_path_ops);
CREATE INDEX coverage_eligibility_response_patient_idx ON coverage_eligibility_response(tenant_id, patient_id);

CREATE TABLE coverage_eligibility_response_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DetectedIssue
CREATE TABLE detected_issue (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX detected_issue_gin_idx ON detected_issue USING GIN(resource jsonb_path_ops);
CREATE INDEX detected_issue_patient_idx ON detected_issue(tenant_id, patient_id);

CREATE TABLE detected_issue_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Device
CREATE TABLE device (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX device_gin_idx ON device USING GIN(resource jsonb_path_ops);
CREATE INDEX device_patient_idx ON device(tenant_id, patient_id);

CREATE TABLE device_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DeviceRequest
CREATE TABLE device_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX device_request_gin_idx ON device_request USING GIN(resource jsonb_path_ops);
CREATE INDEX device_request_patient_idx ON device_request(tenant_id, patient_id);

CREATE TABLE device_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DeviceUseStatement
CREATE TABLE device_use_statement (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX device_use_statement_gin_idx ON device_use_statement USING GIN(resource jsonb_path_ops);
CREATE INDEX device_use_statement_patient_idx ON device_use_statement(tenant_id, patient_id);

CREATE TABLE device_use_statement_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DiagnosticReport
CREATE TABLE diagnostic_report (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX diagnostic_report_gin_idx ON diagnostic_report USING GIN(resource jsonb_path_ops);
CREATE INDEX diagnostic_report_patient_idx ON diagnostic_report(tenant_id, patient_id);

CREATE TABLE diagnostic_report_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DocumentManifest
CREATE TABLE document_manifest (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX document_manifest_gin_idx ON document_manifest USING GIN(resource jsonb_path_ops);
CREATE INDEX document_manifest_patient_idx ON document_manifest(tenant_id, patient_id);

CREATE TABLE document_manifest_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DocumentReference
CREATE TABLE document_reference (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX document_reference_gin_idx ON document_reference USING GIN(resource jsonb_path_ops);
CREATE INDEX document_reference_patient_idx ON document_reference(tenant_id, patient_id);

CREATE TABLE document_reference_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Encounter
CREATE TABLE encounter (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX encounter_gin_idx ON encounter USING GIN(resource jsonb_path_ops);
CREATE INDEX encounter_patient_idx ON encounter(tenant_id, patient_id);

CREATE TABLE encounter_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- EpisodeOfCare
CREATE TABLE episode_of_care (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX episode_of_care_gin_idx ON episode_of_care USING GIN(resource jsonb_path_ops);
CREATE INDEX episode_of_care_patient_idx ON episode_of_care(tenant_id, patient_id);

CREATE TABLE episode_of_care_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ExplanationOfBenefit
CREATE TABLE explanation_of_benefit (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX explanation_of_benefit_gin_idx ON explanation_of_benefit USING GIN(resource jsonb_path_ops);
CREATE INDEX explanation_of_benefit_patient_idx ON explanation_of_benefit(tenant_id, patient_id);

CREATE TABLE explanation_of_benefit_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- FamilyMemberHistory
CREATE TABLE family_member_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX family_member_history_gin_idx ON family_member_history USING GIN(resource jsonb_path_ops);
CREATE INDEX family_member_history_patient_idx ON family_member_history(tenant_id, patient_id);

CREATE TABLE family_member_history_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Flag
CREATE TABLE flag (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX flag_gin_idx ON flag USING GIN(resource jsonb_path_ops);
CREATE INDEX flag_patient_idx ON flag(tenant_id, patient_id);

CREATE TABLE flag_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Goal
CREATE TABLE goal (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX goal_gin_idx ON goal USING GIN(resource jsonb_path_ops);
CREATE INDEX goal_patient_idx ON goal(tenant_id, patient_id);

CREATE TABLE goal_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- GuidanceResponse
CREATE TABLE guidance_response (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX guidance_response_gin_idx ON guidance_response USING GIN(resource jsonb_path_ops);
CREATE INDEX guidance_response_patient_idx ON guidance_response(tenant_id, patient_id);

CREATE TABLE guidance_response_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ImagingStudy
CREATE TABLE imaging_study (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX imaging_study_gin_idx ON imaging_study USING GIN(resource jsonb_path_ops);
CREATE INDEX imaging_study_patient_idx ON imaging_study(tenant_id, patient_id);

CREATE TABLE imaging_study_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Immunization
CREATE TABLE immunization (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX immunization_gin_idx ON immunization USING GIN(resource jsonb_path_ops);
CREATE INDEX immunization_patient_idx ON immunization(tenant_id, patient_id);

CREATE TABLE immunization_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ImmunizationEvaluation
CREATE TABLE immunization_evaluation (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX immunization_evaluation_gin_idx ON immunization_evaluation USING GIN(resource jsonb_path_ops);
CREATE INDEX immunization_evaluation_patient_idx ON immunization_evaluation(tenant_id, patient_id);

CREATE TABLE immunization_evaluation_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ImmunizationRecommendation
CREATE TABLE immunization_recommendation (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX immunization_recommendation_gin_idx ON immunization_recommendation USING GIN(resource jsonb_path_ops);
CREATE INDEX immunization_recommendation_patient_idx ON immunization_recommendation(tenant_id, patient_id);

CREATE TABLE immunization_recommendation_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Invoice
CREATE TABLE invoice (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX invoice_gin_idx ON invoice USING GIN(resource jsonb_path_ops);
CREATE INDEX invoice_patient_idx ON invoice(tenant_id, patient_id);

CREATE TABLE invoice_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- List
CREATE TABLE list (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX list_gin_idx ON list USING GIN(resource jsonb_path_ops);
CREATE INDEX list_patient_idx ON list(tenant_id, patient_id);

CREATE TABLE list_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MeasureReport
CREATE TABLE measure_report (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX measure_report_gin_idx ON measure_report USING GIN(resource jsonb_path_ops);
CREATE INDEX measure_report_patient_idx ON measure_report(tenant_id, patient_id);

CREATE TABLE measure_report_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Media
CREATE TABLE media (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX media_gin_idx ON media USING GIN(resource jsonb_path_ops);
CREATE INDEX media_patient_idx ON media(tenant_id, patient_id);

CREATE TABLE media_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicationAdministration
CREATE TABLE medication_administration (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medication_administration_gin_idx ON medication_administration USING GIN(resource jsonb_path_ops);
CREATE INDEX medication_administration_patient_idx ON medication_administration(tenant_id, patient_id);

CREATE TABLE medication_administration_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicationDispense
CREATE TABLE medication_dispense (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medication_dispense_gin_idx ON medication_dispense USING GIN(resource jsonb_path_ops);
CREATE INDEX medication_dispense_patient_idx ON medication_dispense(tenant_id, patient_id);

CREATE TABLE medication_dispense_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicationRequest
CREATE TABLE medication_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medication_request_gin_idx ON medication_request USING GIN(resource jsonb_path_ops);
CREATE INDEX medication_request_patient_idx ON medication_request(tenant_id, patient_id);

CREATE TABLE medication_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicationStatement
CREATE TABLE medication_statement (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medication_statement_gin_idx ON medication_statement USING GIN(resource jsonb_path_ops);
CREATE INDEX medication_statement_patient_idx ON medication_statement(tenant_id, patient_id);

CREATE TABLE medication_statement_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MolecularSequence
CREATE TABLE molecular_sequence (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX molecular_sequence_gin_idx ON molecular_sequence USING GIN(resource jsonb_path_ops);
CREATE INDEX molecular_sequence_patient_idx ON molecular_sequence(tenant_id, patient_id);

CREATE TABLE molecular_sequence_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- NutritionOrder
CREATE TABLE nutrition_order (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX nutrition_order_gin_idx ON nutrition_order USING GIN(resource jsonb_path_ops);
CREATE INDEX nutrition_order_patient_idx ON nutrition_order(tenant_id, patient_id);

CREATE TABLE nutrition_order_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Observation
CREATE TABLE observation (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX observation_gin_idx ON observation USING GIN(resource jsonb_path_ops);
CREATE INDEX observation_patient_idx ON observation(tenant_id, patient_id);

CREATE TABLE observation_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Procedure
CREATE TABLE procedure (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX procedure_gin_idx ON procedure USING GIN(resource jsonb_path_ops);
CREATE INDEX procedure_patient_idx ON procedure(tenant_id, patient_id);

CREATE TABLE procedure_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- RelatedPerson
CREATE TABLE related_person (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX related_person_gin_idx ON related_person USING GIN(resource jsonb_path_ops);
CREATE INDEX related_person_patient_idx ON related_person(tenant_id, patient_id);

CREATE TABLE related_person_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- RequestGroup
CREATE TABLE request_group (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX request_group_gin_idx ON request_group USING GIN(resource jsonb_path_ops);
CREATE INDEX request_group_patient_idx ON request_group(tenant_id, patient_id);

CREATE TABLE request_group_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- RiskAssessment
CREATE TABLE risk_assessment (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX risk_assessment_gin_idx ON risk_assessment USING GIN(resource jsonb_path_ops);
CREATE INDEX risk_assessment_patient_idx ON risk_assessment(tenant_id, patient_id);

CREATE TABLE risk_assessment_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ServiceRequest
CREATE TABLE service_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX service_request_gin_idx ON service_request USING GIN(resource jsonb_path_ops);
CREATE INDEX service_request_patient_idx ON service_request(tenant_id, patient_id);

CREATE TABLE service_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Specimen
CREATE TABLE specimen (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX specimen_gin_idx ON specimen USING GIN(resource jsonb_path_ops);
CREATE INDEX specimen_patient_idx ON specimen(tenant_id, patient_id);

CREATE TABLE specimen_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SupplyDelivery
CREATE TABLE supply_delivery (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX supply_delivery_gin_idx ON supply_delivery USING GIN(resource jsonb_path_ops);
CREATE INDEX supply_delivery_patient_idx ON supply_delivery(tenant_id, patient_id);

CREATE TABLE supply_delivery_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- VisionPrescription
CREATE TABLE vision_prescription (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX vision_prescription_gin_idx ON vision_prescription USING GIN(resource jsonb_path_ops);
CREATE INDEX vision_prescription_patient_idx ON vision_prescription(tenant_id, patient_id);

CREATE TABLE vision_prescription_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  patient_id UUID NOT NULL,  -- denormalized for fast patient-scoped queries
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Non-patient-related resources (94 tables)

-- ActivityDefinition
CREATE TABLE activity_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX activity_definition_gin_idx ON activity_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE activity_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Appointment
CREATE TABLE appointment (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX appointment_gin_idx ON appointment USING GIN(resource jsonb_path_ops);

CREATE TABLE appointment_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- AppointmentResponse
CREATE TABLE appointment_response (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX appointment_response_gin_idx ON appointment_response USING GIN(resource jsonb_path_ops);

CREATE TABLE appointment_response_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- AuditEvent
CREATE TABLE audit_event (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX audit_event_gin_idx ON audit_event USING GIN(resource jsonb_path_ops);

CREATE TABLE audit_event_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Basic
CREATE TABLE basic (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX basic_gin_idx ON basic USING GIN(resource jsonb_path_ops);

CREATE TABLE basic_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Binary
CREATE TABLE binary (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX binary_gin_idx ON binary USING GIN(resource jsonb_path_ops);

CREATE TABLE binary_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- BiologicallyDerivedProduct
CREATE TABLE biologically_derived_product (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX biologically_derived_product_gin_idx ON biologically_derived_product USING GIN(resource jsonb_path_ops);

CREATE TABLE biologically_derived_product_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Bundle
CREATE TABLE bundle (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX bundle_gin_idx ON bundle USING GIN(resource jsonb_path_ops);

CREATE TABLE bundle_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CapabilityStatement
CREATE TABLE capability_statement (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX capability_statement_gin_idx ON capability_statement USING GIN(resource jsonb_path_ops);

CREATE TABLE capability_statement_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CatalogEntry
CREATE TABLE catalog_entry (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX catalog_entry_gin_idx ON catalog_entry USING GIN(resource jsonb_path_ops);

CREATE TABLE catalog_entry_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ChargeItemDefinition
CREATE TABLE charge_item_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX charge_item_definition_gin_idx ON charge_item_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE charge_item_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CodeSystem
CREATE TABLE code_system (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX code_system_gin_idx ON code_system USING GIN(resource jsonb_path_ops);

CREATE TABLE code_system_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- CompartmentDefinition
CREATE TABLE compartment_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX compartment_definition_gin_idx ON compartment_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE compartment_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Composition
CREATE TABLE composition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX composition_gin_idx ON composition USING GIN(resource jsonb_path_ops);

CREATE TABLE composition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ConceptMap
CREATE TABLE concept_map (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX concept_map_gin_idx ON concept_map USING GIN(resource jsonb_path_ops);

CREATE TABLE concept_map_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Contract
CREATE TABLE contract (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX contract_gin_idx ON contract USING GIN(resource jsonb_path_ops);

CREATE TABLE contract_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Coverage
CREATE TABLE coverage (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX coverage_gin_idx ON coverage USING GIN(resource jsonb_path_ops);

CREATE TABLE coverage_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DeviceDefinition
CREATE TABLE device_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX device_definition_gin_idx ON device_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE device_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DeviceMetric
CREATE TABLE device_metric (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX device_metric_gin_idx ON device_metric USING GIN(resource jsonb_path_ops);

CREATE TABLE device_metric_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- DomainResource
CREATE TABLE domain_resource (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX domain_resource_gin_idx ON domain_resource USING GIN(resource jsonb_path_ops);

CREATE TABLE domain_resource_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- EffectEvidenceSynthesis
CREATE TABLE effect_evidence_synthesis (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX effect_evidence_synthesis_gin_idx ON effect_evidence_synthesis USING GIN(resource jsonb_path_ops);

CREATE TABLE effect_evidence_synthesis_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Endpoint
CREATE TABLE endpoint (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX endpoint_gin_idx ON endpoint USING GIN(resource jsonb_path_ops);

CREATE TABLE endpoint_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- EnrollmentRequest
CREATE TABLE enrollment_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX enrollment_request_gin_idx ON enrollment_request USING GIN(resource jsonb_path_ops);

CREATE TABLE enrollment_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- EnrollmentResponse
CREATE TABLE enrollment_response (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX enrollment_response_gin_idx ON enrollment_response USING GIN(resource jsonb_path_ops);

CREATE TABLE enrollment_response_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- EventDefinition
CREATE TABLE event_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX event_definition_gin_idx ON event_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE event_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Evidence
CREATE TABLE evidence (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX evidence_gin_idx ON evidence USING GIN(resource jsonb_path_ops);

CREATE TABLE evidence_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- EvidenceVariable
CREATE TABLE evidence_variable (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX evidence_variable_gin_idx ON evidence_variable USING GIN(resource jsonb_path_ops);

CREATE TABLE evidence_variable_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ExampleScenario
CREATE TABLE example_scenario (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX example_scenario_gin_idx ON example_scenario USING GIN(resource jsonb_path_ops);

CREATE TABLE example_scenario_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- GraphDefinition
CREATE TABLE graph_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX graph_definition_gin_idx ON graph_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE graph_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Group
CREATE TABLE group (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX group_gin_idx ON group USING GIN(resource jsonb_path_ops);

CREATE TABLE group_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- HealthcareService
CREATE TABLE healthcare_service (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX healthcare_service_gin_idx ON healthcare_service USING GIN(resource jsonb_path_ops);

CREATE TABLE healthcare_service_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ImplementationGuide
CREATE TABLE implementation_guide (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX implementation_guide_gin_idx ON implementation_guide USING GIN(resource jsonb_path_ops);

CREATE TABLE implementation_guide_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- InsurancePlan
CREATE TABLE insurance_plan (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX insurance_plan_gin_idx ON insurance_plan USING GIN(resource jsonb_path_ops);

CREATE TABLE insurance_plan_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Library
CREATE TABLE library (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX library_gin_idx ON library USING GIN(resource jsonb_path_ops);

CREATE TABLE library_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Linkage
CREATE TABLE linkage (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX linkage_gin_idx ON linkage USING GIN(resource jsonb_path_ops);

CREATE TABLE linkage_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Location
CREATE TABLE location (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX location_gin_idx ON location USING GIN(resource jsonb_path_ops);

CREATE TABLE location_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Measure
CREATE TABLE measure (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX measure_gin_idx ON measure USING GIN(resource jsonb_path_ops);

CREATE TABLE measure_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Medication
CREATE TABLE medication (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medication_gin_idx ON medication USING GIN(resource jsonb_path_ops);

CREATE TABLE medication_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicationKnowledge
CREATE TABLE medication_knowledge (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medication_knowledge_gin_idx ON medication_knowledge USING GIN(resource jsonb_path_ops);

CREATE TABLE medication_knowledge_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProduct
CREATE TABLE medicinal_product (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_gin_idx ON medicinal_product USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductAuthorization
CREATE TABLE medicinal_product_authorization (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_authorization_gin_idx ON medicinal_product_authorization USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_authorization_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductContraindication
CREATE TABLE medicinal_product_contraindication (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_contraindication_gin_idx ON medicinal_product_contraindication USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_contraindication_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductIndication
CREATE TABLE medicinal_product_indication (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_indication_gin_idx ON medicinal_product_indication USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_indication_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductIngredient
CREATE TABLE medicinal_product_ingredient (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_ingredient_gin_idx ON medicinal_product_ingredient USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_ingredient_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductInteraction
CREATE TABLE medicinal_product_interaction (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_interaction_gin_idx ON medicinal_product_interaction USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_interaction_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductManufactured
CREATE TABLE medicinal_product_manufactured (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_manufactured_gin_idx ON medicinal_product_manufactured USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_manufactured_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductPackaged
CREATE TABLE medicinal_product_packaged (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_packaged_gin_idx ON medicinal_product_packaged USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_packaged_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductPharmaceutical
CREATE TABLE medicinal_product_pharmaceutical (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_pharmaceutical_gin_idx ON medicinal_product_pharmaceutical USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_pharmaceutical_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MedicinalProductUndesirableEffect
CREATE TABLE medicinal_product_undesirable_effect (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX medicinal_product_undesirable_effect_gin_idx ON medicinal_product_undesirable_effect USING GIN(resource jsonb_path_ops);

CREATE TABLE medicinal_product_undesirable_effect_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MessageDefinition
CREATE TABLE message_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX message_definition_gin_idx ON message_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE message_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- MessageHeader
CREATE TABLE message_header (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX message_header_gin_idx ON message_header USING GIN(resource jsonb_path_ops);

CREATE TABLE message_header_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- NamingSystem
CREATE TABLE naming_system (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX naming_system_gin_idx ON naming_system USING GIN(resource jsonb_path_ops);

CREATE TABLE naming_system_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ObservationDefinition
CREATE TABLE observation_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX observation_definition_gin_idx ON observation_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE observation_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- OperationDefinition
CREATE TABLE operation_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX operation_definition_gin_idx ON operation_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE operation_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- OperationOutcome
CREATE TABLE operation_outcome (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX operation_outcome_gin_idx ON operation_outcome USING GIN(resource jsonb_path_ops);

CREATE TABLE operation_outcome_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Organization
CREATE TABLE organization (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX organization_gin_idx ON organization USING GIN(resource jsonb_path_ops);

CREATE TABLE organization_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- OrganizationAffiliation
CREATE TABLE organization_affiliation (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX organization_affiliation_gin_idx ON organization_affiliation USING GIN(resource jsonb_path_ops);

CREATE TABLE organization_affiliation_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Parameters
CREATE TABLE parameters (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX parameters_gin_idx ON parameters USING GIN(resource jsonb_path_ops);

CREATE TABLE parameters_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Patient
CREATE TABLE patient (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX patient_gin_idx ON patient USING GIN(resource jsonb_path_ops);

CREATE TABLE patient_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- PaymentNotice
CREATE TABLE payment_notice (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX payment_notice_gin_idx ON payment_notice USING GIN(resource jsonb_path_ops);

CREATE TABLE payment_notice_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- PaymentReconciliation
CREATE TABLE payment_reconciliation (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX payment_reconciliation_gin_idx ON payment_reconciliation USING GIN(resource jsonb_path_ops);

CREATE TABLE payment_reconciliation_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Person
CREATE TABLE person (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX person_gin_idx ON person USING GIN(resource jsonb_path_ops);

CREATE TABLE person_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- PlanDefinition
CREATE TABLE plan_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX plan_definition_gin_idx ON plan_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE plan_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Practitioner
CREATE TABLE practitioner (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX practitioner_gin_idx ON practitioner USING GIN(resource jsonb_path_ops);

CREATE TABLE practitioner_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- PractitionerRole
CREATE TABLE practitioner_role (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX practitioner_role_gin_idx ON practitioner_role USING GIN(resource jsonb_path_ops);

CREATE TABLE practitioner_role_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Provenance
CREATE TABLE provenance (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX provenance_gin_idx ON provenance USING GIN(resource jsonb_path_ops);

CREATE TABLE provenance_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Questionnaire
CREATE TABLE questionnaire (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX questionnaire_gin_idx ON questionnaire USING GIN(resource jsonb_path_ops);

CREATE TABLE questionnaire_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- QuestionnaireResponse
CREATE TABLE questionnaire_response (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX questionnaire_response_gin_idx ON questionnaire_response USING GIN(resource jsonb_path_ops);

CREATE TABLE questionnaire_response_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ResearchDefinition
CREATE TABLE research_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX research_definition_gin_idx ON research_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE research_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ResearchElementDefinition
CREATE TABLE research_element_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX research_element_definition_gin_idx ON research_element_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE research_element_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ResearchStudy
CREATE TABLE research_study (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX research_study_gin_idx ON research_study USING GIN(resource jsonb_path_ops);

CREATE TABLE research_study_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ResearchSubject
CREATE TABLE research_subject (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX research_subject_gin_idx ON research_subject USING GIN(resource jsonb_path_ops);

CREATE TABLE research_subject_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- RiskEvidenceSynthesis
CREATE TABLE risk_evidence_synthesis (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX risk_evidence_synthesis_gin_idx ON risk_evidence_synthesis USING GIN(resource jsonb_path_ops);

CREATE TABLE risk_evidence_synthesis_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Schedule
CREATE TABLE schedule (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX schedule_gin_idx ON schedule USING GIN(resource jsonb_path_ops);

CREATE TABLE schedule_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SearchParameter
CREATE TABLE search_parameter (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX search_parameter_gin_idx ON search_parameter USING GIN(resource jsonb_path_ops);

CREATE TABLE search_parameter_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Slot
CREATE TABLE slot (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX slot_gin_idx ON slot USING GIN(resource jsonb_path_ops);

CREATE TABLE slot_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SpecimenDefinition
CREATE TABLE specimen_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX specimen_definition_gin_idx ON specimen_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE specimen_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- StructureDefinition
CREATE TABLE structure_definition (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX structure_definition_gin_idx ON structure_definition USING GIN(resource jsonb_path_ops);

CREATE TABLE structure_definition_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- StructureMap
CREATE TABLE structure_map (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX structure_map_gin_idx ON structure_map USING GIN(resource jsonb_path_ops);

CREATE TABLE structure_map_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Subscription
CREATE TABLE subscription (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX subscription_gin_idx ON subscription USING GIN(resource jsonb_path_ops);

CREATE TABLE subscription_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Substance
CREATE TABLE substance (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_gin_idx ON substance USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SubstanceNucleicAcid
CREATE TABLE substance_nucleic_acid (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_nucleic_acid_gin_idx ON substance_nucleic_acid USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_nucleic_acid_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SubstancePolymer
CREATE TABLE substance_polymer (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_polymer_gin_idx ON substance_polymer USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_polymer_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SubstanceProtein
CREATE TABLE substance_protein (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_protein_gin_idx ON substance_protein USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_protein_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SubstanceReferenceInformation
CREATE TABLE substance_reference_information (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_reference_information_gin_idx ON substance_reference_information USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_reference_information_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SubstanceSourceMaterial
CREATE TABLE substance_source_material (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_source_material_gin_idx ON substance_source_material USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_source_material_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SubstanceSpecification
CREATE TABLE substance_specification (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX substance_specification_gin_idx ON substance_specification USING GIN(resource jsonb_path_ops);

CREATE TABLE substance_specification_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- SupplyRequest
CREATE TABLE supply_request (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX supply_request_gin_idx ON supply_request USING GIN(resource jsonb_path_ops);

CREATE TABLE supply_request_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- Task
CREATE TABLE task (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX task_gin_idx ON task USING GIN(resource jsonb_path_ops);

CREATE TABLE task_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- TerminologyCapabilities
CREATE TABLE terminology_capabilities (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX terminology_capabilities_gin_idx ON terminology_capabilities USING GIN(resource jsonb_path_ops);

CREATE TABLE terminology_capabilities_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- TestReport
CREATE TABLE test_report (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX test_report_gin_idx ON test_report USING GIN(resource jsonb_path_ops);

CREATE TABLE test_report_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- TestScript
CREATE TABLE test_script (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX test_script_gin_idx ON test_script USING GIN(resource jsonb_path_ops);

CREATE TABLE test_script_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- ValueSet
CREATE TABLE value_set (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX value_set_gin_idx ON value_set USING GIN(resource jsonb_path_ops);

CREATE TABLE value_set_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);

-- VerificationResult
CREATE TABLE verification_result (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id)
);

CREATE INDEX verification_result_gin_idx ON verification_result USING GIN(resource jsonb_path_ops);

CREATE TABLE verification_result_history (
  tenant_id UUID NOT NULL,
  id UUID NOT NULL,
  version_id UUID NOT NULL,
  resource JSONB NOT NULL,
  PRIMARY KEY (tenant_id, id, version_id)
);
