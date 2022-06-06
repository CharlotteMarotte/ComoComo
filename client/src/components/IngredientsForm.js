import React, { useState } from "react";
import "./IngredientsForm.css";

function IngredientsForm(props) {
  const [ingredients, setIngredients] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    props.getRecipesCb(ingredients);
    setIngredients("");
  }

  function handleChange(event) {
    setIngredients(event.target.value);
  }

  return (
  <div className="row">
    <div className="col sm-6 text-center">
      <form onSubmit={handleSubmit} className="form-group">
        <label htmlFor="floatingInput">WHAT'S IN MY FRIDGE?
          <p className="text-center mt-5 fs-6 fw-light">Type your ingredients separated by comma</p>
          <input 
            className="form-control d-block p-3 mt-2 mw-200"
            id="floatingInput"
            type="text"
            value={ingredients}
            onChange={handleChange}
            placeholder="e.g. tomatoes,egg,cheese,..."
          />
        </label>
        <button type="submit" className="btn btn-primary btn-sm p-4 d-block mx-auto">Get Meal</button>  
      </form>
    </div>
  </div>
  );
}

export default IngredientsForm;
