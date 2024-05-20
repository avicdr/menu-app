import React, { useEffect, useState } from "react";
import HomeCard from "./HomeCard";
import ItemCard from "./ItemCard";
import { Link } from "react-router-dom";

function Home({ storeData, setCartItem, cart }) {
  const [jsonData, setJsonData] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [searchInput, setSearchInput] = useState(""); // State variable for search input
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    // Fetch JSON data from public directory
    fetch(window.location?.origin + "/json/data.json")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Fetched JSON data:", data);
        setJsonData(data);
      })
      .catch((error) => console.error("Error fetching JSON:", error));
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleCategorySelection = (category) => {
    setSelectedCategory(category);
  };

  const addToOrder = (orderItem) => {
    setCartItem([...cart, orderItem]);
    const cartArray = [...cart];
    cartArray.push(orderItem);
    localStorage.setItem("cart", JSON.stringify(cartArray));
  };

  const renderSearchResults = () => {
    if (searchPerformed && searchResults?.length === 0) {
      return <div>No items found for this search</div>;
    } else if (searchResults?.length > 0) {
      return (
        <div>
          <h3 className="mt-3 mx-3">Search Results</h3>
          <div className="menu-items mx-3">
            {searchResults.map((product, index) => (
              <ItemCard
                key={index}
                index={index}
                itemDesc={product.description}
                itemName={product.name}
                itemWeight={product.weight}
                itemImg={product.image}
                addToOrder={addToOrder}
                variants={product.variants}
                addOns={product.addOns}
                setCartItem={setCartItem}
                cart={cart}
              />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  // Function to handle searching when Enter key is pressed
  const handleSearchEnter = (event) => {
    if (event.key === "Enter") {
      setSearchPerformed(true);
      // Iterate through all products in the JSON data and filter out the matching ones
      const matchingProducts = [];
      jsonData.categories.forEach((category) => {
        category.subCategories.forEach((subCategory) => {
          subCategory.products.forEach((product) => {
            if (
              product.name.toLowerCase().includes(searchInput.toLowerCase())
            ) {
              matchingProducts.push(product);
            }
          });
        });
      });

      setSearchResults(matchingProducts);
    }
  };

  const renderMenuItems = () => {
    if (!selectedCategory) {
      return (
        <div>
          <h3>Select a category</h3>
        </div>
      );
    }

    const selectedMenu = jsonData?.categories.find(
      (category) => category.name === selectedCategory
    );

    if (selectedMenu && selectedItem === null) {
      return selectedMenu.subCategories.map((subCategory, index) => (
        <div key={index}>
          <HomeCard
            name={subCategory.name}
            image={subCategory.image}
            setSelectedItem={setSelectedItem}
          />
        </div>
      ));
    } else if (selectedMenu && selectedItem) {
      return (
        <div>
          {/* Back button */}
          <h3 className="mt-3">{selectedItem}</h3>
          <div className="menu-items">
            {selectedMenu.subCategories
              .find((subCategory) => subCategory.name === selectedItem)
              .products.filter((product) =>
                product.name.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((product, index) => (
                <ItemCard
                  key={index}
                  index={index}
                  itemDesc={product.description}
                  itemName={product.name}
                  itemImg={product.image}
                  addToOrder={addToOrder}
                  itemWeight={product.weight}
                  variants={product.variants}
                  addOns={product.addOns}
                  setCartItem={setCartItem}
                  cart={cart}
                />
              ))}
          </div>
        </div>
      );
    } else {
      return <div>No items found for this category</div>;
    }
  };

  return (
    <div>
      <div className="main d-flex flex-column pb-5">
        <div className="top-img-container">
          <img src="https://images.unsplash.com/32/Mc8kW4x9Q3aRR3RkP5Im_IMG_4417.jpg?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D" />
        </div>
        <div className="menu">
          <div className="d-flex flex-column mx-3">
            <h3>{storeData?.name}</h3>
            <div className="d-flex">
              <div>
                <i className="fa-solid fa-location-dot px-2"></i>
                <span>{storeData?.location}</span>
              </div>
              <div className="mx-2">
                <i className="fa-solid fa-wifi px-2"></i>
                <span>{storeData?.wifi_pass}</span>
              </div>
            </div>
            <div>{storeData?.description}</div>
          </div>
          <div className="menu-buttons my-3 mx-3">
            {jsonData?.categories.map((category, index) => (
              <button
                key={index}
                onClick={() => {
                  handleCategorySelection(category.name);
                  setSelectedItem(null);
                  renderMenuItems();
                }}
                className={`menu-button ${
                  selectedCategory === category.name ? "active" : ""
                }`}
              >
                {capitalizeFirstLetter(category.name)}
              </button>
            ))}
          </div>
          <div className="search d-flex align-items-center mx-3">
            <input
              className="search-input m-2"
              value={searchInput}
              onChange={handleSearchInputChange} // Add onChange event handler
              onKeyDown={handleSearchEnter} // Add onKeyDown event handler
            />
            <div className="search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div className="search-result">{renderSearchResults()}</div>
          <div className="menu-items mx-3">{renderMenuItems()}</div>
        </div>
        <Link to={"/order"} className="order-button">
          {cart?.length !== 0 ? (
            <button className="show-order" id="showOrderBtn">
              Show Order
            </button>
          ) : (
            ""
          )}
        </Link>
      </div>
    </div>
  );
}

export default Home;
