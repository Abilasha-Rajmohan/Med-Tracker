CREATE TABLE patient
(
patient_id SERIAL PRIMARY KEY,
first_name varchar(1000),
last_name varchar(1000),
gender varchar(100),
date_of_birth DATE,
phone varchar(100),
email varchar(100),
address varchar(1000),
created_on timestamp,
updated_on timestamp,
active boolean,
hashed_password varchar
);

CREATE TABLE medication
(
medication_id SERIAL PRIMARY KEY,
patient_id int references patient(patient_id),
medication_name varchar(1000),
code varchar(1000),
dosage NUMERIC(11,2),
dosage_unit varchar(100),
dosage_form varchar(100),
dosage_frequency varchar(2000),
medication_info jsonb,
medication_start_date DATE,
notes varchar(4000),
created_on timestamp,
updated_on timestamp,
active boolean
);

CREATE TABLE health_condition
(
health_condition_id SERIAL PRIMARY KEY,
patient_id int references patient(patient_id),
condition_name varchar(4000),
code varchar(1000),
diagnosed_on timestamp,
condition_info JSONB,
notes varchar(4000),
created_on timestamp,
updated_on timestamp,
active boolean
);

CREATE TYPE Speciality_type as enum (
'GENERAL_PRACTITIONER',
'SPECIALIST',
'CONSULTANT'
);


CREATE TABLE provider
(
provider_id SERIAL PRIMARY KEY,
name Varchar(1000), 
npi_number varchar(1000),
speciality_type speciality_type,
speciality varchar(1000),
phone varchar(100),
email varchar(100),
primary_facility varchar(1000),
created_on timestamp,
updated_on timestamp,
active boolean
);


CREATE TABLE patient_provider_xref
(
patient_provider_xref_id SERIAL PRIMARY KEY,
patient_id int references patient(patient_id),
provider_id int references provider(provider_id),
provider_portal_patient_id VARCHAR(1000),
patient_since timestamp,
last_visit timestamp
);

CREATE TABLE adverse_side_effect
(
adverse_side_effect_id SERIAL PRIMARY KEY,
patient_id int references patient(patient_id),
symptom varchar(4000),
notes varchar(4000),
onset_date date,
created_on timestamp,
updated_on timestamp,
active boolean
);

CREATE TABLE adverse_side_effect_detail
(
adverse_side_effect_detail_id SERIAL PRIMARY KEY,
adverse_side_effect_id int references adverse_side_effect(adverse_side_effect_id),
observation varchar(4000),
observation_value varchar(4000),
intensity_type  varchar(4000),
intensity_score int,
intensity_value varchar(4000),
time_of_occcurence timestamp,
notes varchar(4000),
created_on timestamp,
updated_on timestamp,
active boolean
);


-- Add 10 patients
INSERT INTO patient (first_name, last_name, gender, date_of_birth, phone, email, address, created_on, updated_on, active, hashed_password)
VALUES
    ('John', 'Doe', 'Male', '1985-05-15', '555-1234', 'johndoe@example.com', '123 Main St, Cityville', NOW(), NOW(), TRUE, ''),
    ('Jane', 'Smith', 'Female', '1990-10-20', '555-5678', 'janesmith@example.com', '456 Elm St, Townsville', NOW(), NOW(), TRUE, ''),
    ('Robert', 'Johnson', 'Male', '1972-03-30', '555-8765', 'robertjohnson@example.com', '789 Oak St, Villagetown', NOW(), NOW(), TRUE, '$2b$12$t6u0A5lcA5qtwqsLYf3mLuDynQZrVxXCgv6WwD4we6yPWNgsG.ZT2'),
    ('Emily', 'Davis', 'Female', '2000-07-12', '555-3456', 'emilydavis@example.com', '101 Maple St, Cityplace', NOW(), NOW(), TRUE, ''),
    ('Michael', 'Brown', 'Male', '1983-12-02', '555-2345', 'michaelbrown@example.com', '202 Pine St, Suburbia', NOW(), NOW(), TRUE, ''),
    ('Sarah', 'Wilson', 'Female', '1995-08-25', '555-6543', 'sarahwilson@example.com', '303 Cedar St, Metrocity', NOW(), NOW(), TRUE, ''),
    ('David', 'Lee', 'Male', '1978-01-18', '555-7890', 'davidlee@example.com', '404 Birch St, Uptown', NOW(), NOW(), FALSE, ''),
    ('Laura', 'Clark', 'Female', '1992-11-30', '555-8901', 'lauraclark@example.com', '505 Spruce St, Countryside', NOW(), NOW(), TRUE, ''),
    ('Chris', 'Walker', 'Male', '1987-04-05', '555-1230', 'chriswalker@example.com', '606 Walnut St, Riverside', NOW(), NOW(), TRUE, ''),
    ('Anna', 'Lopez', 'Female', '1989-06-22', '555-4321', 'annalopez@example.com', '707 Cypress St, Coastalview', NOW(), NOW(), FALSE, '');

-- Alter speciality_type to VARCHAR
ALTER TABLE provider
ALTER COLUMN speciality_type TYPE TEXT;
ALTER TABLE provider
ALTER COLUMN speciality_type TYPE VARCHAR;
