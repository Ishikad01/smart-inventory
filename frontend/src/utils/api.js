import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

export const getProducts = () => API.get("/products");
export const addProduct = (data) => API.post("/products", data);
export const updateStock = (id, data) => API.put(`/products/inventory/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getOrders = () => API.get("/orders");
export const createOrder = (data) => API.post("/orders", data);
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const getOrdersByStatus = (status) => API.get(`/orders/status/${status}`);

export default API;