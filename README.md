# Mumbai Table - Restaurant Web App

A beginner-friendly static web app for discovering Mumbai restaurants. It uses only
HTML, CSS, and vanilla JavaScript.

## Features

- Restaurant cards with area, cuisine, price, rating, address, and a short highlight.
- Multi-filtering for cuisine, budget, occasion, dress code, outdoor seating, live music, pet friendly, vegetarian friendly, and valet parking.
- Improved partial-match search across restaurant name, cuisine, area, dish, and occasion.
- Quick area chips for popular Mumbai neighbourhoods.
- Premium hero section with stats and a featured restaurant preview.
- Real food/restaurant-style photos loaded from Unsplash image URLs.
- Book, order, and Google Maps buttons on every restaurant card.
- Save/favourite buttons with a "Saved only" filter.
- Recently viewed restaurants remembered in `localStorage`.
- Compare two restaurants by cuisine, price, ratings, perfect for, dress code, and luxury score.
- Dark/light theme toggle remembered in the browser.
- Concierge search that recommends the top 3 restaurants from plain-language dining briefs.
- Concierge quick chips for date night, rooftop, Japanese, Italian, brunch, wine, hidden gems, family, business, and late night.
- Separate `collections.html` page with curated collections that automatically filter restaurants.
- Premium restaurant detail modal from every restaurant card.
- Detail pages include hero image, gallery carousel, curated scores, planning notes, reservation/directions/call/website actions, and nearby restaurants.
- Loading skeleton and subtle micro-interactions for the detail experience.
- Card entrance animations and extra mobile polish.
- Reset button to quickly show every restaurant again.
- Rich premium UI with glass panels, gradients, card badges, price meters, shadows, and responsive layouts.
- No build tools or frameworks needed.

## How to run

Recommended: run a local static server, then open `index.html`.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

The app loads `restaurants.json` with `fetch`. It also includes a generated
`restaurants-fallback.js` file so cards still appear when the site is opened
directly from an extracted ZIP/folder.

The restaurant photos use online image links, so you need internet access for the
photos to appear. The app still works if the photos do not load.

## File explanation

### `index.html`

This is the main page. It creates the app structure:

- A large hero section with the app title and description.
- A premium hero preview card for a featured restaurant.
- Small guide stats near the hero title.
- A theme toggle button in the top navigation.
- A link to the Collections page.
- A filter panel with search, area, cuisine, price, occasion, dress code, and feature filters.
- Quick area buttons for common filters like Bandra, BKC, Colaba, and Powai.
- A "Saved only" button with a saved restaurant count.
- Compare and recently viewed panels.
- A Concierge panel with a dining-brief input, quick chips, and top 3 recommendations.
- A reset button.
- A results heading that tells the user how many restaurants are showing.
- An empty state message for filter combinations with no matches.
- Script tags that load `restaurants-fallback.js`, `data-store.js`, `assistant-data.js`, `script.js`, and `detail-modal.js`.

### `styles.css`

This file controls the premium visual design:

- CSS variables in `:root` store reusable colors, shadows, and border radius values.
- The hero uses layered gradients, glass effects, and a featured card.
- CSS Grid lays out the filter panel and restaurant cards.
- Cards use photos, hover effects, shadows, rounded corners, badges, card numbers, and price meters.
- Concierge and collection cards reuse the same premium card language.
- The detail modal, carousel, skeleton state, score cards, and nearby cards use the same palette and spacing system.
- A `light-theme` body class changes the page into light mode.
- Media queries make the layout adapt for tablets and phones.

### `restaurants.json`

This is the restaurant database. Adding a restaurant should only require editing
this JSON file.

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
- `averageSpend`
- `perfectFor`
- `mustOrder`
- `curatedRating`
- `tags`
- `collections`
- `occasions`
- `dressCode`
- `features`
- `detail`

Keeping the data separate makes it easy to add or edit restaurants without touching
the filtering logic.

### `data-store.js`

This file loads `restaurants.json` once with `fetch` and exposes helper methods:

- `loadRestaurants()`
- `getRestaurantById()`
- `getUniqueValues()`

If a browser blocks local JSON loading, it falls back to `restaurants-fallback.js`.

### `restaurants-fallback.js`

This generated file mirrors `restaurants.json` so the site still works when opened
directly from a local folder. Do not edit it by hand; edit `restaurants.json` as
the source of truth.

### `assistant-data.js`

This file stores non-restaurant configuration:

- Concierge quick chip labels and queries.
- Collection names and descriptions.

### `script.js`

This file adds the interactivity:

- Finds important HTML elements with `document.querySelector`.
- Loads restaurant data through `data-store.js`.
- Fills dropdowns using values from `restaurants.json`.
- Searches restaurant names, areas, cuisines, dishes, occasions, and tags.
- Lets quick chips update the area filter.
- Builds restaurant card HTML with `createRestaurantCard`, including photo, save, book, order, map, and compare buttons.
- Shows cards with `displayRestaurants`.
- Filters restaurants with `filterRestaurants`.
- Clears filters with `resetFilters`.
- Saves favourite restaurants in `localStorage`.
- Renders recently viewed restaurants from `localStorage`.
- Compares two selected restaurants.
- Remembers dark/light theme choice in `localStorage`.
- Scores concierge recommendations with local JavaScript keyword matching only.
- Renders the top 3 concierge recommendations.
- Handles concierge quick chip clicks.
- Adds restaurant IDs to rendered cards so the shared detail modal can open any restaurant.
- Adds event listeners so the page reacts when dropdowns change.

### `collections.html`

This is the separate Collections page. It uses the same CSS, data files, and visual
style as the main page. Each collection button filters restaurants automatically.

### `collections.js`

This file controls the Collections page:

- Renders all collection buttons from `assistant-data.js`.
- Filters restaurants by collection membership.
- Reuses the same premium restaurant card structure.
- Keeps the dark/light theme toggle working on the collections page.
- Adds restaurant IDs to collection result cards so the shared detail modal works there too.

### `detail-modal.js`

This shared file powers the premium restaurant detail modal:

- Opens when a restaurant or recommendation card is clicked.
- Shows a loading skeleton before rendering details.
- Builds a large hero image, editorial description, gallery carousel, curated scores, and planning notes.
- Adds reservation, directions, call, and website buttons.
- Shows nearby restaurants and lets those open in the same modal.
- Supports Escape, previous/next gallery buttons, and thumbnail clicks.

## How to add a restaurant

Add a new object to the `restaurants` array in `restaurants.json`:

```json
{
  "id": 19,
  "name": "New Mumbai Spot",
  "area": "Bandra",
  "cuisine": "Italian",
  "price": "Mid Range",
  "rating": 4.4,
  "emoji": "🍕",
  "address": "Example Road, Mumbai",
  "description": "Short description of the restaurant.",
  "highlight": "Best for: pizza nights",
  "photo": "https://example.com/photo.jpg",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=New+Mumbai+Spot",
  "bookingUrl": "https://www.google.com/search?q=New+Mumbai+Spot+book+table",
  "orderUrl": "https://www.google.com/search?q=New+Mumbai+Spot+order+food"
}
```

The cards, filters, search, collections, concierge, and detail modal read from
`restaurants.json`.
