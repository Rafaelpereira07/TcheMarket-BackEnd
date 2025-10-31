import { readData, writeData } from "../utils/databaseManager";

export async function getCartController(req: any, res: any) {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "ID do usuário não informado" });
  }

  const db = await readData("users");
  const user = db.find((u: any) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  return res.status(200).json({ cart: user.cart || [] });
}

export async function addToCartController(req: any, res: any) {
  const { id, product } = req.body;

  if (!id || !product) {
    return res.status(400).json({ message: "Usuário ou produto inválido" });
  }

  const users = await readData("users");
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const user = users[userIndex];
  if (!Array.isArray(user.cart)) user.cart = [];

  const existing = user.cart.find((item: any) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    user.cart.push({ ...product, quantity: 1 });
  }

  users[userIndex] = user;
  await writeData("users", users);

  return res.status(200).json({ message: "Produto adicionado ao carrinho", cart: user.cart });
}

export async function removeFromCartController(req: any, res: any) {
  const { id, productId } = req.body;

  if (!id || !productId) {
    return res.status(400).json({ message: "Usuário ou produto inválido" });
  }

  const users = await readData("users");
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const user = users[userIndex];
  if (!Array.isArray(user.cart)) user.cart = [];

  user.cart = user.cart.filter((item: any) => item.id !== productId);
  users[userIndex] = user;
  await writeData("users", users);

  return res.status(200).json({ message: "Produto removido do carrinho", cart: user.cart });
}
