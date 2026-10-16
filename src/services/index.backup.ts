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
      }
    );
    const result: ApiResponse<T> = await response.json();
    return result;
  } catch (e) {
    console.log(e);
    return NETWORK_ERROR;
  }
}
