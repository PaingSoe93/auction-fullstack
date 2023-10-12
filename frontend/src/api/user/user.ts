import { client } from "../client";

export const deposit = async (token: any, data: any) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const result = await client.post("/transaction/deposit", data, headers);

  return result;
};

export const createItem = async (token: any, data: any) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await client.post("/item", data, headers);
  return result;
};

export const bidCardList = async (token: any, data: string) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await client.get(`/item?status=${data}`, headers);
  return result;
};

export const buyBid = async (token: any, data: any) => {
  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const result = await client.post("/transaction/bid-item", data, headers);
  return result;
};
