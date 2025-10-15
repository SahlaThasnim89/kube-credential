import axios from "axios";

export const issueApi = axios.create({
    baseURL: import.meta.env.VITE_ISSUE_API_BASE,
    headers: { "Content-Type": "application/json" },
  });
  
  export const verifyApi = axios.create({
    baseURL: import.meta.env.VITE_VERIFY_API_BASE,
    headers: { "Content-Type": "application/json" },
  });

const attachInterceptors = (instance: typeof issueApi) => {
  instance.interceptors.request.use(
    (config) => {
      console.log(`[Axios] → ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("[Axios Error]", error.response?.data || error.message);
      return Promise.reject(error);
    }
  );
};

attachInterceptors(issueApi);
attachInterceptors(verifyApi);
