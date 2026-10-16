import type { ApiResponse, FormValues, LoginFormData, SectionTab } from "@/types";

const NETWORK_ERROR: ApiResponse<never> = {
  success: false,
  message: "Network error. Please check your connection and try again.",
};

//post data
export async function addData<T = unknown>(
  currentTab: SectionTab,
  formData: FormValues | object
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${currentTab}/add`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}

//get data
export async function getData<T = unknown>(
  currentTab: SectionTab
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${currentTab}/get`, {
      method: "GET",
      credentials: "same-origin",
    });
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}
//update data
export async function updateData<T = unknown>(
  currentTab: SectionTab,
  formData: FormValues | object
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${currentTab}/update`, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}
//login data
export async function login(formData: LoginFormData): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/login`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const result: ApiResponse = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}

//delete data
export async function deleteData<T = unknown>(
  currentTab: SectionTab,
  id: string
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(
      `/api/${currentTab}/delete?id=${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        credentials: "same-origin",
      }
    );
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}

//save project display order (ids in the new order)
export async function reorderProjects(ids: string[]): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/project/reorder`, {
      method: "PUT",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    const result: ApiResponse = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}
//current admin session (true when logged in)
export async function getSessionStatus(): Promise<{
  authenticated: boolean;
  configured: boolean;
}> {
  try {
    const response = await fetch(`/api/auth/me`, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });
    const result = await response.json();
    return {
      authenticated: Boolean(result?.authenticated),
      configured: result?.configured !== false,
    };
  } catch (e) {
    console.log(e);
    return { authenticated: false, configured: true };
  }
}

//logout (clears the session cookie on the server)
export async function logout(): Promise<ApiResponse> {
  try {
    const response = await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "same-origin",
    });
    const result: ApiResponse = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}
