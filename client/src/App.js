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
  const [recipes, setRecipes] = useState([]);
  const [recipeInfo, setRecipeInfo] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [user, setUser] = useState(Local.getUser());
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const [registerErrorMsg, setRegisterErrorMsg] = useState('');

  // POST method to add recipe to my sql database ("favorites" sql table) after click on Add to Favorites in the RecipeDetailView
  async function addUser(userData) {
    let myresponse = await Api.addUser(userData); // do POST
    console.log(myresponse);
    if(myresponse.status === 400){
      setRegisterErrorMsg('User name is already taken!');
    }
    else if (myresponse.ok) {
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
      setUser(myresponse.data.user);
      setLoginErrorMsg('');
      navigate('/favorites/');
    } else {
      setLoginErrorMsg('Login failed!');
    }
  }

  function doLogout() {
    Local.removeUserInfo();
    setUser(null);
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

    let url = `${BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=5&ranking=1&ignorePantry=true`;

    try {
      let response = await fetch(url, options);
      if (response.ok) {
        let data = await response.json();
        setRecipes(data);
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
      } else {
        setError(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    }
  }

  // POST method to add recipe to my sql database ("favorites" sql table) after click on Add to Favorites in the RecipeDetailView
  async function addToFavorites(id) {
    // create body for API to use
    let myFavRecipe = {
      recipe_id: id,
      recipe_title: recipeInfo.title,
      recipe_img: recipeInfo.image,
    };

    try {
      let myresponse = await Api.addToFavorites(myFavRecipe); //post the new recipe to my favorites ("favorites" sql table)
      if (myresponse.ok) {
        // when favorite got added navigate to favorites page
        navigate(`/favorites/`);
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
        navigate(`/getmeal/`);
      } else {
        console.log(
          `Server error: ${myresponse.status} ${myresponse.statusText}`
        );
      }
    } catch (err) {
      console.log(`Server error: ${err.message}`);
    }
  }

  return (
    <div className="App">
      <Navbar
        logoutCb={doLogout}
        user={user}
        navigateFavoritesCb={navigateFavorites}
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
              <GridView recipes={recipes} getRecipeInfoCb={getRecipeInfo} />
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
