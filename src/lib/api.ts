export const authenticatedFetch = async (url: string, options: RequestInit) => {
    const response = await fetch(url, {
        credentials: "include",
        ...options,
    });

    const responseData = await response.json();

    if (!response.ok) {
        // if (response.status === 401) {
        //     window.location.href = '/';
        //     throw new Error('Unauthorized');
        // }

        if (typeof responseData === "string") {
            const error = new Error(responseData || response.statusText);
            (error as any).status = response.status;
            throw error;
        }

        const error = new Error(responseData.message || response.statusText);
        (error as any).response = responseData;
        (error as any).status = response.status;
        throw error;
    }

    return responseData;
};

export async function formApiFetch(url: string, options: RequestInit = {}) {
    const response = await authenticatedFetch(url, options);
    return response;
}

export async function normalApiFetch(url: string, options: RequestInit = {}) {
    const response = await authenticatedFetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Content-Type": "application/json",
        },
    });
    return response;
}
