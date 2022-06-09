# Full Stack "Como Como" App

Como Como is a full stack app that generates recipes based on the user’s input (ingredients) by calling Spoonacular API and with the option to save recipes to Como Como database (favorites table). It is using external API (Spoonacular), React, Node/Express, MySQL, Boostrap with CSS, JWT and BCrypt for the user authentication.

See project description (<https://docs.google.com/document/d/1ZEqWVentlgWaSKaJFuX3xj2hFh_qfXxy4Dz4CYT-aSg/edit?usp=sharing>) for the following information:

- Project Summary

- Motivation and Description

- Features (Must-Have, Should-Have, Nice-to-Have(Possible future extensions))

- User Flows

- Design Overview

- DB design

- Technologies

## Setup

### Install dependencies

- Run `yarn` in project directory, then, in terminal cd into client and run `yarn` in the client folder.

### For API calls

- You need to create an account on [Spoonacular API page] (<https://spoonacular.com/food-api/console#Dashboard>).

- In your profile on Spoonacular page you will find your API key which you can use to make a limited number of daily requests (150 points per day).

- Copy your API key and paste it to the .env file in your client instead of "YOUR_PASSWORD"; You will be using the API to get the recipes based on the ingredients passed in the form, and get get more information about selected recipes.

- See API routes design for Como Como app here: (<https://docs.google.com/document/d/1G6hC1gqfZJneQHDp_2504lU6ZBQmRVHWgkgRhHyvrLw/edit?usp=sharing>)

### Database Prep

- Access your SQL CLI by typing `mysql -u root -p`, and type `create database comocomo;` to create a database in MySQL.

- In the `.env` file in project directory change the DB_PASS to the password to your SQL cli (if not root) - see hint:

      ```
      DB_PASS=YOUR_PASSWORD
      ```

Run `yarn migrate` in your terminal in the project folder in order to create `favorites` table in the `comocomo` database; Use this command whenever making changes to the database/table data;

### Run Your Development Servers

- Run `yarn start` in project directory to start the Express server on port 5000
- `cd client` and run `yarn start` to start client server in development mode with hot reloading in port 3000.
- Client is configured so all API calls will be proxied to port 5000 for a smoother development experience.
- You can test your client app in `http://localhost:3000`
- You can test your API in `http://localhost:5000/api`

## Resources

- [MySQL Cheat Sheet](http://www.mysqltutorial.org/mysql-cheat-sheet.aspx)
- [MySQL](https://dev.mysql.com/doc/refman/8.0/en/database-use.html)
- [Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [React Documentation](https://reactjs.org/docs/hello-world.html)
- [JWT](https://jwt.io/introduction/)
- [BCrypt](https://openbase.com/js/bcrypt/documentation)
- [Dotenv](https://openbase.com/js/dotenv/documentation)

## Notes

_This is a student project that was created at [CodeOp](http://CodeOp.tech), a full stack development bootcamp in Barcelona._
