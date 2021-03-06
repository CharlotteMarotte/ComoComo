import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';

import Local from './helpers/Local';
import Api from './helpers/Api';

import Navbar from './components/Navbar';
import HomeView from './views/HomeView';
import GetMealView from './views/GetMealView';
import GridView from './views/GridView';
import RecipeDetailView from './views/RecipeDetailView';
import MyFavoritesView from './views/MyFavoritesView';
import Error404View from './views/Error404View';
import PrivateRoute from './components/PrivateRoute';
import LoginView from './views/LoginView';
import SignUpView from './views/SignUpView';

let BASE_URL = `https://api.spoonacular.com/recipes`;
const API_KEY = process.env.REACT_APP_MY_API_KEY;

function App() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [recipeInfo, setRecipeInfo] = useState(null);
  const [error, setError] = useState('');
  const [user, setUser] = useState(Local.getUser());
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');
  const [favoritesErrorMsg, setFavoritesErrorMsg] = useState('');
  const [favoritedRecipes, setFavoritedRecipes] = useState(null);

  // POST method to add recipe to my sql database ("favorites" sql table) after click on Add to Favorites in the RecipeDetailView
  async function addUser(userData) {
    let myresponse = await Api.addUser(userData); // do POST
    if (myresponse.status === 400) {
      setRegisterErrorMsg('User name is already taken!');
    } else if (myresponse.ok) {
      setRegisterErrorMsg('');
      setLoginErrorMsg('');
      navigate('/login');
    } else {
      console.log(
        `Server error: ${myresponse.status} ${myresponse.statusText}`
      );
      setRegisterErrorMsg('Registration failed!');
    }
  }

  // create function for button in Navbar to use
  function navigateFavorites() {
    navigate('/favorites');
  }

  async function doLogin(username, password) {
    let myresponse = await Api.loginUser(username, password);
    if (myresponse.ok) {
      Local.saveUserInfo(myresponse.data.token, myresponse.data.user);
      // setUser is async so use data from myresponse instead
      await fetchFavorites(); // get favorites of users and save in state
      setLoginErrorMsg('');
      setRegisterErrorMsg('');
      navigate('/favorites/'); // go to user's favorites
    } else {
      setLoginErrorMsg('Login failed!');
    }
  }

  function doLogout() {
    Local.removeUserInfo();
    setLoginErrorMsg('');
    setRegisterErrorMsg('');
    navigate('/favorites/');
    setUser(null);
  }

  async function getTimesFavorites(data) {
    let arrOfIds = [];
    let timesFavoritedObj = {};
    data.forEach((e) => arrOfIds.push(e.id));
    for (let id of arrOfIds) {
      let result = await Api.getTimesFavorites(id);
      let resultAPI = await getRecipeInfo(id);
      timesFavoritedObj[id] = {
        DB: result.data[0].timesFavorited,
        API: resultAPI.aggregateLikes, // this doesn't work, it's always the same
      };
    }
    setFavoritedRecipes(timesFavoritedObj);
  }

  // calling Spoonacular API to get random recipe
  async function getRandomRecipe() {
    let id = 0;

    setError('');
    setRecipes(null);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let url = `${BASE_URL}/random?number=1&apiKey=${API_KEY}`;
    try {
      let response = await fetch(url, options);
      if (response.ok) {
        let data = await response.json();
        id = data.recipes[0].id;
        await getRecipeInfo(id);
        await getTimesFavorites(data.recipes); // get to all recipes number of times this recipe has been saved in DB
      } else {
        setError(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
    navigate(`/recipes/${id}`); // redirect to /recipes
  }

  // calling Spoonacular API to get recipes based on ingredients from input
  async function getRecipes(ingredients) {
    setError('');
    setRecipes(null);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let url = `${BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=8&ranking=1&ignorePantry=true`;

    try {
      let response = await fetch(url, options);
      if (response.ok) {
        let data = await response.json();
        setRecipes(data);
        await getTimesFavorites(data); // get to all recipes number of times this recipe has been saved in DB
      } else {
        setError(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
    navigate('/recipes'); // redirect to /recipes
  }

  // calling Spoonacular API to get info about one recipe based on its id (after click on See detail in RecipesGrid or in MyFavoritesView)
  async function getRecipeInfo(id) {
    setError('');
    setRecipeInfo(null);

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    let url = `${BASE_URL}/${id}/information?apiKey=${API_KEY}`;

    try {
      let response = await fetch(url, options);
      if (response.ok) {
        let data = await response.json();
        setRecipeInfo(data);
        return data;
      } else {
        setError(`Server error: ${response.status} ${response.statusText}`);
        return null;
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
      return null;
    }
  }

  // POST method to add recipe to my sql database ("favorites" sql table) after click on Add to Favorites in the RecipeDetailView
  async function addToFavorites(id, notes) {
    // create body for API to use
    let myFavRecipe = {
      recipe_id: id,
      notes: notes,
      recipe_title: recipeInfo.title,
      recipe_img: recipeInfo.image,
    };

    try {
      let myresponse = await Api.addToFavorites(myFavRecipe); //post the new recipe to my favorites ("favorites" sql table)
      if (myresponse.ok) {
        // when favorite got added navigate to favorites page
        navigate(`/favorites/`);
        setUser(myresponse.data);
      } else {
        console.log(
          `Server error: ${myresponse.status} ${myresponse.statusText}`
        );
      }
    } catch (err) {
      console.log(`Network error: ${err.message}`);
    }
  }

  // DELETE method to delete recipe from "favorites" table & "MyFavoritesView" after clicking on Delete in My Favorites (MyFavoritesView)
  async function deleteFromFavorites(recipeId) {
    try {
      let myresponse = await Api.deleteFromFavorites(recipeId); // delete the recipe with the given id
      if (myresponse.ok) {
        setUser(myresponse.data);
      } else {
        console.log(
          `Server error: ${myresponse.status} ${myresponse.statusText}`
        );
      }
    } catch (err) {
      console.log(`Server error: ${err.message}`);
    }
  }

  // helper function that gets called on login and gets favorites for the user that is currently logged in
  async function fetchFavorites() {
    let myresponse = await Api.getFavorites();
    if (myresponse.ok) {
      setUser(myresponse.data);
      setFavoritesErrorMsg('');
    } else {
      setUser(null);
      let favoritesMsg = `Error ${myresponse.status}: ${myresponse.error}`;
      setFavoritesErrorMsg(favoritesMsg);
    }
  }

  return (
    <div className="App">
      <Navbar
        logoutCb={doLogout}
        user={user}
        navigateFavoritesCb={navigateFavorites}
        getRandomRecipeCb={getRandomRecipe}
      />
      <div className="container-fluid">
        {/* Routes to other Views of the app */}
        <Routes>
          {/* Route to HomeView */}
          <Route path="/" element={<HomeView />} />
          {/* Route to GetMealView with the IngredientsForm component*/}
          <Route
            path="getmeal"
            element={<GetMealView getRecipesCb={getRecipes} />}
          />

          {/* Route to GridView with the RecipesGrid component*/}
          <Route
            path="recipes"
            element={
              <GridView
                recipes={recipes}
                getRecipeInfoCb={getRecipeInfo}
                favoritedRecipes={favoritedRecipes}
              />
            }
          />
          {/* Route to RecipeDetailView with the RecipeDetail component*/}
          <Route
            path="recipes/:id"
            element={
              <RecipeDetailView
                recipeInfo={recipeInfo}
                user={user}
                addToFavoritesCb={addToFavorites}
                favoritedRecipes={favoritedRecipes}
              />
            }
          />
          {/* Route to MyFavoritesView*/}
          <Route
            path="favorites/"
            element={
              <PrivateRoute>
                <MyFavoritesView
                  deleteFromFavoritesCb={deleteFromFavorites}
                  getRecipeInfoCb={getRecipeInfo}
                  user={user}
                  favoritesErrorMsg={favoritesErrorMsg}
                />
              </PrivateRoute>
            }
          />
          {/* Route to ErrorView in case the users types invalid url */}
          <Route path="/" element={<h1>Home</h1>} />
          <Route
            path="/login"
            element={
              <LoginView
                loginCb={(u, p) => doLogin(u, p)}
                loginError={loginErrorMsg}
              />
            }
          />
          <Route
            path="/signup"
            element={
              <SignUpView
                addUserCb={addUser}
                registerError={registerErrorMsg}
              />
            }
          />
          <Route path="*" element={<Error404View />} />
        </Routes>

        {/* Show error message in case there is a problem with the fetch  */}
        {error && <h2 style={{ color: 'red' }}>{error}</h2>}
      </div>
    </div>
  );
}

export default App;
