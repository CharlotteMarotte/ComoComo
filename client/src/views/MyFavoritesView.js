import { Link } from 'react-router-dom';
import React, { useEffect } from 'react';

function MyFavoritesView(props) {
 
  useEffect(() => {
  }, []);


  if (props.favoritesErrorMsg) {
    return <h2 style={{ color: 'red' }}>{props.favoritesErrorMsg}</h2>;
  }

  if (!props.user.favorites || !props.user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="MyFavoritesView">
      <div className="row">
       <h2>My favorites</h2>
        {/* Grid with recipe cards */}(
        {props.user.favorites.map((f) =>
          f.recipe_id === null ? (
            <h2 style={{ color: 'red' }}>No favorites yet.</h2>
          ) : (
            <div
              key={f.recipe_id}
              className="col-sm-6 col-lg-3 mb-3 d-flex justify-content-evenly"
            >
              <div className="card ms-2 p-3" style={{ width: '22rem' }}>
                {/* Recipe Image */}
                <img
                  className="card-img-top"
                  id={f.recipe_id}
                  src={f.recipe_img}
                  alt="the meal"
                />
                {/* Recipe title */}
                <div className="card-body">
                  <h5 className="card-title">{f.recipe_title}</h5>
                </div>
                {/* Footer with two button - "See detail" button will redirect user to the page with recipe details; "Delete" button deletes the item from myfavorites and from the database ("favorites" table) */}
                <div className="card-footer">
                  <Link to={'/recipes/' + f.recipe_id}>
                    <button
                      className="btn btn-outline-primary me-3"
                      onClick={(e) => props.getRecipeInfoCb(f.recipe_id)}
                    >
                      See details
                    </button>
                  </Link>
                  <button
                    className="btn btn-outline-warning float-right"
                    onClick={(e) => props.deleteFromFavoritesCb(f.recipe_id)}
                    title="delete"
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyFavoritesView;
