export const getMyOrders = async (accessToken) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/orders`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Не удалось загрузить историю заказов");
  }

  const data = await response.json();

  return data.orders;
};