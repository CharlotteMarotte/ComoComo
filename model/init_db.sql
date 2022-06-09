SET
    foreign_key_checks = 0;

DROP TABLE IF EXISTS favorites;

DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS users_favorites;

SET
    foreign_key_checks = 1;

CREATE TABLE users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL UNIQUE,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    password VARCHAR(200) NOT NULL,
    email VARCHAR(200) NOT NULL
);

CREATE TABLE favorites (
    recipe_id INT NOT NULL PRIMARY KEY,
    recipe_title VARCHAR(100),
    recipe_img VARCHAR(100)
);

CREATE TABLE users_favorites (
    id INT NOT NULL AUTO_INCREMENT,
    fk_usersId INT NOT NULL,
    fk_favoritesId INT NOT NULL,
    notes TEXT(255),
    posted DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (fk_usersId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_favoritesId) REFERENCES favorites(recipe_id) ON DELETE CASCADE
);

--
-- Insert sample/seed data
--
INSERT INTO
    favorites (recipe_id, recipe_title, recipe_img)
VALUES
    (
        661447,
        'Square Deviled Eggs',
        'https://spoonacular.com/recipeImages/661447-312x231.jpg'
    ),
    (
        640513,
        'Cream Cheese with Sun Dried Tomatoes and Pesto Pastry',
        'https://spoonacular.com/recipeImages/640513-312x231.jpg'
    );

-- user1 has password pass1 (etc)
INSERT INTO
    users (username, firstname, lastname, password, email)
VALUES
    (
        'user1',
        'Lisa',
        'Meier',
        '$2b$12$eFzMWbS9SogNtxkmo3J7aO8FQMFQSKbtpwLMIOVsF6GGKpTQdgq.W',
        'user1@acme.com'
    ),
    (
        'user2',
        'Lea',
        'Schmidt',
        '$2b$12$WZcGPyrkCvD5e8m0Qz/nFOdBryUcsp6uDlE2MDo/AjuBhPrQBCfI6',
        'user2@acme.com'
    ),
    (
        'user3',
        'Agnes',
        'Lutz',
        '$2b$12$tiAz4eaXlpU.CdltUVvw6udLA2BWsitk5zXM2XOm2IpAeAiFfMCdy',
        'user3@acme.com'
    );

INSERT INTO
    users_favorites (fk_usersId, fk_favoritesId, notes)
VALUES
    (1, 661447, "Maybe for christmas?"),
    (1, 640513, "Mum would like this"),
    (2, 640513, "Like in my childhood!");