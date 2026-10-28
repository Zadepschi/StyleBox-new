
import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const API_URL = "http://localhost:8080";

const useMyOrders = (isAuthenticated) => {
  const { getAccessTokenSilently } = useAuth0();

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setOrdersLoading(false);
      setOrdersError("");
      return;
    }

    setOrdersLoading(true);
    setOrdersError("");

    try {
      const accessToken = await getAccessTokenSilently();

      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load orders.");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Orders loading error:", error);
      setOrdersError(
        "Unable to load your order history. Please try again."
      );
    } finally {
      setOrdersLoading(false);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    ordersLoading,
    ordersError,
    refetchOrders: fetchOrders,
  };
};

export default useMyOrders;
