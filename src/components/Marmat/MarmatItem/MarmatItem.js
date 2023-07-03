import { useContext } from 'react';

import MarmatItemForm from './MarmatItemForm';
import classes from './MarmatItem.module.css';
import CartContext from '../../../store/cart-context';

const MarmatItem = (props) => {
    const cartCtx = useContext(CartContext);

    const price = `${props.price.toFixed(0)} ₽`;
    const productQuantity = props.productQuantity;
    const inStock = productQuantity !== 0;

    const addToCartHandler = amount => {
        cartCtx.addItem({
            id: props.id,
            name: props.name,
            amount: amount,
            price: props.price
        });
    };

    const notInStockText = (
        <div className={classes['not-in-stock__text']}>
            Временно<br />
            нет в наличии
        </div>
    );

    const formContent = inStock
        ? <MarmatItemForm id={props.id} onAddToCart={addToCartHandler} />
        : notInStockText;

    return (
        <div className={classes["new-product"]}>
            <div className={classes["new-product-info"]}>
                <div className={classes["new-product__image"]}>
                    <img
                        src={`https://prin.bitrix24.ru/${props.image}`}
                        alt={props.name}
                    />
                    {
                        inStock &&
                        <div className={classes['new-product-product-quantity']}>
                            На складе: {productQuantity}
                        </div>
                    }
                </div>
                <div className={classes["new-product__info"]}>
                    <h5 className={!inStock ? classes["not-in-stock"] : undefined}>
                        {props.name}
                    </h5>
                    <p className={!inStock ? classes["not-in-stock"] : undefined}>
                        {props.description}
                    </p>
                    <span className={`${classes["new-product__info-price"]} ${!inStock && classes["not-in-stock"]}`}>
                        {price}
                    </span>
                </div>
            </div>
            {formContent}
        </div>
    );
};

export default MarmatItem;
