# 🍽️ Mumbai Eats - Restaurant Web App

A beautiful, beginner-friendly web application to discover and filter restaurants in Mumbai. Built with pure HTML, CSS, and JavaScript with a premium UI design.

## 📸 Features

✨ **Beautiful Premium UI** - Modern gradient designs with smooth animations
🔍 **Smart Filtering** - Filter by area, cuisine type, and price range
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
🎨 **Restaurant Cards** - Eye-catching cards with emojis and detailed information
⚡ **Fast Performance** - No external dependencies, pure vanilla JavaScript

## 📁 File Structure

### 1. **index.html** (Main HTML Structure)
The backbone of the application. Contains:
- **Header Section**: Title and tagline with gradient background
- **Filters Section**: Three dropdown menus for filtering
- **Reset Button**: Clears all filters
- **Results Display**: Shows the number of restaurants found
- **Restaurant Container**: Grid where restaurant cards appear
- **Footer**: Simple footer section
- **Script Imports**: Links to JavaScript files

### 2. **styles.css** (Premium Styling)
Beautiful CSS with professional styling:
- **CSS Variables**: Uses custom properties for easy color/theme management
- **Gradients**: Linear gradients for headers and buttons
- **Flexbox & Grid**: Responsive layouts using modern CSS
- **Animations**: Smooth transitions and hover effects
- **Responsive Design**: Media queries for mobile optimization
- **Shadow Effects**: Professional box-shadows for depth
- **Color Scheme**: Orange primary (#FF6B35) and blue secondary (#004E89)

### 3. **restaurants-data.js** (Restaurant Database)
Contains all restaurant information:
- **12 Restaurants**: With realistic Mumbai restaurant names
- **Data Fields**: Name, area, cuisine, price, rating, emoji, address
- **Areas Covered**: Bandra, Fort, Andheri, Thane, Powai, Southex
- **Cuisines**: Italian, Indian, Chinese, Seafood, Continental, Fusion
- **Price Categories**: Budget (₹), Mid-Range (₹₹₹), Premium (₹₹₹₹)

### 4. **script.js** (Interactive Functionality)
Main JavaScript file with filtering logic:
- **displayRestaurants()**: Creates and displays restaurant cards
- **filterRestaurants()**: Filters based on user selections
- **resetFilters()**: Clears all filters
- **getPriceSymbol()**: Converts price to rupee symbols
- **Event Listeners**: Responds to user interactions

## 🎨 Design Elements

### Colors
```
Primary Orange: #FF6B35 (Vibrant, eye-catching)
Secondary Blue: #004E89 (Professional, calm)
Light Background: #F7F9FC (Clean, modern)
White: #FFFFFF (Content areas)
```

### Typography
- **Font Family**: Segoe UI, Tahoma, Geneva (Professional)
- **Headers**: Bold, larger sizes for hierarchy
- **Body Text**: Readable, comfortable font size

### Interactions
- Cards lift up on hover (`transform: translateY`)
- Shadow depth increases on hover
- Buttons have scale effect on hover
- Smooth transitions (0.3s) for all animations

## 🚀 How to Use

1. **Open in Browser**: Simply open `index.html` in any web browser
2. **Filter Restaurants**: 
   - Select an area from the Area dropdown
   - Choose a cuisine type from the Cuisine dropdown
   - Pick a price range from the Price dropdown
3. **See Results**: Restaurant cards update instantly
4. **Reset Filters**: Click the "Reset Filters" button to see all restaurants

## 💡 Beginner-Friendly Code Features

✅ **Clear Comments**: Every function and section has explanatory comments
✅ **Simple Logic**: Easy-to-understand filtering algorithm
✅ **Modular Structure**: Separate files for data and functionality
✅ **No Framework**: Pure HTML, CSS, JavaScript - no external libraries
✅ **Semantic HTML**: Proper use of HTML5 semantic elements
✅ **CSS Organization**: Variables and logical grouping

## 📱 Responsive Breakpoints

- **Desktop**: Full grid with 3+ columns
- **Tablet**: 2-column grid (768px and below)
- **Mobile**: Single column layout (480px and below)

## 🎯 How to Extend

**Add More Restaurants**:
```javascript
// Add to restaurants-data.js
{
    id: 13,
    name: "Your Restaurant",
    area: "Your Area",
    cuisine: "Your Cuisine",
    price: "Budget/Mid-Range/Premium",
    priceValue: 500,
    rating: 4.5,
    emoji: "🍕",
    address: "Your Address"
}
```

**Add New Filter**:
1. Add a new `<select>` in HTML
2. Add options to the dropdown
3. Create a new variable in JavaScript
4. Add filter logic in `filterRestaurants()` function

**Customize Colors**:
Edit the CSS variables at the top of `styles.css`:
```css
--primary-color: #FF6B35;  /* Change this */
--secondary-color: #004E89; /* Or this */
```

## 🔧 Browser Compatibility

✅ Chrome (Latest)
✅ Firefox (Latest)
✅ Safari (Latest)
✅ Edge (Latest)
✅ Mobile Browsers

## 📝 Code Comments Guide

Each file contains detailed comments:
- `// ========================` - Section dividers
- `// FUNCTION: Name` - Function explanations
- Inline comments explain complex logic

## 🎓 Learning Resources

This project teaches:
- HTML5 semantic structure
- CSS Grid and Flexbox
- CSS custom properties (variables)
- DOM manipulation with JavaScript
- Event handling
- Array filtering methods
- String interpolation with template literals

## 📞 Support

Questions about the code? Check the inline comments in each file for detailed explanations!

---

Made with ❤️ | Mumbai Eats 2024
