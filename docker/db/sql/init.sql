USE tokyomap_api;

START TRANSACTION;
DROP TABLE IF EXISTS tweets;
CREATE TABLE tweets (
    tweet_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    user_name VARCHAR(256) NOT NULL,
    message VARCHAR(256) NOT NULL,
    posted_at DATETIME NOT NULL,
    lat DECIMAL(10, 7) NOT NULL,
    lng DECIMAL(10, 7) NOT NULL
) DEFAULT CHARSET=utf8 COLLATE=utf8_bin ENGINE=InnoDB;
COMMIT;

BEGIN;
LOAD DATA INFILE "/docker-entrypoint-initdb.d/initial_data_tweet.csv"
INTO TABLE tweets FIELDS TERMINATED BY "," (user_id, user_name, message, lat, lng);
COMMIT;
