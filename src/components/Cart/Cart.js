import React, { useContext, useState, useRef } from 'react';

import bx24 from '../../bx24/bx24';

import Modal from '../UI/Modal';
import CartItem from './CartItem';
import classes from './Cart.module.css';
import CartContext from '../../store/cart-context';

const Cart = (props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [didSubmit, setDidSubmit] = useState(false);
    const cartCtx = useContext(CartContext);

    const commentInputRef = useRef();

    const totalAmount = `${cartCtx.totalAmount.toFixed(0)} ₽`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemRemoveRowHandler = (id) => {
        cartCtx.removeItemRow(id);
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({ ...item, amount: 1 });
    };

    const submitOrderHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const comment = commentInputRef.current.value.trim();
        await bx24.addMarmatOrder(cartCtx.items, comment)

        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    };

    const cartItems = (
        <div className={classes["new-cart__items"]}>
            {cartCtx.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                    onRemoveRow={cartItemRemoveRowHandler.bind(null, item.id)}
                />
            ))}
        </div>
    );

    const cartModalContent = (
        <React.Fragment>
            <h3>
                Корзина
            </h3>
            {cartItems}
            <div className={classes["new-cart__last"]}>
                <div className={classes["cart-comment"]}>
                    <span>
                        Комментарий:
                    </span>
                    <textarea
                        placeholder='К примеру, тут можете написать, в какое ОП надо отправить заказ и желаемую дату получения'
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                        className={classes["new-input"]}
                        ref={commentInputRef}
                    >
                    </textarea>
                </div>
                <div className={classes["cart-summary"]}>
                    <div className={classes["cart-summary__text"]}>
                        <div className={classes["cart-summary__text-item"]}>
                            <span>
                                Итого:
                            </span>
                        </div>
                        <div className={classes["cart-summary__text-item"]}>
                            <b className={classes["cart-summary-price"]}>{totalAmount}</b>
                        </div>
                    </div>
                    <button onClick={submitOrderHandler} className={classes["new-btn"]}>
                        <span>
                            Заказать
                        </span>
                    </button>
                </div>
            </div>
        </React.Fragment>
    );

    const cartEmptyModalContent = (
        <div className={classes["cart-empty"]}>
            <div className={classes["message-content"]}>Корзина пуста</div>
            <div className={classes["button-wrapper"]}>
                <button onClick={props.onClose} className={classes["new-btn"]}>
                    <span>
                        Закрыть
                    </span>
                </button>
            </div>
        </div>
    );

    const isSubmittingModalContent = <div className={classes["message-content"]}>Создание заказа...</div>;

    const didSubmitModalContent = (
        <div className={classes["cart-empty"]}>
            <div className={classes["message-content"]}>Заказ успешно создан</div>
            <div className={classes["button-wrapper"]}>
                <button onClick={props.onClose} className={classes["new-btn"]}>
                    <span>
                        Закрыть
                    </span>
                </button>
            </div>
        </div>
    );

    return (
        <Modal onClose={props.onClose}>
            <div className={classes["new-cart"]}>
                {!isSubmitting && !didSubmit && hasItems && cartModalContent}
                {!isSubmitting && !didSubmit && !hasItems && cartEmptyModalContent}
                {isSubmitting && isSubmittingModalContent}
                {!isSubmitting && didSubmit && didSubmitModalContent}
            </div>
        </Modal>
    );
};

export default Cart;
