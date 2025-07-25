import { axiosInstance } from "../utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function loginGestionnaire({ username, password, country }) {
  const res = await axiosInstance.post("auth/gestionnaire/auth", {
    username,
    password,
    country,
  });
  const { access_token, ...user } = res.data;
  if (access_token) {
    await AsyncStorage.setItem("token", access_token);
  }
  return { token: access_token, user };
}

export async function selectGestionnaireCompany({
  username,
  password,
  country,
  companyId,
}) {
  const res = await axiosInstance.post("auth/gestionnaire/select-company", {
    username,
    password,
    country,
    companyId,
  });
  return res.data;
}

export async function registerUser(payload) {
  try {
    const res = await axiosInstance.post("/auth/signup", payload);
    return {
      isSuccess: true,
      data: res.data,
    };
  } catch (err) {
    let errorData = {
      message: "Une erreur s'est produite",
      field: "",
      statusCode: 400,
    };
    if (err?.response?.data) {
      errorData = {
        message: err.response.data.message || errorData.message,
        field: err.response.data.field || "",
        statusCode: err.response.data.statusCode || 400,
      };
    }
    return {
      isSuccess: false,
      data: errorData,
    };
  }
}

export async function getProfile(token) {
  const res = await axiosInstance.get("/auth/profile", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}

export async function updateProfile(data, token) {
  const res = await axiosInstance.put("/auth/profile", data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  return res.data;
}
