import axios from "axios";
import db from "../app/db";
const baseURL = import.meta.env.VITE_BASE_URL;
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getQueryById = async (id) => {
  const res = await axios.get(`${baseURL}getQueryById`, {
    params: { id: id },
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  return res.data;
};

export const fetchAllQueries = async (search) => {
  if (navigator.onLine) {
    const res = await axios.get(`${baseURL}getQueries`, {
      params: search,
      headers: getAuthHeaders(),
    });
    await db.queries.clear();
    await db.queries.bulkPut(res.data?.data?.queries || []);
    return res.data;
  } else {
    const cachedQueries = await db.queries.toArray();
    return cachedQueries;
  }
};

export const createQuery = async (queryData) => {
  const res = await axios.post(`${baseURL}createQuery`, queryData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const addCommentToQuery = async (commentData) => {
  const res = await axios.post(`${baseURL}addCommentInQuery`, commentData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateQueryStatus = async (statusData) => {
  const res = await axios.post(`${baseURL}updateQueryStatus`, statusData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const toggleFavoriteStatus = async (favoriteData) => {
  const res = await axios.post(
    `${baseURL}addOrRemoveFavoriteAgent`,
    favoriteData,
    {
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

export const addOrUpdateReview = async (reviewData) => {
  const res = await axios.post(`${baseURL}addOrUpdateReview`, reviewData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getAgentById = async (agentId, profileId) => {
  const res = await axios.get(`${baseURL}getAgentById?agentId=${agentId}&profileId=${profileId}`, {
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const toggleCallStatus = async (agentId, profileId, roomId) => {
  const res = await axios.post(
    `${baseURL}toggleCallStatus`,
    { agentId, profileId, roomId },
    {
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

export const clearMessages = async (roomId) => {
  const res = await axios.post(
    `${baseURL}clearChatInUser`,
    { roomId },
    {
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

export const blockedAgent = async (agentId, profileId, roomId) => {
  const res = await axios.post(
    `${baseURL}blockedAgent`,
    { agentId, profileId, roomId },
    {
      headers: getAuthHeaders(),
    },
  );
  return res.data;
};

export const addSupport = async (supportData) => {
  const res = await axios.post(`${baseURL}addSupportMessage`, supportData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getAgentByIdInWeb = async (agentId, profileId, queryId) => {
  const res = await axios.get(
    `${baseURL}getAgentByIdInWeb?agentId=${agentId}&profileId=${profileId}&queryId=${queryId}`,
    {
      headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  return res.data;
};

export const getUserMediaControls = async (queryId) => {
  const res = await axios.get(`${baseURL}getUserMediaControls`, {
    params: { queryId },
    headers: getAuthHeaders(),
  });
  return res.data;
};
