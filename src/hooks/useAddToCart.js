import { useContext, useCallback } from 'react';
import { CartContext } from '../context/CartContext';
import { useGroupOrder } from '../context/GroupOrderContext';

export const useAddToCart = () => {
  const { addToCart } = useContext(CartContext);
  const { group, addItem } = useGroupOrder();

  const handleAdd = useCallback(async (item) => {
    if (group?.code) {
      try { await addItem(item); } catch (_) {}
    }
    addToCart(item);
  }, [group, addItem, addToCart]);

  return { addToCart: handleAdd };
};

