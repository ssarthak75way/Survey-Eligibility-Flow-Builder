import { api } from "../utils/axios";
import type { Survey } from "./types";

export const createSurvey = (data: Partial<Survey>) =>
    api.post("/api/surveys", data);

export const getSurveys = (page: number, limit: number) =>
    api.get(`/api/surveys?page=${page}&limit=${limit}`);
