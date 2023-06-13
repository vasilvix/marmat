import { useContext } from 'react';

import MarmatItemForm from './MarmatItemForm';
import classes from './MarmatItem.module.css';
import CartContext from '../../../store/cart-context';

const MarmatItem = (props) => {
    const cartCtx = useContext(CartContext);

    const price = `${props.price.toFixed(0)} ₽`;

    const addToCartHandler = amount => {
        cartCtx.addItem({
            id: props.id,
            name: props.name,
            amount: amount,
            price: props.price
        });
    };

    return (
        <div className={classes["new-product"]}>
            <div className={classes["new-product__image"]}>
                <img
                    src={`https://prin.bitrix24.ru/${props.image}`}
                    alt={props.name}
                />
            </div>
            <div className={classes["new-product__info"]}>
                <h5>
                    {props.name}
                </h5>
                <p>
                    {props.description}
                </p>
                <span className={classes["new-product__info-price"]}>
                    {price}
                </span>
            </div>
            <MarmatItemForm id={props.id} onAddToCart={addToCartHandler} />
        </div>
    );
};

export default MarmatItem;
