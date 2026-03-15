// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Gallery from "./pages/Gallery.jsx";
import Collection from "./pages/Collection.jsx";
import CollectionExchange from "./pages/CollectionExchange.jsx";
import Vaults from "./pages/Vaults.jsx";
import Whitepaper from "./pages/Whitepaper.jsx";
import BlogazineRedirect from "./pages/BlogazineRedirect.jsx";
// REMOVE this line:
// import NotFound from "./NotFound.tsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/gallery" element={<Gallery />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/exchange" element={<CollectionExchange />} />
        <Route path="/vaults" element={<Vaults />} />

        <Route path="/whitepaper" element={<Whitepaper />} />
        <Route path="/blogazine" element={<BlogazineRedirect />} />

        {/* TEMP: no NotFound route until file exists */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}
