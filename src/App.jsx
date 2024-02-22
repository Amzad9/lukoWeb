import { useEffect, useState, Suspense, lazy } from "react";
import {
  BrowserRouter,
  Routes, Route
} from "react-router-dom";
import Home from "./views/Home";
const SubCategory = lazy(() => import("./views/Subcategory"))
const Category = lazy(() => import("./views/Category"))
const Dashboard = lazy(() => import("./views/Dashboard"))
const Product = lazy(() => import("./views/Products"))
function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div className="skeleton w-fill h-screen"></div>}>
          <Routes>
            <Route path="/" element={<Home />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="category" element={<Category />} />
              <Route path="subcategory" element={<SubCategory />} />
              <Route path="product" element={<Product />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>

  );
}

export default App;