import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/1722298/facinations/v0.1.5",
  cache: new InMemoryCache(),
});
