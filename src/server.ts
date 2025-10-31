import jsonServer from "json-server";
import { authMiddleware } from "./middlewares/authMiddleware";

// Controladores de Autenticação
import registerController from "./controllers/registerController";
import loginController from "./controllers/loginController";
import userSearchController from "./controllers/userSearchController";
import meController from "./controllers/meController";
import validateTokenController from "./controllers/validateTokenController";
import userGetByIdController from "./controllers/userGetByIdController";

// Controladores do Marketplace
import productsGetController from "./controllers/productsGetController";
import productCreateController from "./controllers/productCreateController";
import productDeleteController from "./controllers/productDeleteController";
import cartUpdateController from "./controllers/cartUpdateController";
import commentPostController from "./controllers/commentPostController";
import ratingPostController from "./controllers/ratingPostController";

// Importar os controladores GET que estavam 'escondidos'
import { commentsGetController } from "./controllers/commentCreateController";
import { ratingsGetController } from "./controllers/ratingCreateController";

const databasePath = "db.json";

const server = jsonServer.create();
const router = jsonServer.router(databasePath);

// Middlewares padrão (body-parser, etc.)
server.use(jsonServer.defaults({
  bodyParser: true,
}));

// --- 1. ROTAS PÚBLICAS E DE AUTENTICAÇÃO ---
server.post("/register", registerController);
server.post("/login", loginController);
server.get("/users/search", userSearchController);
server.get("/me", meController);
server.post("/token/validate", validateTokenController);

// --- 2. ROTAS PÚBLICAS CUSTOMIZADAS (GET) ---
server.get("/products", productsGetController);
server.get("/products/:id", productsGetController);
server.get("/users/:id", userGetByIdController);
server.get("/comments", commentsGetController); // ADICIONADO
server.get("/ratings", ratingsGetController); // ADICIONADO

// --- 3. MURO DE AUTENTICAÇÃO ---
// (Tudo abaixo desta linha só funciona se o usuário enviar um token válido)
server.use(authMiddleware);

// --- 4. ROTAS PROTEGIDAS (Marketplace) ---
server.post("/products", productCreateController);
server.delete("/products/:id", productDeleteController);
server.put("/cart", cartUpdateController);
server.post("/comments", commentPostController);
server.post("/ratings", ratingPostController);

// --- 5. ROUTER PADRÃO DO JSON-SERVER ---
// (DEVE VIR POR ÚLTIMO)
// (Rotas não definidas manualmente serão tratadas aqui)
server.use(router);

// Inicia o servidor
server.listen(3000, () => {
  console.log("Server running on port 3000!");
});
