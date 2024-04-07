import authHeader from "./authTokenHeader";
import { useSnackbar } from "@/store/snackbar";

const _handleError = async (response: any) => {
  const snackbar = useSnackbar();
  if (!response.ok) {
    // 401 : UNAUTHORIZED
    if (response.status === 401) {
      console.log("Implement LOG OUT");
      //   await getKeycloakInstance().logout()
    } else if (response.status === 408) {
      // 408 : TIMEOUT
      snackbar("error", "Error 408: Connection timeout");
      throw new Error("Connection timeout");
    }
    // OTHER CODES: Convert response to json and check if it has meta field
    let errorData;
    try {
      errorData = await response.json();
    } catch {}

    if (errorData?.meta) {
      snackbar("error", `${errorData.meta?.code}:${errorData.meta?.message}`);
      throw new Error(errorData.meta?.message);
    }
    // GENERAL ERROR
    snackbar("error", "Something went wrong!");
    throw new Error("Something went wrong!");
  }
};

async function _post(url: any, data: any) {
  return await fetch(url, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
}

async function _put(url: any, data: any) {
  return await fetch(url, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(data),
  });
}

async function _get(url: any) {
  return await fetch(url, {
    headers: authHeader(),
  });
}

async function _delete(url: any) {
  return await fetch(url, {
    method: "DELETE",
    headers: authHeader(),
  });
}

export async function postFetcher(url: any, data: any, isRaw = false) {
  const res = await _post(url, data);
  await _handleError(res);
  return isRaw ? res : res.json();
}

export async function putFetcher(url: any, data: any) {
  const res = await _put(url, data);
  await _handleError(res);
  return res.json();
}

export async function getFetcher(url: any, isRaw: boolean = false) {
  const res = await _get(url);
  await _handleError(res);
  return isRaw ? res : res.json();
}

export async function deleteFetcher(url: any, isRaw = true) {
  const res = await _delete(url);
  await _handleError(res);
  return isRaw ? res : res.json();
}
