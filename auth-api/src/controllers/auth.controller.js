import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/token.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Preencha nome, email e senha." });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email já cadastrado." });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed });

    const token = signToken({ id: user._id });

    return res.status(201).json({
      message: "Usuário criado com sucesso!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Preencha email e senha." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Credenciais inválidas." });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Credenciais inválidas." });

    const token = signToken({ id: user._id });

    return res.json({
      message: "Login ok!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: "Erro no servidor.", error: err.message });
  }
}
