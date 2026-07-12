import type { Href } from 'expo-router';

export const clientsRoutes = {
  index: '/(protected)/(tabs)/more/clients' as Href,
  new: '/(protected)/(tabs)/more/clients/new' as Href,
  detail: (id: string) => `/(protected)/(tabs)/more/clients/${id}` as Href,
  edit: (id: string) => `/(protected)/(tabs)/more/clients/${id}/edit` as Href,
};
