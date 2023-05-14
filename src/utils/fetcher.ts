export const fetchAll = async <T>(url: string): Promise<T[]> => {
  const resp = await fetch(url);
  const data: T[] = await resp.json();
  return data;
};

export const create = async <T>(url: string, body: T): Promise<T[]> => {
  const resp = await fetch(url, {
    method: "POST",
    body: body as BodyInit,
  });
  const data: T[] = await resp.json();
  return data;
};
