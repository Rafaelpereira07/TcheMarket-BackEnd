import { getNextId, writeData, readData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export async function commentCreateController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { productId, text } = req.body;

    if (!productId || !text)
      return res.status(400).json({ message: "Produto e texto são obrigatórios." });

    const token = authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    const newComment = {
      id: await getNextId("comments"),
      userId: decoded.id,
      userName: decoded.username,
      productId: Number(productId),
      text,
      createdAt: new Date().toISOString(),
    };

    await writeData("comments", newComment);
    return res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao criar comentário." });
  }
}

export async function commentsGetController(req: any, res: any) {
  try {
    const { productId } = req.query;
    const comments = await readData("comments");
    const filtered = productId ? comments.filter((c: any) => c.productId == productId) : comments;
    return res.status(200).json(filtered);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao buscar comentários." });
  }
}
