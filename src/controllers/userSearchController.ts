import { readData } from "../utils/databaseManager";

export default async function userSearchController(req: any, res: any) {
  try {
    const { name, email } = req.body;

    const users = await readData("users");

    // Filtro flexível
    const filtered = users.filter((user: any) => {
      const matchName = name
        ? user.name.toLowerCase().includes(String(name).toLowerCase())
        : true;
      const matchEmail = email
        ? user.email.toLowerCase() === String(email).toLowerCase()
        : true;

      return matchName && matchEmail;
    });

    if (filtered.length === 0) {
      return res.status(404).json({ message: "Nenhum usuário encontrado." });
    }

    // Evita retornar senha
    const sanitized = filtered.map(({ password, ...rest }: any) => rest);

    return res.status(200).json(sanitized);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
