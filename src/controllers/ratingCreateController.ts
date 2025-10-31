import { getNextId, writeData, readData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export async function ratingCreateController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { productId, rating, text } = req.body;

    if (!productId || !rating)
      return res.status(400).json({ message: "Produto e nota são obrigatórios." });

    const token = authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    const newRating = {
      id: await getNextId("ratings"),
      userId: decoded.id,
      userName: decoded.username,
      productId: Number(productId),
      rating: Number(rating),
      text,
      createdAt: new Date().toISOString(),
    };

    await writeData("ratings", newRating);
    return res.status(201).json(newRating);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar avaliação." });
  }
}

export async function ratingsGetController(req: any, res: any) {
  try {
    const { productId, sellerId } = req.query;
    const ratings = await readData("ratings");

    let filtered = ratings;

    if (productId) {
      filtered = ratings.filter((r: any) => r.productId == productId);
    } else if (sellerId) {
      filtered = ratings.filter((r: any) => r.sellerId == sellerId);
    }

    return res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar avaliações." });
  }
}
