ALTER TABLE exercise
DROP COLUMN Title;

ALTER TABLE exercise
DROP COLUMN Subtitle;

ALTER TABLE exercise
DROP COLUMN Description;

ALTER TABLE exercise
ADD Name varchar(255) NULL DEFAULT '';