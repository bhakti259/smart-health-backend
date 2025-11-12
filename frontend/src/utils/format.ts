// src/utils/format.ts
import dayjs from "dayjs";

export const formatDateShort = (iso?: string) =>
  iso ? dayjs(iso).format("YYYY-MM-DD HH:mm") : "";
