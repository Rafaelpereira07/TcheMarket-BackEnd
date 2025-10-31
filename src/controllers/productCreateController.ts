import { getNextId, writeData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export default async function productCreateController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { name, price, image, description, location } = req.body;

    if (!name || !price || !image || !description || !location) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);
    console.log(decoded)
    const newProduct = {
      id: await getNextId("products"),
      userId: decoded.id,
      name,
      price: Number(price),
      image,
      description,
      location,
      createdAt: new Date().toISOString(),
    };

    await writeData("products", newProduct);
    return res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
