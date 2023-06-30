

// express for our library
import express from "express";
// to process the request body
import bodyParser from "body-parser";
// for mongo db access
import mongoose from "mongoose";
// cors for cross origin requests
import cors from "cors";
// for environment variables
import dotenv from "dotenv";
// so we can upload our files locally 
import multer from "multer";
// for request safety
import helmet from "helmet";
// for logging
import morgan from "morgan";
// comes with node already we don't have to install it
// الاتنين اللي تحت دول بتوع الباس هيسمحولنا  انا احنا نظبط الباس لما نيجي نحدد الوجهة
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

/* CONFIGURATIONS */
// this config so we can grab the file url 
// عشان كدا حطيت ف ملف الباكيجس دوت جيسون التايب موديول عشان اقدر استخدم دول
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// عشان اقدر استخدم دوت اينف فايلز
dotenv.config();
// invoke express so i can use our middleware
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
// this is going to set the directory of we keep our assets in our case it will be images
// that we store
// this will store locally
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
// multer = this how u can save your files so anytime any one upload a file in ur website
// then it is gonna say destination it;s going to be save in assets folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// every time we upload a file we gonna use this variable
const upload = multer({ storage });

/* ROUTES WITH FILES */
// upload.single("picture") = middle ware function before hit endpoint
// غملت دا هنا عشان الابلود مرتبط بالابلود اللي فوق اللي بيساوي مولتر فمينفعش افصلهم ف ملف منفصل ع عكس اللوجين
app.post("/auth/register", upload.single("picture"), register);
// عشان لو المستخدم عاوز يرفع صورة تبع بوست
app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
// اليوزر راوت دا عشان لو دخلت صفحة يوزر يجيبلي كل بيانات المستخدم ويعرضها ف صفحته 
// وقايمة الاصدقاء بتوعي كل دا عن طريق الاي دي بتاع كل يوزر
// وراوت عشان اضيف او احذف صديق
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
// لو البورت مشتغلش لسبب ما هيبقى عندنا 6001 احتياطي
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
