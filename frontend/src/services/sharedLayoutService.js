import api from '../utils/api';

export const shareLayout = async ({ layoutId, sharedWithUserId, permission, expirationDate, message }) => {
  const response = await api.post('/shared-layouts/share', {
    layoutId,
    sharedWithUserId,
    permission,
    expirationDate,
    message
  });
  return response.data;
};

export const getSharedLayouts = async () => {
  const response = await api.get('/shared-layouts');
  return response.data;
};

export const removeSharedUser = async (sharedLayoutId) => {
  const response = await api.delete(`/shared-layouts/${sharedLayoutId}`);
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search?q=${query}`);
  return response.data;
};
