var express = require('express');
var router = express.Router();
const { ensureUserLoggedIn } = require('../middleware/guards');

const db = require('../model/helper');

async function joinFavoritestoJson(users) {
  // Get first row

  let row0 = users[0];

  // Create array of invoice item objs
  favorites = users.map((f) => ({
    recipe_id: f.recipe_id,
    recipe_title: f.recipe_title,
    recipe_img: f.recipe_img,
    posted: f.posted,
  }));

  // Create author obj
  let user = {
    id: row0.id,
    username: row0.username,
    firstname: row0.firstname,
    lastname: row0.lastname,
    email: row0.email,
    favorites,
  };

  return user;
}

// GET all favorites ordered by date and time posted, ascending order
router.get('/', ensureUserLoggedIn, async function (req, res, next) {
  let userId = res.locals.userId;
  let sql = `SELECT f.*, u.*, fu.notes, fu.posted FROM users AS u LEFT OUTER JOIN users_favorites AS fu on u.id = fu.fk_usersId 
    LEFT OUTER JOIN favorites AS f ON fu.fk_favoritesId = f.recipe_id WHERE u.id = ${userId};`;
  try {
    let results = await db(sql); // get all favorite recipes
    let favorites = results.data;
    favorites = await joinFavoritestoJson(favorites);
    res.send(favorites);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// POST recipe in favorites table and connect it to current users' favorites
router.post('/', ensureUserLoggedIn, async (req, res) => {
  let { recipe_id, recipe_title, recipe_img } = req.body;
  let userId = res.locals.userId;
  try {
    try {
      let sql_favorites = `
      INSERT IGNORE INTO favorites (recipe_id, recipe_title, recipe_img)
      VALUES (${recipe_id}, "${recipe_title}", "${recipe_img}");`;
      await db(sql_favorites); // add new recipe
    } catch (err) {
      // Ignore error message that gets thrown when recipe already exists in favorites
      // res.status(500).send({ error: err.message });
    }
    // INSERT IGNORES only inserts it if it doesn't exist yet
    let prevFav = await db(
      `SELECT * FROM users_favorites WHERE fk_favoritesId = ${recipe_id} AND fk_usersId=${userId};`
    );
    if (prevFav.data.length !== 0) {
      // checking if the recipe isn't already included in the database
      res.status(404).send({ error: 'Recipe is already in favorites' });
      return;
    }

    let sql_junction = `INSERT INTO users_favorites (fk_usersId, fk_favoritesId) 
    VALUES (${userId}, ${recipe_id});`;

    await db(sql_junction); // add new recipe
    // gets all favorites of this user in a formatted json format
    let result =
      await db(`SELECT f.*, u.*, fu.notes, fu.posted FROM users AS u LEFT OUTER JOIN users_favorites AS fu on u.id = fu.fk_usersId 
      LEFT OUTER JOIN favorites AS f ON fu.fk_favoritesId = f.recipe_id WHERE u.id = ${userId};`);
    let favorites = result.data;
    favorites = await joinFavoritestoJson(favorites); //get all favorites ordered by date and time posted, ascending order
    res.status(201).send(favorites); // return updated array (with 201 for "new resource created")
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});


// GET all favorites ordered by date and time posted, ascending order
router.get('/likes/:recipe_id', async function (req, res) {
  let recipe_id = req.params.recipe_id;
  let sql = `SELECT COUNT(fk_usersId) AS timesFavorited FROM users_favorites WHERE fk_favoritesId = ${recipe_id};`;
  try {
    let result = await db(sql);
    result = result.data;
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});



router.delete('/:recipe_id', ensureUserLoggedIn, async (req, res) => {
  let recipe_id = req.params.recipe_id;
  let userId = res.locals.userId;
  try {
    await db(
      `DELETE FROM users_favorites WHERE fk_favoritesId = ${recipe_id} AND fk_usersId = ${userId};`
    ); // delete recipe

    // // deletes all entries from favorites than are not connected to a user via user_favorites table anymore
    await db(`DELETE FROM favorites WHERE NOT EXISTS (SELECT * FROM users_favorites WHERE users_favorites.fk_favoritesId = favorites.recipe_id);
    `);

    result =
      await db(`SELECT f.*, u.*, fu.notes, fu.posted FROM users AS u LEFT OUTER JOIN users_favorites AS fu on u.id = fu.fk_usersId 
    LEFT OUTER JOIN favorites AS f ON fu.fk_favoritesId = f.recipe_id WHERE u.id = ${userId} ORDER BY fu.posted ASC;`); //get all favorites ordered by date and time posted, ascending order
    let favorites = result.data;
    favorites = await joinFavoritestoJson(favorites); //get all favorites ordered by date and time posted, ascending order
    res.send(favorites); // return updated array
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
