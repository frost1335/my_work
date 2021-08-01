const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const app = express();
const path = require("path");
const homeRout = require("./routes/home");
const housesRout = require("./routes/houses");
const addRout = require("./routes/add");
const cardRout = require("./routes/card");
const ordersRout = require("./routes/orders");
const routAuth = require("./routes/auth");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const keys = require("./keys");

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

const store = new MongoStore({
  collection: "session",
  uri: keys.MONGODB_URI,
});
  
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRout);
app.use("/house", addRout);
app.use("/houses", housesRout);
app.use("/card", cardRout);
app.use("/orders", ordersRout);
app.use("/auth", routAuth);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Express working on ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
