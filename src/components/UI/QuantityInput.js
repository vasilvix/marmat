import React from 'react';
import ReactDOM from 'react-dom';

import classes from './QuantityInput.module.css';

const QuantityInput = (props) => {
    return (
        <div className={classes["quantity-buttons"]}>
            <button onClick={props.onRemove} class="quantity-buttons__button quantity-buttons__button_min"> <span></span> </button>
            <input type="number" value={props.amount} class="quantity-buttons__input" disabled />
            <button onClick={props.onAdd} class="quantity-buttons__button quantity-buttons__button_max"> <span></span> </button>
        </div>
    );
};

export default QuantityInput;
