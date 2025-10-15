import { verifyApi } from "./axiosInstance";
import type { VerifyRequest,VerifyResponse } from './../types/verifyTypes';


export const verifyCredential = async (
    payload: VerifyRequest
  ): Promise<VerifyResponse> => {
    const res = await verifyApi.post<VerifyResponse>("/verify", payload);
    return res.data;
  };