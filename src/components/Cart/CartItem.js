import React, { useState } from 'react';


import classes from './CartItem.module.css';

import cartClose from '../../assets/img/cart-close.png';
import cartCloseBlue from '../../assets/img/cart-close_blue.png';

const CartItem = (props) => {

  const [isShown, setIsShown] = useState(false);

  const price = `${props.price.toFixed(0)} ₽`;

  return (
    <div className={classes["cart-item"]}>
      <div className={classes["cart-item__col"]}>
        <span>
          {props.name}
        </span>
      </div>

      <div className={classes["cart-item__col"]}>
        <span>
          {price}
        </span>
      </div>

      <div className={classes["cart-item__col"]}>
        <div className={classes["quantity-buttons"]}>
          <button
            className={`${classes["quantity-buttons__button"]} ${classes["quantity-buttons__button_min"]}`}
            onClick={props.onRemove}
          >
            <span></span>
          </button>
          <input
            type="number"
            value={props.amount}
            className={classes["quantity-buttons__input"]}
            disabled={true}
          />
          <button
            className={`${classes["quantity-buttons__button"]} ${classes["quantity-buttons__button_max"]}`}
            onClick={props.onAdd}
          >
            <span></span>
          </button>
        </div>
      </div>
      <div className={classes["cart-item__col"]}>
        <div
          className={classes["cart-item-close"]}
          onClick={props.onRemoveRow}
          onMouseEnter={() => setIsShown(true)}
          onMouseLeave={() => setIsShown(false)}>
          <img src={cartClose} alt="" className={`${!isShown && classes["active"]}`} />
          <img src={cartCloseBlue} alt="" className={`${isShown && classes["active"]}`} />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
