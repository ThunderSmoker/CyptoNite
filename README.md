# CryptoNite

## Description

This web application allows users to track and explore various cryptocurrencies with real-time updates and detailed information. Built using Next.js, it offers an intuitive interface for viewing global market trends, individual cryptocurrency data, and more.

## Demo Video
[![DEMO](https://img.youtube.com/vi/eUyxcOlv3F0/0.jpg)](https://www.youtube.com/watch?v=eUyxcOlv3F0)
Click Here to watch -> [LINK](https://youtu.be/eUyxcOlv3F0)

## ScreenShots
### Home
![image](https://github.com/user-attachments/assets/0308494f-8263-4789-90a0-8f2c83152d1a)
### Explore
![image](https://github.com/user-attachments/assets/d343b8ff-5b19-4682-ba28-0a63bfedb08c)
### Product Page
![image](https://github.com/user-attachments/assets/106af9e5-227d-4ed1-a973-e6d60f99b6e7)
![image](https://github.com/user-attachments/assets/8d9e2832-f811-479b-8d23-b8887132cf94)




## Features

### Homepage
- **Global Market Cap Chart:** Visualizes the global market cap for cryptocurrencies using a line graph.
- **Trending Market:** Displays information about top crypto according to market cap.

### Explore Page (Click on "View More coins" to get here)
- **Paginated Coin List:** Shows a paginated list or grid of cryptocurrencies. Each page contains 10 items with navigation to load more.
- **Navigation:** Clicking on a coin card routes the user to the product page for detailed information.

### Product Page
- **Basic Information:** Provides essential details about the selected cryptocurrency.
- **Price Graph:** Displays a candlestick or line graph of the cryptocurrency’s price over time.

### Common Header
- **Search Bar:** Allows users to search for cryptocurrencies with real-time suggestions.
- **Dynamic Theme Switching:** A feature for toggling between Light and Dark modes.

### WatchList
- **Draggable Watchlist:** Users can add coins to their watchlist via drag-and-drop functionality.
- **Track of favorite Coins:** Watchlist updates its data with every minute.

## Tech Stack
- **Frontend Framework:** Next.js
- **Styling:** CSS, Tailwind CSS
- **State Management:** Redux/Redux Toolkit
- **Deployment:** Vercel

## API Integration

- **Cryptocurrency Data:** Real-time and historical data is fetched from the CoinGecko API.

## Implementation Notes

- **Server-Side Rendering:** Utilize Next.js’s server-side rendering capabilities.
- **UI Responsiveness:** The UI is designed to be responsive across various screen sizes.
- **Deployment:** The application is deployed on platforms such as Vercel.
- **Cache API Responses:** API responses are cached with expiration to optimize performance.
- **Creative UI:** The design deviates from standard templates, incorporating a unique and usable interface.

## Running Locally

To run this project locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ThunderSmoker/CyptoNite.git
   ```

2. **Navigate to the Project Directory:**
    ```bash
    cd cyptonite
    ```

3. **Install Dependencies:**

    ```bash
    npm install
    ```


4. **Set Up Environment Variables:**

Create a .env file in the root directory of the project and add your API keys and other necessary environment variables. Example:

```
API_KEY=your_api_key_here
```

5. **Run the Development Server:**

    ```bash
    npm run dev
    ```

Open Your Browser:

Visit http://localhost:3000 to view the application running locally.

6. **Build and Deploy:**

To create a production build, use:

    ```bash
    npm run build
    ```

