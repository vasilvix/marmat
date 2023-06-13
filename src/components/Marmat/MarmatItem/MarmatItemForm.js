import { useState } from 'react';

import Input from '../../UI/Input';
import classes from './MarmatItemForm.module.css';

const MarmatItemForm = (props) => {
  const [quantity, setQuantity] = useState(1);

  const submitHandler = (event) => {
    event.preventDefault();
    props.onAddToCart(quantity);
  };

  const onDeleteHandler = () => {
    if (quantity > 1) {
      setQuantity((prevState) => prevState - 1);
    }
  }

  const onAddHandler = () => {
    setQuantity((prevState) => prevState + 1);
  }

  return (
    <form onSubmit={submitHandler}>
      <div className={classes["new-product__buttons"]}>
        <div className={classes["quantity-buttons"]}>
          <button
            type="button"
            className={`${classes["quantity-buttons__button"]} ${classes["quantity-buttons__button_min"]}`}
            onClick={onDeleteHandler}
          >
            <span></span>
          </button>
          <Input
            input={{
              id: `amount_${props.id}`,
              type: 'number',
              min: '1',
              max: '999',
              step: '1',
              disabled: true,
              value: quantity
            }}
          />
          <button
            type="button"
            className={`${classes["quantity-buttons__button"]} ${classes["quantity-buttons__button_max"]}`}
            onClick={onAddHandler}
          >
            <span></span>
          </button>
        </div>
        <button type="submit" className={classes["new-btn"]}>
          <span>
            Добавить
          </span>
        </button>
      </div>
    </form>
  );
};

export default MarmatItemForm;
