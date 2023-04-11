import React, {useContext, useState, useRef} from 'react';

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

    const totalAmount = `${cartCtx.totalAmount.toFixed(2)} руб.`;
    const hasItems = cartCtx.items.length > 0;

    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id);
    };

    const cartItemAddHandler = (item) => {
        cartCtx.addItem({...item, amount: 1});
    };

    const confirmHandler = (event) => {
        event.preventDefault();

    };

    const submitOrderHandler = async (e) => {
        e.preventDefault();

        const responsibleId = 72;

        const comment = commentInputRef.current.value.trim();

        setIsSubmitting(true);

        const user = await bx24.call('user.current');

        const dealId = await bx24.call('crm.deal.add', {
            'fields':
                {
                    'TITLE': `Заказ МАРМАТ от ${user['LAST_NAME']} ${user['NAME']} ${user['SECOND_NAME']}`,
                    'TYPE_ID': 'GOODS',
                    'OPENED': 'Y',
                    'ASSIGNED_BY_ID': responsibleId,
                    'CATEGORY_ID': 48,
                    'UF_CRM_CREATED_BY': user['ID'],
                }
        });

        const tableBody = cartCtx.items.reduce((accumulator, item) => {
            return accumulator + `[TR][TD][B]${item.name}[/B][/TD][TD]${item.amount} шт.[/TD][/TR]`;
        }, '');
        let taskDescription = `[TABLE]${tableBody}[/TABLE]`

        const productRows = cartCtx.items.map(item => {
            return {
                'ownerId': dealId,
                'ownerType': 'D',
                'productId': item.id,
                'productName': item.name,
                'price': item.price,
                'quantity': item.amount,
                'taxRate': 0,
                'taxIncluded': 'Y'
            }
        });

        const productRowsSetRequest = await bx24.call('crm.item.productrow.set', {
            'ownerType': 'D',
            'ownerId': dealId,
            'productRows': productRows
        });

        if (!!comment) {
            const commentAddRequest = await bx24.call('crm.timeline.comment.add', {
                'fields': {
                    'ENTITY_ID': dealId,
                    'ENTITY_TYPE': 'deal',
                    'COMMENT': comment
                }
            });
            taskDescription += `[B]Комментарий[/B]: ${comment}`
        }

        const taskAddRequest = await bx24.call('tasks.task.add', {
            'fields': {
                'TITLE': `Заказ МАРМАТ от ${user['LAST_NAME']} ${user['NAME']} ${user['SECOND_NAME']}`,
                'DESCRIPTION': taskDescription,
                'STATUS': 2,
                'RESPONSIBLE_ID': responsibleId,
                'CREATED_BY': user['ID'],
                'UF_CRM_TASK': [`D_${dealId}`]
            }
        });

        const dealUpdateRequest = await bx24.call('crm.deal.update', {
            'id': dealId,
            'fields': {
                'STAGE_ID': 'C48:PREPARATION',
            }
        });

        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart();
    };

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map((item) => (
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                />
            ))}
        </ul>
    );

    const cartModalContent = (
        <React.Fragment>
            {cartItems}
            <div className={classes.total}>
                <span>Итого</span>
                <span>{totalAmount}</span>
            </div>
            <form className={classes.form} onSubmit={confirmHandler}>
                <div className={classes.control}>
                    <label htmlFor='comment'>Комментарий</label>
                    <textarea rows='3' cols='79' id='comment' ref={commentInputRef}/>
                </div>
                <div className={classes.actions}>
                    <button type='button' onClick={props.onClose}>
                        Отмена
                    </button>
                    <button className={classes.submit} onClick={submitOrderHandler}>Заказать</button>
                </div>
            </form>
        </React.Fragment>
    );
    const cartEmptyModalContent = (
        <React.Fragment>
            <div>Корзина пуста</div>
            <div className={classes.actions}>
                <button type='button' onClick={props.onClose}>
                    Закрыть
                </button>
            </div>
        </React.Fragment>
    );

    const isSubmittingModalContent = <p>Создание заказа...</p>;

    const didSubmitModalContent = (
        <React.Fragment>
            <p>Заказ успешно создан</p>
            <div className={classes.actions}>
                <button className={classes.button} onClick={props.onClose}>
                    Закрыть
                </button>
            </div>
        </React.Fragment>
    );

    return (
        <Modal onClose={props.onClose}>
            {!isSubmitting && !didSubmit && hasItems && cartModalContent}
            {!isSubmitting && !didSubmit && !hasItems && cartEmptyModalContent}
            {isSubmitting && isSubmittingModalContent}
            {!isSubmitting && didSubmit && didSubmitModalContent}
        </Modal>
    );
};

export default Cart;
