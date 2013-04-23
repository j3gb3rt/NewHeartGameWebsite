# New Heart Game Website


NewMe is the result of a collaboration between New Heart Cardiac Rehabilitation Center in Albuquerque, New Mexico and a group of students from the Georgia Institute of Technology. Our combined goal is to give patients coping with diabetes an entertaining and fun way to manage their illness effectively. Through this game, it is our hope that diabetics can become happier and healthier, and we hope that this game will become a model for others to follow. Thank you for your support.

Sincerely,

New Heart Game Design Team
New Heart Cardiac Rehabilitation Center - Albuquerque, New Mexico
Georgia Institute of Technology; School of Literature, Media, and Communication - Atlanta, Georgia

# Techinical Notes:

## Setup

In order to run this website, make sure you have node.js, GraphicsMagick, libpng-1.0.2 or better, and MySQL installed.
There is a "config/database.js" file that is not part of the repository that is also needed. The file contains connection parameters for your local database.

It follows the below format:

    var configuration = {};
    configuration.db_user = "";
    configuration.db_host = "";
    configuration.db_database = "";
    configuration.db_password = "";
    configuration.db_salt = "";

    module.exports = configuration;


After creating the file and filling in the appropiate information, the file "database/database_setup.js" should be run. 
It should return

    database setup
    tables setup

If not, "config/database.js" was not set up correctly or your MySQL database is not running.


Once everything is setup, you can then start the server in a terminal by running 

    node server.js

## Overview of Folders:

The assets folder contains all assets, which includes client-side javascript, stylesheets, and images.

The config folder contains configuration settings for the database and avatar settings.

The database folder contains an interface for communicating with the database.

The logs folder contains basic HTTP response logs. A new log is created on each startup.

The resources folder contains files that are not part of the application code, are not in the database, and are not assets.

The routers folder contains Express routes handling logic.

The tests folder contains a basic suite of Mocha tests.

The view folder contains Jade views.