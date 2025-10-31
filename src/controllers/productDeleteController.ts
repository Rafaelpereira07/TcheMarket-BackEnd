import { readData, writeDataBulk } from "../utils/databaseManager";
import { verifyToken } from "../utils/jwtManager";

export default async function productDeleteController(req: any, res: any) {
  try {
    const { authorization } = req.headers;
    const { id } = req.params;
    const productId = Number(id);

    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const products = await readData("products");
    const product = products.find((p: any) => p.id === productId);

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    if (product.userId !== decoded.id) {
      return res.status(403).json({ message: "Não autorizado a deletar este produto." });
    }

    const updatedProducts = products.filter((p: any) => p.id !== productId);
    await writeDataBulk("products", updatedProducts);

    return res.status(200).json({ message: "Produto deletado." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
