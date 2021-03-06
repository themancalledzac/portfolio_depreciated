const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const path = require("path");

const { typeDefs, resolvers } = require("./schema");
const db = require("./config/connection");

const PORT = process.env.PORT || 3000;
const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}.`);
    console.log(`GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    console.log(
      `GraphQL at https://studio.apollographql.com/sandbox/explorer/`
    );
  });
});
