import React from 'react';
import RecipeDetail from '../components/RecipeDetail';

function RecipeDetailView(props) {
  return (
    <div className="RecipeDetailView">
      {props.recipeInfo && (
        <RecipeDetail
          recipeInfo={props.recipeInfo}
          addToFavoritesCb={props.addToFavoritesCb}
          user={props.user}
          favoritedRecipes={props.favoritedRecipes}
        />
      )}
    </div>
  );
}

export default RecipeDetailView;
