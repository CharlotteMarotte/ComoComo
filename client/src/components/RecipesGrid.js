import React from "react";
import { Link } from 'react-router-dom';

function RecipesGrid(props) {

  return (
        
    <div className="RecipesGrid">
      <h2>RECIPES</h2>
      <Link to={'/getmeal'}>Go back to search</Link>
      <div className="row">
      {/* Grid of recipe cards */}
        {props.recipes.map(r => (
            <div className="col-sm-6 col-lg-3 mb-3 d-flex justify-content-evenly" key={r.id}>
              <div className="card ms-2 text-center" style={{width: "25rem"}}>
                {/* Image of the recipe */}
                  <img className="card-img-top"
                          key={r.id}
                          id={r.id}
                          src={r.image}
                          alt="image of the meal"/>  
                  {/* Information about the recipe */}
                  <div className="card-body">
                                <h5 className="card-title">{r.title}</h5>
                                <p className="card-text">Ingredients from your fridge used in this recipe: {r.usedIngredientCount}</p>
                                <p className="card-text">Missing ingredients: {r.missedIngredientCount}</p>
                  </div>
                  <div className="card-footer">
                                {/* Button See detail is rediredting the user to recipe detail page (calling the function getRecipeInfo) */}
                                <Link to={'/recipes/'+r.id}>
                                <button className="btn btn-outline-primary" onClick={(e) => props.getRecipeInfoCb(r.id)}>See detail</button>  
                                </Link>
                  
                  </div>
               </div>
            </div>
              )) 
        }
        </div>     
     </div>

  );
  }

export default RecipesGrid;