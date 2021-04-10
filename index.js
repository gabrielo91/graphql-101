const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");

const app = express();
const PORT = process.env.PORT || 6060;

app.get("/", (req, res) => {
  res.send({ status: "ok" });
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
