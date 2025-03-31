USE userdb;

SET SQL_SAFE_UPDATES = 0; /* Turn safe update off */

DELETE
	FROM users;
    
SET SQL_SAFE_UPDATES = 1; /* Turn safe update on */



SELECT * FROM users;