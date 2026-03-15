import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/client";
import Router from "./router";
import Layout from "./teleport/Layout";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout />
      </Router>
    </ApolloProvider>
  );
}
