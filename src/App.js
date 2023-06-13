import { useState } from 'react';

import Header from './components/Layout/Header';
import MarmatStart from './components/Marmat/MarmatStart';
import Cart from './components/Cart/Cart';
import CartProvider from './store/CartProvider';
import Marmat from './components/Marmat/Marmat';

function App() {
  const [catalog, setCatalog] = useState('');
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  const customersCatalogSelectionHandler = () => {
    setCatalog(() => 'customers');
  }

  const employeesCatalogSelectionHandler = () => {
    setCatalog(() => 'employees');
  }

  const headerClickHandler = () => {
    setCatalog(() => '');
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
          catalog === ''
          &&
          <MarmatStart
            selectCustomerCatalog={customersCatalogSelectionHandler}
            selectEmployeesCatalog={employeesCatalogSelectionHandler}
          />
        }
        {catalog !== '' && <Marmat catalog={catalog} />}
      </main>
    </CartProvider>
  );
}

export default App;
