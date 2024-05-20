import React, { useState, useEffect } from "react";

function ItemCard({
  itemName,
  itemDesc,
  itemWeight,
  itemImg,
  index,
  addToOrder,
  variants,
  addOns,
  setCartItem,
  cart,
}) {
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [addedToOrder, setAddedToOrder] = useState(false);
  const [count, setCount] = useState(0);
  const [currentGroup, setCurrentGroup] = useState([]);
  const popupId = `popup${index}`;

  const createItemKey = (item) => {
    const variantsKey = JSON.stringify(item.selectedVariants);
    const addOnsKey = JSON.stringify(item.selectedAddOns);
    return `${item.itemName}-${variantsKey}-${addOnsKey}`;
  };

  const groupCartItems = (cart) => {
    const groupedItems = {};
    cart.forEach((item) => {
      if (item.itemName === itemName) {
        const key = createItemKey(item);
        if (!groupedItems[key]) {
          groupedItems[key] = { ...item, count: 0 };
        }
        groupedItems[key].count += 1;
      }
    });
    return Object.values(groupedItems);
  };

  useEffect(() => {
    setCurrentGroup(groupCartItems(cart));
  }, [cart]);

  useEffect(() => {
    const cartItemCount = currentGroup.filter(
      (item) => item.itemName === itemName
    ).length;
    if (cartItemCount > 0) {
      setAddedToOrder(true);
      setCount(cartItemCount);
    } else {
      setAddedToOrder(false);
      setCount(0);
    }
  }, [currentGroup, itemName]);

  useEffect(() => {
    if (variants && variants.length > 0) {
      const defaultVariant = variants[0];
      setSelectedVariants({ [defaultVariant.name]: defaultVariant.price });
    }
  }, [variants]);

  useEffect(() => {
    const cartItemCount = cart?.filter(
      (item) => item.itemName === itemName
    ).length;
    if (cartItemCount > 0) {
      setAddedToOrder(true);
      setCount(cartItemCount);
    } else {
      setAddedToOrder(false);
      setCount(0);
    }
  }, [cart, itemName]);

  const openPopup = () => {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.style.display = "flex";
    }
    setSelectedAddOns({});
    const checkboxElements = document.querySelectorAll("input[type='checkbox']");
    const radioElements = document.querySelectorAll("input[type='radio']");
    const nonVariantRadioElements = Array.from(radioElements).filter(
      (radio) => radio.getAttribute("name") !== "variant"
    );
    checkboxElements.forEach((checkbox) => {
      checkbox.checked = false;
    });

    nonVariantRadioElements.forEach((radio) => {
      radio.checked = false;
    });
  };

  const closePopup = () => {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.style.display = "none";
    }
  };

  const handleVariantChange = (variantName, price) => {
    setSelectedVariants({ [variantName]: price });
  };

  const handleAddOnChange = (addOnName, optionName, price) => {
    setSelectedAddOns({
      ...selectedAddOns,
      [addOnName]: { name: optionName, price: price },
    });
  };

  const handleAddToOrder = () => {
    const order = {
      itemName: itemName,
      itemImg: itemImg,
      selectedVariants: selectedVariants,
      selectedAddOns: selectedAddOns,
    };
    addToOrder(order);
    setAddedToOrder(true);
    closePopup(popupId);
    setCount(count + 1);
  };

  const handleRemoveItem = (item) => {
    const duplicateIndex = cart.findIndex(
      (cartItem) =>
        cartItem.itemName === item.itemName &&
        createItemKey(cartItem) === createItemKey(item)
    );
  
    if (duplicateIndex !== -1) {
      const updatedCart = [...cart];
      if (item.count > 1) {
        const updatedGroup = currentGroup.map((groupItem) => {
          if (createItemKey(groupItem) === createItemKey(item)) {
            return { ...groupItem, count: groupItem.count - 1 };
          }
          return groupItem;
        });
        setCurrentGroup(updatedGroup);
        updatedCart.splice(duplicateIndex, 1);
      } else {
        updatedCart.splice(duplicateIndex, 1);
        setAddedToOrder(false);
        setCount(0);
      }
      setCartItem(updatedCart);
    }
  };
  

  const handleAddItem = (item) => {
    setCount(count + 1);
    const order = {
      itemName: item.itemName,
      itemImg: item.itemImg,
      selectedVariants: item.selectedVariants,
      selectedAddOns: item.selectedAddOns,
    };
    addToOrder(order);
  };

  const renderOrderControl = (currentGroup) => {
    if (cart.length !== 0) {
      return (
        <>
          <div className="order-menu" onClick={() => openPopup()}>
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </div>
          {currentGroup.map((item, index) => {
            const variantKeys = Object.keys(item.selectedVariants);
            const firstVariantKey =
              variantKeys.length > 0 ? variantKeys[0] : null;
            return (
              <div className="d-flex my-3 justify-content-between" key={index}>
                <div className="d-flex flex-column">
                  <div>
                    <span className="fw-bold">Variant: </span>
                    {firstVariantKey ? `${firstVariantKey}` : "None"}
                  </div>
                  <div>
                    {Object.entries(item.selectedAddOns).map(
                      ([addOnName, addOn]) => (
                        <div key={addOnName}>
                          <span className="fw-bold">{addOnName}</span>
                          {`: ${addOn.name}`}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-end">
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
                      color: "#f7906c",
                    }}
                  >
                    {item.count}
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
            );
          })}
        </>
      );
    } else {
      if (
        variants &&
        variants.length === 1 &&
        (!addOns || addOns.length === 0)
      ) {
        return (
          <div
            className="plus-icon d-flex justify-content-end"
            onClick={handleAddToOrder}
          >
            <i
              className="fa-solid fa-plus"
              aria-hidden="true"
              style={{
                color: "white",
                background: "#f7906c",
                padding: "0.7rem",
                borderRadius: "50%",
              }}
            ></i>
          </div>
        );
      } else {
        return (
          <div className="order-menu" onClick={() => openPopup()}>
            <i className="fa-solid fa-bars" aria-hidden="true"></i>
          </div>
        );
      }
    }
  };

  return (
    <div className="menu-item menu-item-items">
      <img src={itemImg} alt={itemName} className="item-image" />
      <div className="d-flex justify-content-between">
        <div className="item-name">{itemName}</div>
        <div className="item-weight">{itemWeight}</div>
      </div>
      <div className="item-price">{itemDesc}</div>
      {renderOrderControl(currentGroup)}
      <div className="popup-container" id={popupId}>
        <div className="popup">
          <button
            className="cross-button"
            onClick={() => {
              closePopup();
            }}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true"></i>
          </button>
          <div className="d-flex flex-column over-y">
            <img src={itemImg} alt={itemName} className="b-12" />
            <h4 className="item-name my-2">{itemName}</h4>
            <div className="item-price">{itemDesc}</div>
            {variants && (
              <div className="types d-flex flex-column">
                {variants.map((variant, i) => (
                  <div key={i}>
                    <div className="my-1 d-flex justify-content-between">
                      <div className="d-flex">
                        <input
                          type="radio"
                          name="variant"
                          id={`${variant.name}`}
                          value={variant.price}
                          defaultChecked={i === 0}
                          className={`mx-2 ${itemName}-${variant.name}`}
                          onChange={() =>
                            handleVariantChange(variant.name, variant.price)
                          }
                        />
                        <label htmlFor={`${variant.name}`}>
                          {variant.name}
                        </label>
                      </div>
                      <div className="price">{variant.price}$</div>
                    </div>
                  </div>
                ))}
                {addOns &&
                  addOns.map((addOn, j) => (
                    <div className="types" key={j}>
                      <h5>{addOn.name}</h5>
                      {addOn.type === "single"
                        ? addOn.options.map((option, k) => (
                            <div
                              className="my-1 d-flex justify-content-between"
                              key={k}
                            >
                              <div className="d-flex">
                                <input
                                  type="radio"
                                  name={`${itemName}-${addOn.name}`}
                                  id={`${option.name}-${itemName}`}
                                  value={option.price}
                                  className={`mx-2 ${itemName}`}
                                  onChange={() =>
                                    handleAddOnChange(
                                      addOn.name,
                                      option.name,
                                      option.price
                                    )
                                  }
                                />
                                <label htmlFor={`${option.name}-${itemName}`}>
                                  {option.name}
                                </label>
                              </div>
                              <div className="price">{option.price}$</div>
                            </div>
                          ))
                        : addOn.options.map((option, k) => (
                            <div
                              className="my-1 d-flex justify-content-between"
                              key={k}
                            >
                              <div className="d-flex">
                                <input
                                  type="checkbox"
                                  name={`${itemName}-${addOn.name}`}
                                  id={`${option.name}-${itemName}`}
                                  value={option.price}
                                  className={`mx-2 ${itemName}`}
                                  onChange={() =>
                                    handleAddOnChange(
                                      addOn.name,
                                      option.name,
                                      option.price
                                    )
                                  }
                                />
                                <label htmlFor={`${option.name}-${itemName}`}>
                                  {option.name}
                                </label>
                              </div>
                              <div className="price">{option.price}$</div>
                            </div>
                          ))}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center mt-4">
            <button className="add-to-order" onClick={handleAddToOrder}>
              Add To Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
