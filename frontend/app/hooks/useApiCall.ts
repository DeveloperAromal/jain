/* eslint-disable prefer-const */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useCallback } from "react";
// import axios from "axios";
// import { ApiResponse } from "../types/dashboardTypes";

// export const useAPICall = () => {
//   const [fetching, setIsFetching] = useState(false);
//   const [fetchType, setFetchType] = useState<string>("");
//   const [isFetched, setIsFetched] = useState(false);

//   const makeApiCall = useCallback(
//     async (
//       method: string,
//       endpoint: string,
//       data?: any,
//       dataType?: "application/json" | "application/form-data",
//       token?: string,
//       callType?: string
//     ): Promise<ApiResponse> => {
//       let header = {};
//       if (token) {
//         header = {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": dataType || "application/json",
//           "Cache-Control": "no-cache",
//         };
//       } else {
//         header = {
//           "Content-Type": dataType || "application/json",
//           "Cache-Control": "no-cache",
//         };
//       }

//       let responseData: ApiResponse;
//       setIsFetching(true);
//       setFetchType(callType || "");

//       try {
//         const response = await axios({
//           method: method,
//           data: data,
//           headers: header,
//           url: method.toLowerCase() === "get" ? `${endpoint}` : endpoint,
//         });

//         const responseJson = response.data;
//         responseData = {
//           status: responseJson.status_code,
//           data: responseJson.data,
//           detail: responseJson.detail,
//         };
//       } catch (error) {
//         console.log(error);
//         if (axios.isAxiosError(error) && error.response) {
//           console.error("Error message: ", error.message);
//           responseData = {
//             status: error.response.status,
//             data: undefined,
//             detail: error.response.data.detail,
//           };
//         } else {
//           responseData = {
//             status: 500,
//             data: undefined,
//             detail: "An unexpected error occurred",
//           };
//         }
//       } finally {
//         setIsFetching(false);
//         setFetchType("");
//         setIsFetched(true);
//       }

//       return responseData;
//     },
//     []
//   );

//   return {
//     makeApiCall,
//     fetching,
//     fetchType,
//     isFetched,
//   };
// };
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios from "axios";

export interface ApiResponse<T = any> {
  [x: string]: any;
  status: number;
  data?: T;        // <-- FIXED (safe and optional)
  detail?: string; // <-- FIXED
}

export const useAPICall = () => {
  const [fetching, setIsFetching] = useState(false);
  const [fetchType, setFetchType] = useState<string>("");
  const [isFetched, setIsFetched] = useState(false);

  const makeApiCall = useCallback(
    async <T = any>(
      method: string,
      endpoint: string,
      data?: any,
      dataType?: "application/json" | "application/form-data",
      token?: string,
      callType?: string
    ): Promise<ApiResponse<T>> => {

      let headers: Record<string, string> = {
        "Content-Type": dataType || "application/json",
        "Cache-Control": "no-cache",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      setIsFetching(true);
      setFetchType(callType || "");

      try {
        const response = await axios({
          method,
          url: endpoint,
          data: method.toLowerCase() === "get" ? undefined : data,
          headers,
        });

        return {
          status: response.status,
          data: response.data as T,
          detail: "",
        };
      } catch (error) {
        console.error(error);

        if (axios.isAxiosError(error) && error.response) {
          return {
            status: error.response.status,
            data: undefined,
            detail: error.response.data?.detail || "Error occurred",
          };
        }

        return {
          status: 500,
          data: undefined,
          detail: "An unexpected error occurred",
        };
      } finally {
        setIsFetching(false);
        setFetchType("");
        setIsFetched(true);
      }
    },
    []
  );

  return {
    makeApiCall,
    fetching,
    fetchType,
    isFetched,
  };
};
