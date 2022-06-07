import React from 'react';
import RecipesGrid from '../components/RecipesGrid';
import NoRecipes from '../components/NoRecipes';

function GridView(props) {
  return (
    <div className="GridView">
      {props.recipes.length !== 0 ? (
        <RecipesGrid
          recipes={props.recipes}
          getRecipeInfoCb={props.getRecipeInfoCb}
          favoritedRecipes={props.favoritedRecipes}
        />
      ) : (
        <NoRecipes />
      )}
    </div>
  );
}

export default GridView;
