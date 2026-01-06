import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  const addToCart = (p) => {
    setCart([...cart, { ...p, qty: 1 }]);
  };

  const checkout = async () => {
    await api.post("/orders", { items: cart });
    alert("Sale Completed");
    setCart([]);
  };

  return (
    <div>
      <h2>POS</h2>
      {products.map(p => (
        <div key={p.id}>
          {p.name} - ${p.price}
          <button onClick={()=>addToCart(p)}>Add</button>
        </div>
      ))}
      <button onClick={checkout}>Checkout</button>
    </div>
  );
}
