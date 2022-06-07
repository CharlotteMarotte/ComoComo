import React, { useEffect } from 'react';
import './RecipeDetail.css';
import { Link } from 'react-router-dom';
import Error404View from '../views/Error404View';

function RecipeDetail(props) {
  useEffect(() => {}, []);

  let recipe = props.recipeInfo;

  return (
    <div className="RecipeDetail">
      <h2> {recipe.title} </h2>

      <div className="row">
        <div className="col text-center">
          {/* Recipe image */}
          <img src={recipe.image} alt="the meal" />
          <p></p>
          {
            //  Button Add to favorites - after click it calls the addToFavorites function which is adding the recipe to
            //  My Favorites page (the database ("favorites" table)); click is also causing redirection to /myfavorites page
            props.user && props.user.favorites && 
            // checks if this user already is connected to this recipe in users_favorites table
              (props.user.favorites.filter((e) => e.recipe_id === recipe.id)
                .length !== 0 ? (
                <h2>Already in favorites</h2>
              ) : (
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={(e) => props.addToFavoritesCb(recipe.id)}
                  title="Add to favorites"
                >
                  Add to Favorites💛
                </button>
              ))
          }
          <p></p>
          <Link to="/recipes">Go to all recipes</Link>
        </div>

        {/* Recipe info */}
        <div className="col text-left ms-4">
          <h3>Info</h3>
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
          <a href={recipe.spoonacularSourceUrl} target="_blank">
            See more here
          </a>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
