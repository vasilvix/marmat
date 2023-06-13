import { Fragment } from 'react';
import ReactDOM from 'react-dom';

import classes from './Modal.module.css';

import modalClose from '../../assets/img/modal-close.png';

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.onClose} />;
};

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes["modal__close"]} onClick={props.onClose}>
        <img src={modalClose} alt="close" />
      </div>
      <div className={classes["modal__content"]}>{props.children}</div>
    </div>
  );
};

const portalElement = document.getElementById('overlays');

const Modal = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(<Backdrop onClose={props.onClose} />, portalElement)}
      {ReactDOM.createPortal(
        <ModalOverlay onClose={props.onClose} >{props.children}</ModalOverlay>,
        portalElement
      )}
    </Fragment>
  );
};

export default Modal;
