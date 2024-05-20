import React, { useState } from "react";

function ShowOrder({ storeData, cartItems, setCartItems }) {
  // Function to count occurrences of each item in the cart
  const countDuplicates = (arr) => {
    const counts = {};
    arr.forEach((item) => {
      const key = JSON.stringify(item); // Using JSON.stringify to compare objects
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  };

  const [duplicatesCount, setDuplicatesCount] = useState(
    countDuplicates(cartItems)
  );

  const handleAddItem = (item) => {
    const updatedCartItems = [...cartItems, item];
    setCartItems(updatedCartItems);
    setDuplicatesCount(countDuplicates(updatedCartItems));
  };

  const handleRemoveItem = (item) => {
    const indexToRemove = cartItems.findIndex(
      (cartItem) => JSON.stringify(cartItem) === JSON.stringify(item)
    );
    if (indexToRemove !== -1) {
      const updatedCartItems = [
        ...cartItems.slice(0, indexToRemove),
        ...cartItems.slice(indexToRemove + 1),
      ];
      setCartItems(updatedCartItems);
      setDuplicatesCount(countDuplicates(updatedCartItems));
    }
  };

  // Calculate total price per item and total order price
  const totalPerItem = (item) => {
    let totalPrice = 0;
    // Calculate total price of selected variants
    for (const price of Object.values(item.selectedVariants)) {
      totalPrice += price;
    }
    // Calculate total price of selected add-ons
    for (const addOn of Object.values(item.selectedAddOns)) {
      totalPrice += addOn.price;
    }
    return totalPrice;
  };

  const totalOrderPrice = cartItems.reduce((total, item) => total + totalPerItem(item), 0);

  // Filter out unique items to display in the order list
  const uniqueItems = Array.from(new Set(cartItems.map(JSON.stringify))).map(
    JSON.parse
  );

  return (
    <div>
      <div className="main d-flex flex-column">
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
          <h4 className="mx-3 my-3">MY ORDER: </h4>
          <div className="menu-items mx-3">
            {cartItems.length === 0 ? (
              <div className="d-flex mb-3 align-items-center justify-content-center flex-column">
                <h5 className="text-center">NO ITEMS PRESENT IN THE CART</h5>
              </div>
            ) : (
              uniqueItems.map((item, index) => {
                const key = JSON.stringify(item); // Using JSON.stringify to compare objects
                const count = duplicatesCount[key] || 1; // If no duplicates, count as 1
                const totalPrice = totalPerItem(item);
                return (
                  <div key={index} className="mb-4">
                    <h6>{item.itemName}</h6>
                    <div className="d-flex justify-content-between">
                      <div>
                        <ul>
                          {Object.entries(item.selectedVariants).map(
                            ([variant, price]) => (
                              <li key={variant}>
                                {variant}: {price}$
                              </li>
                            )
                          )}
                        </ul>
                        <ul>
                          {Object.entries(item.selectedAddOns).map(
                            ([addOnName, addOnDetails]) => (
                              <li key={addOnName}>
                                {addOnName}: {addOnDetails.name} - {addOnDetails.price}$
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          onClick={() => handleRemoveItem(item)}
                          style={{
                            fontSize: "30px",
                            margin: "0 0.3rem",
                            fontWeight: "bold",
                            outline: "none",
                            border: "none",
                            background: "none",
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            fontSize: "30px",
                            margin: "0 0.3rem",
                          }}
                          className="color-fg"
                        >
                          {count}
                        </span>
                        <button
                          onClick={() => handleAddItem(item)}
                          style={{
                            fontSize: "30px",
                            margin: "0 0.3rem",
                            fontWeight: "bold",
                            outline: "none",
                            border: "none",
                            background: "none",
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="color-fg" style={{fontSize: "18px", fontWeight: "bold"}}>{totalPrice}$</div>
                  </div>
                );
              })
            )}<hr/>
            <h5 className="mt-2 mb-4">Total: <span className="color-fg" style={{fontSize: "26px"}}>{totalOrderPrice}$</span></h5>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowOrder;
