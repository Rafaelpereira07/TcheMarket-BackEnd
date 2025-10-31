import { readData } from "../utils/databaseManager";

export default async function productsGetController(req: any, res: any) {
  try {
    const { id } = req.params;
    const { q } = req.query;

    const products = await readData("products");

    // Get by ID
    if (id) {
      const product = products.find((p: any) => p.id === Number(id));
      return product
        ? res.status(200).json(product)
        : res.status(404).json({ message: "Produto não encontrado." });
    }

    // Get by Search Query
    if (q) {
      const query = String(q).toLowerCase();
      const filtered = products.filter((p: any) => p.name.toLowerCase().includes(query));
      return res.status(200).json(filtered);
    }

    // Get All (newest first)
    const sortedProducts = products.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    return res.status(200).json(sortedProducts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
