"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const doctors_routes_1 = __importDefault(require("./routes/doctors.routes"));
(0, dotenv_1.configDotenv)();
const PORT = process.env.PORT || 5001;
const app = (0, express_1.default)();
app.use((req, res, next) => {
    let raw = '';
    req.on('data', chunk => raw += chunk);
    req.on('end', () => {
        console.log("[Raw Body]:", raw);
    });
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/doctors", doctors_routes_1.default);
// Basic GET route
app.get("/", (req, res) => {
    res.send("SepShield API is running");
});
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT ${PORT}`);
});
