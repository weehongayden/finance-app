export const fetchAll = async <T>(url: string): Promise<T[]> => {
  try {
    const resp = await fetch(url);

    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    const { data } = await resp.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};

export const create = async <T, K>(url: string, body: T): Promise<K> => {
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    const { data } = await resp.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};

export const update = async <T, K>(url: string, body: T): Promise<K> => {
  try {
    const resp = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    const { data } = await resp.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};

export const remove = async <T, K>(url: string): Promise<K> => {
  try {
    const resp = await fetch(url, {
      method: "DELETE",
    });

    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    const { data } = await resp.json();
    return data;
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    throw error;
  }
};
