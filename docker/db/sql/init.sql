USE tokyomap_auth;

/* create tables */
START TRANSACTION;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    userId INT(5) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    screenName VARCHAR(128) NOT NULL,
    twitterId VARCHAR(256) NOT NULL UNIQUE,
    profileImageUrl VARCHAR(256)
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin ENGINE=InnoDB;
COMMIT;

/* initailise tables */
-- BEGIN;
-- LOAD DATA INFILE "/docker-entrypoint-initdb.d/initial_data_users.csv"
-- INTO TABLE users FIELDS TERMINATED BY ","
-- (user_given_name, user_family_name, user_email, user_postal_code, password);
-- COMMIT;
