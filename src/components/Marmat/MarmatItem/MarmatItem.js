import {useContext} from 'react';

import MarmatItemForm from './MarmatItemForm';
import classes from './MarmatItem.module.css';
import CartContext from '../../../store/cart-context';
import Card from "../../UI/Card";

const MarmatItem = (props) => {
    const cartCtx = useContext(CartContext);

    const price = `${props.price.toFixed(2)} руб.`;

    const addToCartHandler = amount => {
        cartCtx.addItem({
            id: props.id,
            name: props.name,
            amount: amount,
            price: props.price
        });
    };

    return (
        <li>
            <Card>
                <div className={classes.marmat_item}>
                    <div className={classes.marmat_item_image}>
                        <img src={`https://prin.bitrix24.ru/${props.image}`}  alt={props.name} width="200" height="200" />
                    </div>
                    <div className={classes.marmat_item_info}>
                        <div>
                            <h3>{props.name}</h3>
                            <div className={classes.description}>{props.description}</div>
                            <div className={classes.price}>{price}</div>
                        </div>
                        <div>
                            <MarmatItemForm id={props.id} onAddToCart={addToCartHandler}/>
                        </div>
                    </div>
                </div>
            </Card>
        </li>
    );
};

export default MarmatItem;
