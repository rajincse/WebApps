CREATE DATABASE ada;
USE ada;

DROP TABLE additional_properties;
CREATE TABLE additional_properties
(
	id INT PRIMARY KEY AUTO_INCREMENT,
	property_name varchar(200)
);

DROP TABLE additional_property_values;
CREATE TABLE additional_property_values
(
	id INT PRIMARY KEY AUTO_INCREMENT,
	property_id INT,
	element_id VARCHAR(100),
	property_value VARCHAR(300)
);

INSERT INTO additional_properties(property_name) VALUES ('difficulty');
SELECT id, property_name FROM additional_properties;

SELECT * FROM additional_property_values;
INSERT INTO additional_property_values(property_id, element_id,property_value)
VALUES ( 1, 'c0m0t0', 'advanced');

SELECT * FROM additional_property_values;
SELECT V.element_id, V.property_id, P.property_name , V.property_value 
FROM additional_property_values AS V 
INNER JOIN additional_properties AS P ON P.id = V.property_id
WHERE FIND_IN_SET( V.element_id, 'c0p0,c0m0t0');

INSERT INTO additional_property_values(property_id, element_id,property_value)
VALUES  ( 1, 'c0m0s0i0a2', 'hard') , ( 1, 'c0m0s0p1', 'hard') ;
TRUNCATE TABLE additional_property_values;