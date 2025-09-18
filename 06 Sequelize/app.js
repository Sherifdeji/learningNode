const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user; // nb: the user we retrieve here is not just a js object but a sequelize object added with other utility methods added by sequelize
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User); // this is not really needed as the User.hasOne(cart) already implies this, so a one directional relationship is enough
// Cart.hasMany(CartItem);
Cart.belongsToMany(Product, { through: CartItem }); // this will create a new table in the database called cartItems with cartId and productId as foreign keys
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return user;
  })
  .then((user) => {
    // This is the critical part:
    // Check if the user has a cart. If not, create one.
    return user.getCart().then((cart) => {
      if (!cart) {
        return user.createCart();
      }
      return cart; // If cart exists, just return it.
    });
  })
  .then((cart) => {
    // Now that we are sure a cart exists, start the server.
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
