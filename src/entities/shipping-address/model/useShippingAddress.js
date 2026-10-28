
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "";
const API_URL = "http://localhost:8080";

const useShippingAddress = (isAuthenticated, isLoading) => {
  const { getAccessTokenSilently } = useAuth0();

  const [shippingAddress, setShippingAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressSaving, setAddressSaving] = useState(false);

  const [addressDraft, setAddressDraft] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    if (isLoading) return;

 if (!isAuthenticated) {
  setShippingAddress(null);
  setAddressDraft({
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    latitude: null,
    longitude: null,
  });
  setAddressError("");
  setIsEditingAddress(false);
  setAddressSaving(false);
  setAddressLoading(false);
  return;
}

    let cancelled = false;

    const fetchShippingAddress = async () => {
      setAddressLoading(true);
      setAddressError("");

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: "https://stylebox-api",
          },
        });

        const response = await fetch(
          `${API_URL}/api/me/shipping-address`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load shipping address.");
        }

        const data = await response.json();

        if (!cancelled) {
          const savedAddress = data?.address ?? null;

          setShippingAddress(savedAddress);

          if (savedAddress) {
            setAddressDraft({
              phone: savedAddress.phone || "",
              address: savedAddress.address || "",
              city: savedAddress.city || "",
              state: savedAddress.state || "",
              postalCode: savedAddress.postalCode || "",
              country: savedAddress.country || "United States",
              latitude: Number.isFinite(savedAddress.latitude)
                ? savedAddress.latitude
                : null,
              longitude: Number.isFinite(savedAddress.longitude)
                ? savedAddress.longitude
                : null,
            });
          }
        }
      } catch (error) {
        console.error("Shipping address loading error:", error);

        if (!cancelled) {
          setAddressError(
            "Unable to load your shipping address."
          );
        }
      } finally {
        if (!cancelled) {
          setAddressLoading(false);
        }
      }
    };

    fetchShippingAddress();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, getAccessTokenSilently]);

  const handleEditAddress = () => {
    setAddressDraft({
      phone: shippingAddress?.phone || "",
      address: shippingAddress?.address || "",
      city: shippingAddress?.city || "",
      state: shippingAddress?.state || "",
      postalCode: shippingAddress?.postalCode || "",
      country: shippingAddress?.country || "United States",
      latitude: Number.isFinite(shippingAddress?.latitude)
        ? shippingAddress.latitude
        : null,
      longitude: Number.isFinite(shippingAddress?.longitude)
        ? shippingAddress.longitude
        : null,
    });

    setAddressError("");
    setIsEditingAddress(true);
  };

  const handleAddressFieldChange = (event) => {
    const { name, value } = event.target;

    setAddressDraft((previous) => ({
      ...previous,
      [name]: value,
    }));

    setAddressError("");
  };

  const handleAddressRetrieve = (response) => {
    const feature = response?.features?.[0];
    const properties = feature?.properties;
    const coordinates = feature?.geometry?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      !Number.isFinite(coordinates[0]) ||
      !Number.isFinite(coordinates[1])
    ) {
      setAddressDraft((previous) => ({
        ...previous,
        latitude: null,
        longitude: null,
      }));

      setAddressError(
        "Please select a valid address from the Mapbox suggestions."
      );
      return;
    }

    const context = properties?.context ?? {};

    const getContextName = (prefix) => {
      const entry = Object.entries(context).find(([key]) =>
        key.startsWith(prefix)
      );

      return entry?.[1]?.name ?? "";
    };

    const streetAddress = [
      properties?.address,
      properties?.name,
    ]
      .filter(Boolean)
      .join(" ");

    setAddressDraft((previous) => ({
      ...previous,
      address:
        streetAddress ||
        properties?.full_address ||
        previous.address,
      city:
        getContextName("place") ||
        getContextName("locality") ||
        previous.city,
      state: getContextName("region") || previous.state,
      postalCode:
        getContextName("postcode") || previous.postalCode,
      country: "United States",
      longitude: coordinates[0],
      latitude: coordinates[1],
    }));

    setAddressError("");
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();
    setAddressError("");

    if (!MAPBOX_TOKEN) {
      setAddressError(
        "Address search is not configured. Check VITE_MAPBOX_TOKEN."
      );
      return;
    }

    if (
      !addressDraft.address.trim() ||
      !addressDraft.city.trim() ||
      !addressDraft.state.trim() ||
      !addressDraft.postalCode.trim()
    ) {
      setAddressError("Please complete all address fields.");
      return;
    }

    if (
      !Number.isFinite(addressDraft.latitude) ||
      !Number.isFinite(addressDraft.longitude)
    ) {
      setAddressError(
        "Please select your address from the Mapbox suggestions before saving."
      );
      return;
    }

    setAddressSaving(true);

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://stylebox-api",
        },
      });

      const payload = {
        ...addressDraft,
        country: "United States",
      };

      const response = await fetch(
        `${API_URL}/api/me/shipping-address`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            "Failed to save shipping address."
        );
      }

      const savedAddress = {
        ...payload,
        ...(data.address ?? {}),
      };

      setShippingAddress(savedAddress);
      setAddressDraft(savedAddress);
      setIsEditingAddress(false);
    } catch (error) {
      console.error("Saving shipping address failed:", error);

      setAddressError(
        error.message || "Unable to save shipping address."
      );
    } finally {
      setAddressSaving(false);
    }
  };

  return {
    shippingAddress,
    addressLoading,
    addressError,
    isEditingAddress,
    addressSaving,
    addressDraft,
    mapboxToken: MAPBOX_TOKEN,
    setIsEditingAddress,
    setAddressError,
    handleEditAddress,
    handleAddressFieldChange,
    handleAddressRetrieve,
    handleSaveAddress,
  };
};

export default useShippingAddress;
