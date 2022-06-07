import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Api from '../helpers/Api';

function MyFavoritesView(props) {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  // let { userId } = useParams();

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    let myresponse = await Api.getFavorites();
    if (myresponse.ok) {
      setUser(myresponse.data);
      setErrorMsg('');
    } else {
      setUser(null);
      let msg = `Error ${myresponse.status}: ${myresponse.error}`;
      setErrorMsg(msg);
    }
  }

  if (errorMsg) {
    return <h2 style={{ color: 'red' }}>{errorMsg}</h2>;
  }

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="MyFavoritesView">
      <h2>MY FAVORITES</h2>
      <div className="row">
        {/* Grid with recipe cards */}
        {user.favorites.map((f) => (
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
                alt="boothe meal"
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
        ))}
      </div>
    </div>
  );
}

export default MyFavoritesView;
