import { getNextId, readData, writeData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export default async function ratingPostController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { productId, sellerId, rating, text } = req.body;

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const users = await readData("users");
    const user = users.find((u: any) => u.id === decoded.id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const newRating = {
      id: await getNextId("ratings"),
      productId: Number(productId),
      sellerId: sellerId,
      raterId: decoded.id,
      raterName: user.name,
      rating: Number(rating),
      text: text,
    };

    await writeData("ratings", newRating);
    return res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
