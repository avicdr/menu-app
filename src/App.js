import "./App.css";
import Home from "./components/Home";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ShowOrder from "./components/ShowOrder";

function App() {
  const [cart, setCartItem] = useState([]);
  const [storeData, setStoreData] = useState();

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    const cartTimestamp = localStorage.getItem("cartTimestamp");
    if (storedCart && cartTimestamp) {
      const currentTime = new Date().getTime();
      const fiveMinutesInMillis = 5 * 60 * 1000; // 5 minutes in milliseconds
      // Check if the cart data is not expired
      if (currentTime - parseInt(cartTimestamp) < fiveMinutesInMillis) {
        setCartItem(storedCart);
      }
      else{
        localStorage.removeItem('cart')
      }
    }
  }, []);

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    // Check if cart is not empty before saving to localStorage
    if (cart?.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      localStorage.setItem("cartTimestamp", new Date().getTime().toString());
    }
  }, [cart]);
  

  useEffect(() => {
    // Fetch JSON data from public directory
    fetch(window.location.origin + "/json/data.json")
      .then((response) => response.json())
      .then((data) => {
        setStoreData(data.store);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  useEffect(() => {
    // Update CSS variable based on storeData.foregroundColor
    if (storeData && storeData.foreground_color) {
      document.documentElement.style.setProperty('--foreground-color', storeData.foreground_color);
    }
  }, [storeData]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                storeData={storeData}
                cart={cart}
                setCartItem={setCartItem}
              />
            }
          />
          <Route
            path="/order"
            element={
              <ShowOrder
                storeData={storeData}
                cartItems={cart}
                setCartItems={setCartItem}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
