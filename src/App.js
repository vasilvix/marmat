import { useState } from 'react';

import Header from './components/Layout/Header';
import MarmatStart from './components/Marmat/MarmatStart';
import Cart from './components/Cart/Cart';
import CartProvider from './store/CartProvider';
import Marmat from './components/Marmat/Marmat';

function App() {
  const [catalogId, setCatalogId] = useState(0);
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  const sectionSelectHandler = (id) => {
    setCatalogId(() => id);
  }
  const headerClickHandler = () => {
    setCatalogId(() => 0);
  }

  return (
    <CartProvider>
      {cartIsShown && <Cart onClose={hideCartHandler} />}
      <Header
        onShowCart={showCartHandler}
        onClick={headerClickHandler}
      />
      <main>
        {
          catalogId === 0
          &&
          <MarmatStart
            onSelectCatalog={sectionSelectHandler}
          />
        }
        {
          catalogId !== 0
          && <Marmat
            catalog={catalogId}
            onArrowClick={headerClickHandler}
          />
        }
      </main>
    </CartProvider>
  );
}

export default App;
