import { readData, writeDataBulk } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export default async function cartUpdateController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const cart = req.body; // Espera um array de CartItem

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const users = await readData("users");
    const userIndex = users.findIndex((u: any) => u.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    users[userIndex].cart = cart;
    await writeDataBulk("users", users);

    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
