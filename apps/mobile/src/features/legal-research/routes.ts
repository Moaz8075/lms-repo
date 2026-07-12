import type { Href } from 'expo-router';

export const legalResearchRoutes = {
  hub: '/(protected)/(tabs)/legal-research' as Href,
  index: '/(protected)/(tabs)/legal-research' as Href,
  new: '/(protected)/(tabs)/legal-research/new' as Href,
  scan: '/(protected)/(tabs)/legal-research/scan' as Href,
  note: (noteId: string) =>
    `/(protected)/(tabs)/legal-research/${noteId}` as Href,
  edit: (noteId: string) =>
    `/(protected)/(tabs)/legal-research/${noteId}/edit` as Href,
  print: (noteId: string) =>
    `/(protected)/(tabs)/legal-research/${noteId}/print` as Href,
  library: '/(protected)/(tabs)/legal-research/library' as Href,
  libraryAdd: '/(protected)/(tabs)/legal-research/library/add' as Href,
  libraryItem: (id: string) =>
    `/(protected)/(tabs)/legal-research/library/${id}` as Href,
  libraryReader: (id: string) =>
    `/(protected)/(tabs)/legal-research/library/${id}/reader` as Href,
  attachToCase: (caseId: string) =>
    `/(protected)/(tabs)/cases/${caseId}/attach-reference` as Href,
};

export type NewNoteParams = {
  libraryItemId?: string;
  selectedText?: string;
  pageNumber?: string;
  citation?: string;
  court?: string;
  title?: string;
};

export function newNoteHref(params?: NewNoteParams): Href {
  if (!params || !Object.values(params).some(Boolean)) {
    return legalResearchRoutes.new;
  }

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  return `/(protected)/(tabs)/legal-research/new?${query.toString()}` as Href;
}
