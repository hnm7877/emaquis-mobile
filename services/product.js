import { axiosInstance } from "../utils/axiosInstance";

export async function fetchProductsGlobal(page = 1, size = 10) {
  const res = await axiosInstance.get(
    `/produitglobal?page=${page}&size=${size}`
  );
  return res.data; // { data, meta }
}

export async function fetchProducts(page = 1, size = 10000) {
  const res = await axiosInstance.get(`/produit?page=${page}&size=${size}`);
  return res.data.data;
}

export async function fetchProductsByCategory(
  categoryId,
  page = 1,
  size = 10000
) {
  const res = await axiosInstance.get(
    `/produit?category=${categoryId}&page=${page}&size=${size}`
  );
  return res.data.data;
}

export async function fetchProductHistory(productId, page = 1, size = 10) {
  if (!productId || productId.trim() === "")
    throw new Error("Product ID is required");
  const res = await axiosInstance.get(
    `/produit/${productId}/history?page=${page}&size=${size}`
  );
  return res.data;
}

export async function createProduct(data) {
  if (
    !data.session ||
    typeof data.session !== "string" ||
    data.session.length !== 24
  ) {
    throw new Error(
      "Le champ session est requis et doit être un ObjectId valide (24 caractères)."
    );
  }
  const res = await axiosInstance.post("/produit", data);
  return res;
}

export async function updateProduct(productId, data) {
  const res = await axiosInstance.put(`/produit/${productId}`, data);
  return res;
}

export async function deleteProduct(productId) {
  const res = await axiosInstance.delete(`/produit/${productId}`);
  return res;
}

// PRODUIT GLOBAL
export async function createProductGlobal(data) {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("categorie", data.categorie);
  formData.append("country", data.country);
  formData.append("brand", data.brand);
  if (data.wineType) formData.append("wineType", data.wineType);
  formData.append("hasFormula", data.hasFormula ? "true" : "false");
  if (data.image) formData.append("image", data.image);
  const res = await axiosInstance.post("/produitglobal", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateProductGlobal(productId, data) {
  const formData = new FormData();
  formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  formData.append("categorie", data.categorie);
  formData.append("country", data.country);
  formData.append("brand", data.brand);
  if (data.wineType) formData.append("wineType", data.wineType);
  formData.append("hasFormula", data.hasFormula ? "true" : "false");
  if (data.image) formData.append("image", data.image);
  const res = await axiosInstance.put(`/produitglobal/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteProductGlobal(productId) {
  const res = await axiosInstance.delete(`/produitglobal/${productId}`);
  return res.data;
}
