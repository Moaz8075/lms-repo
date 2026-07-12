import type { Href } from 'expo-router';

export const diaryRoutes = {
  index: '/(protected)/(tabs)/diary' as Href,
  calendar: '/(protected)/(tabs)/diary/calendar' as Href,
  timeline: '/(protected)/(tabs)/diary/timeline' as Href,
  new: '/(protected)/(tabs)/diary/new' as Href,
  wrapUp: '/(protected)/(tabs)/diary/wrap-up' as Href,
  entry: (hearingId: string) =>
    `/(protected)/(tabs)/diary/${hearingId}` as Href,
};
