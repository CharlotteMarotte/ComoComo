import React, { useState, useEffect } from 'react';
import './RecipeDetail.css';
import { Link } from 'react-router-dom';

function RecipeDetail(props) {
  const [notes, setNotes] = useState('');
  const [favoriteInfo, setFavoriteInfo] = useState(null);
  let recipe = props.recipeInfo;

  useEffect(() => {
    if (props.user) {
      getInfoForFavorite();
    }
  }, []);

  // gets called every time a radio button element is selected
  const handleInputChange = (event) => {
    let value = event.target.value;
    setNotes(value);
  };

  // gets called when submit gets pressed
  const handleSubmit = (e) => {
    e.preventDefault();
    props.addToFavoritesCb(recipe.id, notes);
    // empty form after set
    setNotes('');
  };

  function getInfoForFavorite() {
    let arr = [];
    if (props.user && props.user.favorites) {
      arr = props.user.favorites.filter((e) => e.recipe_id === recipe.id);
    } else {
      arr = null;
    }
    setFavoriteInfo(arr);
  }

  return (
    <div className="RecipeDetail">
      <h2> {recipe.title} </h2>

      <div className="row">
        <div className="col text-center">
          {/* Recipe image */}
          <img src={recipe.image} alt="the meal" />
          <p></p>
          <Link to="/recipes">Go to all recipes</Link>
        </div>

        {/* Recipe info */}
        <div className="col text-left ms-4">
          <h3>Info</h3>
          {props.favoritedRecipes[recipe.id] && (
            <>
              <p className="d-inline">
                Likes in App: {props.favoritedRecipes[recipe.id].DB} 💜{' | '}
              </p>
              <p className="d-inline">
                Total Likes: {props.favoritedRecipes[recipe.id].API} 💚{' '}
              </p>
            </>
          )}
          <h6>Minutes to prepare:</h6>
          <p>{recipe.readyInMinutes}</p>
          <h6>Servings:</h6>
          <p>{recipe.servings}</p>
          <h6>Diets:</h6>
          <ul>
            {recipe.diets.map((d, index) => (
              <li key={index}>{d}</li>
            ))}
          </ul>
          <h6>Ingredients {'&'} Instructions:</h6>{' '}
          {recipe.analyzedInstructions[0].steps.map((s) => {
            s.ingredients.map((i) => i.name);
          })}
          {/* Link which redirect the user to the webpage with recipe details (external link) */}
          <a
            className="d-block"
            href={recipe.spoonacularSourceUrl}
            target="_blank"
          >
            See more here
          </a>
          {favoriteInfo &&
            // checks if this user already is connected to this recipe in users_favorites table
            (favoriteInfo.length !== 0 ? (
              // only show notes if it is not an emptry string
              favoriteInfo[0].notes.length > 0 && (
                <div className="alert alert-light col-3 mt-5">
                  <h3 className="mt-0">My Notes:</h3>
                  <p>{favoriteInfo[0].notes}</p>
                </div>
              )
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-outline col-4">
                  <textarea
                    className="form-control mt-3"
                    placeholder="Add notes to favorites"
                    id="note"
                    rows="4"
                    value={notes}
                    onChange={(e) => handleInputChange(e)}
                  ></textarea>
                  <label className="form-label" htmlFor="note"></label>
                </div>
                {/* Button Add to favorites - after click it calls the addToFavorites function which is adding the recipe to
            My Favorites page (the database ("favorites" table)); click is also causing redirection to /myfavorites page */}
                <button
                  type="submit"
                  className="btn btn-light d-block col-2 offset-1"
                  title="Add to favorites"
                >
                  Add to Favorites💛
                </button>
              </form>
            ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
