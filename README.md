# Mumbai Table - Restaurant Web App

A beginner-friendly static web app for discovering Mumbai restaurants. It uses only
HTML, CSS, and vanilla JavaScript.

## Features

- Restaurant cards with area, cuisine, price, rating, address, and a short highlight.
- Area, cuisine, price, and search filters that work together.
- Quick area chips for popular Mumbai neighbourhoods.
- Premium hero section with stats and a featured restaurant preview.
- Real food/restaurant-style photos loaded from Unsplash image URLs.
- Book, order, and Google Maps buttons on every restaurant card.
- Save/favourite buttons with a "Saved only" filter.
- Dark/light theme toggle remembered in the browser.
- Social dining map demo where you can see friend check-ins and add a friend.
- Card entrance animations and extra mobile polish.
- Reset button to quickly show every restaurant again.
- Rich premium UI with glass panels, gradients, card badges, price meters, shadows, and responsive layouts.
- No build tools or frameworks needed.

## How to run

Open `index.html` directly in a browser.

The restaurant photos use online image links, so you need internet access for the
photos to appear. The app still works if the photos do not load.

## File explanation

### `index.html`

This is the main page. It creates the app structure:

- A large hero section with the app title and description.
- A premium hero preview card for a featured restaurant.
- Small guide stats near the hero title.
- A theme toggle button in the top navigation.
- A filter panel with a search box and three dropdowns: area, cuisine, and price.
- Quick area buttons for common filters like Bandra, BKC, Colaba, and Powai.
- A "Saved only" button with a saved restaurant count.
- A social map section with friend pins, a friend list, and an add-friend form.
- A reset button.
- A results heading that tells the user how many restaurants are showing.
- An empty state message for filter combinations with no matches.
- Script tags that load `restaurants-data.js` first, then `script.js`.

### `styles.css`

This file controls the premium visual design:

- CSS variables in `:root` store reusable colors, shadows, and border radius values.
- The hero uses layered gradients, glass effects, and a featured card.
- CSS Grid lays out the filter panel and restaurant cards.
- Cards use photos, hover effects, shadows, rounded corners, badges, card numbers, and price meters.
- The social map uses CSS shapes and positioned friend pins.
- A `light-theme` body class changes the page into light mode.
- Media queries make the layout adapt for tablets and phones.

### `restaurants-data.js`

This file stores the restaurant data in one array named `restaurants`.

It also stores `friendCheckIns`, which is demo data for the social dining map.

Each restaurant object includes:

- `name`
- `area`
- `cuisine`
- `price`
- `rating`
- `emoji`
- `address`
- `description`
- `highlight`
- `photo`
- `mapUrl`
- `bookingUrl`
- `orderUrl`

Keeping the data separate makes it easy to add or edit restaurants without touching
the filtering logic.

### `script.js`

This file adds the interactivity:

- Finds important HTML elements with `document.querySelector`.
- Fills each dropdown using unique values from `restaurants-data.js`.
- Searches restaurant names, areas, cuisines, and descriptions.
- Lets quick chips update the area filter.
- Builds restaurant card HTML with `createRestaurantCard`, including photo, save, book, order, and map buttons.
- Shows cards with `displayRestaurants`.
- Filters restaurants with `filterRestaurants`.
- Clears filters with `resetFilters`.
- Saves favourite restaurants in `localStorage`.
- Remembers dark/light theme choice in `localStorage`.
- Renders demo friend check-ins on the social map.
- Adds a new demo friend from the form.
- Adds event listeners so the page reacts when dropdowns change.

## How to add a restaurant

Add a new object to the `restaurants` array in `restaurants-data.js`:

```javascript
{
  id: 13,
  name: "New Mumbai Spot",
  area: "Bandra",
  cuisine: "Italian",
  price: "Mid Range",
  rating: 4.4,
  emoji: "🍕",
  address: "Example Road, Mumbai",
  description: "Short description of the restaurant.",
  highlight: "Best for: pizza nights",
  photo: "https://example.com/photo.jpg",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=New+Mumbai+Spot",
  bookingUrl: "https://www.google.com/search?q=New+Mumbai+Spot+book+table",
  orderUrl: "https://www.google.com/search?q=New+Mumbai+Spot+order+food"
}
```

The filters update automatically because `script.js` reads values from the data.

## About the social map

The social map is a frontend-only demo. It shows how a future app could work, but
it does not use real friend locations. A production version would need user login,
privacy controls, location permissions, and a backend database.
