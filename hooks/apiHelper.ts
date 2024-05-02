// import authHeader from "./authTokenHeader";
// import { useSnackbar } from "@/store/snackbar";

// interface ErrorResponse {
//   meta?: {
//     code: string;
//     message: string;
//   };
// }

// const _handleError = async (response: Response) => {
//   const snackbar = useSnackbar();
//   if (!response.ok) {
//     if (response.status === 401) {
//       console.log("Implement LOG OUT");
//     } else if (response.status === 408) {
//       snackbar("error", "Error 408: Connection timeout");
//       throw new Error("Connection timeout");
//     }
//     let errorData: ErrorResponse;
//     try {
//       errorData = await response.json();
//     } catch {
//       console.log("Error");
//       errorData = {};
//     }

//     if (errorData.meta) {
//       snackbar("error", `${errorData.meta.code}: ${errorData.meta.message}`);
//       throw new Error(errorData.meta.message);
//     }
//     snackbar("error", "Something went wrong!");
//     throw new Error("Something went wrong!");
//   }
// };

// // Define an interface for the data if possible
// interface PostData {
//   [key: string]: string | number | boolean | object | null; // More specific than any
// }

// async function _post(url: string, data: PostData) {
//   return await fetch(url, {
//     method: "POST",
//     headers: authHeader(),
//     body: JSON.stringify(data),
//   });
// }

// async function _put(url: string, data: PostData) {
//   return await fetch(url, {
//     method: "PUT",
//     headers: authHeader(),
//     body: JSON.stringify(data),
//   });
// }

// async function _get(url: string) {
//   return await fetch(url, {
//     headers: authHeader(),
//   });
// }

// async function _delete(url: string) {
//   return await fetch(url, {
//     method: "DELETE",
//     headers: authHeader(),
//   });
// }

// interface JsonResponse<T> {
//   success: boolean;
//   message: string;
//   data?: T;
// }

// // Using generic types for better flexibility and type safety
// export async function postFetcher<T = JsonResponse>(
//   url: string,
//   data: PostData,
//   isRaw = false
// ): Promise<T | Response> {
//   const res = await _post(url, data);
//   await _handleError(res);
//   return isRaw ? res : ((await res.json()) as T);
// }

// export async function putFetcher<T = JsonResponse>(url: string, data: PostData): Promise<T> {
//   const res = await _put(url, data);
//   await _handleError(res);
//   return (await res.json()) as T;
// }

// export async function getFetcher<T = JsonResponse>(
//   url: string,
//   isRaw = false
// ): Promise<T | Response> {
//   const res = await _get(url);
//   await _handleError(res);
//   return isRaw ? res : ((await res.json()) as T);
// }

// export async function deleteFetcher<T = JsonResponse>(
//   url: string,
//   isRaw = true
// ): Promise<T | Response> {
//   const res = await _delete(url);
//   await _handleError(res);
//   return isRaw ? res : ((await res.json()) as T);
// }
