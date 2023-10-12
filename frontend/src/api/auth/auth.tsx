import { client } from "../client";

export const getUserData = async (token: any) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await client.get("/user/me", headers);

  return result;
};

export const login = async (data: any) => {
  const result = await client.post("/auth/sign-in", data);

  return result;
};

export const register = async (data: any) => {
  const result = await client.post("/auth/sign-up", data);

  return result;
};
