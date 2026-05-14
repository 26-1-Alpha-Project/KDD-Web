export const DOCUMENT_CATEGORIES = [
  { id: 1, name: "SW 학사공지" },
  { id: 2, name: "SW 취업공지" },
  { id: 3, name: "SW 장학공지" },
  { id: 4, name: "SW 특강 및 행사" },
  { id: 5, name: "SW 졸업요건" },
  { id: 6, name: "국민대학교 공지" },
] as const;

export type DocumentCategoryName =
  (typeof DOCUMENT_CATEGORIES)[number]["name"];
