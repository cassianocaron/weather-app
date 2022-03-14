# WEATHER APP

### Video Demo: video url

### Description

A web-based weather app created with React JavaScript library. It has integration with Google Maps, Google Places and OpenWeatherMap.

#### Required Packages

For this app to work we need to install a few packages:

- Google Maps: https://www.npmjs.com/package/@react-google-maps/api
- Google Places React: https://www.npmjs.com/package/use-places-autocomplete
- Reach Combobox: https://reach.tech/combobox/
- Date-fns: https://www.npmjs.com/package/date-fns

#### API Keys

We need to create a Google Maps API Key at https://console.cloud.google.com/, and ensure that the services below are enabled.

- Maps JavaScript API
- Places API
- Geocoding API

We also need to create a OpenWeatherMap API key at https://openweathermap.org/api.

These API keys must be in the environment variables `REACT_APP_GOOGLE_PLACES_API_KEY` and `REACT_APP_OPENWEATHER_API_KEY`.

#### Usage

After creating the API keys and placing them into a .env.local file in the root folder, to run the app simply type in **npm start** in the console and a browser window will open, but please note that you need to install [node.js](https://nodejs.org/en/) first.

When the app is loaded for the first time the google maps is displayed by default, to get the weather for a particular location there are two options: either click on the google maps to select a location or start typing in the search bar and the suggestions will start appearing. Once a location is selected the page will render the weather data, showing the location name, the current time at that location, weather condition, temperature, feels like and hourly forecast for the next six hours. There's also a button to switch the units between Celsius and Fahrenheit.
To search for a new location, simply start typing in the search bar and select a result or click the map icon at the top left corner to display google maps and click on a location. To get the weather for your current location, click the compass icon at the top right corner and allow the browser to detect your location.

#### Files

- **public/**  
  Contains all images used to change the background dinamically, and also the icons for the map and locate button as well as the rain icon.

- **src/App.js**

  This is the main file, which contains all the logic used to fetch and display weather and google maps data to the page. It starts by importing all required packages, and then defining the components.

  - **App**
    The main component, which is used to render all the other components. All the functions required to render the Google Maps are defined here, as well as the functions to handle input from the user. The functions to call the weather API are also defined here.
    The first components to be rendered are the map icon, the search bar and the current location button.
    Using a ternary operator, we check if weather data was fetched and the google maps is being shown to either render the google maps or the weather data.

  - **MapButton**
    Component used to render the map icon at the top left corner. When clicked it shows/hide the map.

  - **Search**
    Component used to render the suggestions as you type in the search bar, powered by google places API. As soon as a location is clicked from the drop down list the weather API is called to render weather data.

  - **Locate**
    Used to get the user's current position and display the weather data.

  - **ShowWeather**
    All the components needed to show the weather are defined here. From the OpenWeatherMap API we get all the information needed, such as current temperature, time zone, weather condition, hourly forecast, etc. To get the current time for the location being fetched was a bit of a challenge. The **GetTime** component is responsible for doing that, using the [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) object, which enables language-sensitive date and time formatting.  
    The **SwitchUnit** component is responsible for rendering the button used to switch between Celsius and Fahrenheit.
    And finally, the **HourlyForecast** component is used to render the hourly forecast for the next 6 hours. This one was a lot harder than I expected to finish, because I needed to add one hour to the current time of the current location and then two hours and so on up to six hours. Thankfully, I found the [date-fns](https://date-fns.org/docs/Getting-Started) package which does exactly that via a add function taking two arguments: the time and the number of hours to be added to it. The new time is then formatted with the Intl.DateTimeFormat object to the time zone from the current location.

- **src/index.css**
  This is the css file used to display things nicely to the screen. The main challenge I had was to get the switch units button to look like a on/off toggle.
  The background image also changes based on the current weather condition using css.

- **src/index.js**
  File created by React and is used to import the other files.

- **src/mapStyles.js**
  File used to add custom map styles to google maps. The style used for this app was taken from [Snazzy Maps](https://snazzymaps.com/style/1243/xxxxxxxxxxx).
