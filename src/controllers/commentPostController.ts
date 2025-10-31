import { getNextId, readData, writeData } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export default async function commentPostController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { productId, text } = req.body;

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const users = await readData("users");
    const user = users.find((u: any) => u.id === decoded.id);

    const newComment = {
      id: await getNextId("comments"),
      productId: Number(productId),
      userId: decoded.id,
      userName: user.name,
      comment: text,
      createdAt: new Date().toISOString(),
    };

    await writeData("comments", newComment);
    return res.status(201).json(newComment);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
