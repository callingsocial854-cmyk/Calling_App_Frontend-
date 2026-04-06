import axios from "axios";
import db from "../app/db";
const baseURL = import.meta.env.VITE_BASE_URL;
const token = localStorage.getItem("token");

export const getQueryById = async (id) => {
  const res = await axios.get(`${baseURL}getQueryById`, {
    params: { id: id },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAgentsForUserQuery = async (queryId, type, search = "") => {
  const res = await axios.get(`${baseURL}getAgentsForUserQuery`, {
    params: {
      queryId,
      type,
      ...(search && { search }),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const fetchAllQueries = async (search) => {
  if (navigator.onLine) {
    const res = await axios.get(`${baseURL}getQueries`, {
      params: search,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    await db.queries.clear();
    await db.queries.bulkPut(res.data?.data?.queries || []);
    return res.data;
  } else {
    console.log("Offline → loading queries from Dexie");
    const cachedQueries = await db.queries.toArray();
    return cachedQueries;
  }
};

export const createQuery = async (queryData) => {
  const res = await axios.post(`${baseURL}createQuery`, queryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const addCommentToQuery = async (commentData) => {
  const res = await axios.post(`${baseURL}addCommentInQuery`, commentData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateQueryStatus = async (statusData) => {
  const res = await axios.post(`${baseURL}updateQueryStatus`, statusData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  return res.data;
};

export const toggleFavoriteStatus = async (favoriteData) => {
  const res = await axios.post(
    `${baseURL}addOrRemoveFavoriteAgent`,
    favoriteData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const addOrUpdateReview = async (reviewData) => {
  const res = await axios.post(`${baseURL}addOrUpdateReview`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAgentById = async (id) => {
  const res = await axios.get(`${baseURL}getAgentById?agentId=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getMessagesByRoomId = async (
  roomId,
  queryId,
  searchQuery = "",
) => {
  const res = await axios.get(`${baseURL}getMessagesByRoomId`, {
    params: { roomId, queryId, search: searchQuery },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const toggleCallStatus = async (agentId, roomId, queryId) => {
  const res = await axios.post(
    `${baseURL}toggleCallStatus`,
    { agentId, roomId, queryId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const clearMessages = async (roomId) => {
  const res = await axios.post(
    `${baseURL}clearChatInUser`,
    { roomId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const blockedAgent = async (agentId, roomId) => {
  const res = await axios.post(
    `${baseURL}blockedAgent`,
    { agentId, roomId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const addSupport = async (supportData) => {
  const res = await axios.post(`${baseURL}addSupportMessage`, supportData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAgentByIdInWeb = async (agentId, queryId) => {
  const res = await axios.get(
    `${baseURL}getAgentByIdInWeb?agentId=${agentId}&queryId=${queryId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const sendMessageApi = async ({
  roomId,
  message,
  replyTo,
  files = [],
}) => {
  const formData = new FormData();

  formData.append("roomId", roomId);
  formData.append("senderType", "user");
  formData.append("message", message || "");
  formData.append("replyTo", replyTo || "");

  files.forEach((file) => {
    formData.append("mediaFiles", file);
  });

  console.log([...formData.entries()]);

  const res = await axios.post(`${baseURL}sendMessageApi`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getUserMediaControls = async (queryId) => {
  const res = await axios.get(`${baseURL}getUserMediaControls`, {
    params: { queryId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
