import type { IssueForm, IssueResponse } from "../types/issueTypes";
import { issueApi } from "./axiosInstance";

export const issueCredential = async (form: IssueForm): Promise<IssueResponse> => {
  const res = await issueApi.post<IssueResponse>("/issue", form);
  return res.data;
};
