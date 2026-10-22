
import React, { useEffect, useState } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./ShippingAddressForm.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN ?? "";
const API_URL =
  import.meta.env.VITE_API_URL ??
  "https://stylebox-backend.onrender.com";

const EMPTY_ADDRESS = {
  address: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
  latitude: null,
  longitude: null,
   phone: "",
};

export const ShippingAddressForm = ({ onContinue, onBack }) => {
  const {
    getAccessTokenSilently,
    isAuthenticated,
    isLoading,
  } = useAuth0();

  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [addressLoaded, setAddressLoaded] = useState(false);
  const [editing, setEditing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
  let cancelled = false;

  const loadAddress = async () => {
    if (isLoading) return;

    try {
      if (!isAuthenticated) {
        if (!cancelled) {
          setAddress(EMPTY_ADDRESS);
          setEditing(true);
        }
        return;
      }

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://stylebox-api",
        },
      });

      const { data } = await axios.get(
        `${API_URL}/api/me/shipping-address`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 15000,
        }
      );

      if (cancelled) return;

      if (data?.address) {
        setAddress({
          ...EMPTY_ADDRESS,
          ...data.address,
        });
        setEditing(false);
      } else {
        setAddress(EMPTY_ADDRESS);
        setEditing(true);
      }
    } catch (error) {
      console.error(
        "Failed to load shipping address:",
        error.response?.status,
        error.response?.data || error.message
      );

      if (!cancelled) {
        setAddress(EMPTY_ADDRESS);
        setEditing(true);
        setErrorMessage(
          "Could not load your saved address. Please enter it below."
        );
      }
    } finally {
      if (!cancelled) {
        setAddressLoaded(true);
      }
    }
  };

  loadAddress();

  return () => {
    cancelled = true;
  };
}, [getAccessTokenSilently, isAuthenticated, isLoading]);



const handleRetrieve = (response) => {
  console.log("Mapbox retrieve:", response);

  const feature = response?.features?.[0];
  const properties = feature?.properties;
  const coordinates = feature?.geometry?.coordinates;

  if (
    !Array.isArray(coordinates) ||
    !Number.isFinite(coordinates[0]) ||
    !Number.isFinite(coordinates[1])
  ) {
    setAddress((previous) => ({
      ...previous,
      latitude: null,
      longitude: null,
    }));

    setErrorMessage(
      "Please select an address from the Mapbox suggestions."
    );
    return;
  }

  const context = properties?.context ?? {};

  const getContextName = (prefix) => {
    const item = Object.entries(context).find(([key]) =>
      key.startsWith(prefix)
    );
    return item?.[1]?.name ?? "";
  };

  const streetAddress = [
    properties?.address,
    properties?.name,
  ]
    .filter(Boolean)
    .join(" ");

  setAddress((previous) => ({
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

  setErrorMessage("");
};

const handleFieldChange = (field, value) => {
  setAddress((previous) => ({
    ...previous,
    [field]: value,
  }));

  setErrorMessage("");
};

  const handleEdit = () => {
    setEditing(true);
    setErrorMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (!MAPBOX_TOKEN) {
      setErrorMessage(
        "Address search is not configured. Check VITE_MAPBOX_TOKEN."
      );
      return;
    }

    const formData = new FormData(event.currentTarget);

   const currentAddress = {
  address: String(formData.get("address-line1") ?? "").trim(),
  city: String(formData.get("address-level2") ?? "").trim(),
  state: String(formData.get("address-level1") ?? "").trim(),
  postalCode: String(formData.get("postal-code") ?? "").trim(),
  country: "United States",
  latitude: address.latitude,
  longitude: address.longitude,
  phone: String(formData.get("phone") ?? "").trim(),
};

   if (
  !currentAddress.address ||
  !currentAddress.city ||
  !currentAddress.state ||
  !currentAddress.postalCode
) {
  setErrorMessage("Please enter a complete shipping address.");
  return;
}

// ДОБАВЬ ПРОВЕРКУ ТЕЛЕФОНА ЗДЕСЬ
if (!currentAddress.phone) {
  setErrorMessage("Please enter your phone number.");
  return;
}

if (
  !Number.isFinite(currentAddress.latitude) ||
  !Number.isFinite(currentAddress.longitude)
) {
  setErrorMessage(
    "Please select your address from the Mapbox suggestions again."
  );
  return;
}

    if (!isAuthenticated) {
      setErrorMessage("Please sign in to save your shipping address.");
      return;
    }

    setSaving(true);

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "https://stylebox-api",
        },
      });

      const { data } = await axios.put(
        `${API_URL}/api/me/shipping-address`,
        currentAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    
const savedAddress = {
  ...EMPTY_ADDRESS,
  ...(data?.address ?? {}),
  phone: data?.address?.phone || currentAddress.phone,
};


      setAddress(savedAddress);
      setEditing(false);
      onContinue(savedAddress);
    } catch (error) {
      console.error("Failed to save shipping address:", error);

      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to save your address. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !addressLoaded) {
    return (
      <section className="shipping-address">
        <p>Loading your saved address...</p>
      </section>
    );
  }

  return (
    <section className="shipping-address">
      <h2>Shipping address</h2>
      <p>We currently ship within the United States only.</p>

      {!isAuthenticated && (
        <p className="shipping-error" role="alert">
          Please sign in to save your address for future orders.
        </p>
      )}

      {!editing && address.address ? (
        <div className="saved-shipping-address">
          <p><strong>Saved address</strong></p>
          <p>{address.address}</p>
          <p>
            {[address.city, address.state, address.postalCode]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>{address.country}</p>
          {address.phone && <p>Phone: {address.phone}</p>}

          <div className="shipping-actions">
            <button type="button" onClick={handleEdit}>
              Edit
            </button>

          <button
  type="button"
  onClick={() => {
    if (!address.phone?.trim()) {
      setEditing(true);
      setErrorMessage("Please enter your phone number.");
      return;
    }

    onContinue(address);
  }}
>
  Continue
</button>

            {onBack && (
              <button type="button" onClick={onBack}>
                Back to order
              </button>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <AddressAutofill
            accessToken={MAPBOX_TOKEN}
            options={{
              country: "us",
              language: "en",
              limit: 8,
              streets: true,
            }}
            browserAutofillEnabled={false}
            onRetrieve={handleRetrieve}
            onSuggestError={(error) => {
              console.error("Mapbox suggestions error:", error);
              setErrorMessage(
                "Address suggestions failed. Please check the Mapbox token."
              );
            }}
          >
            <label htmlFor="shipping-address">
              Street address
            </label>
            <input
              id="shipping-address"
              name="address-line1"
              value={address.address}
              onChange={(event) =>
                handleFieldChange("address", event.target.value)
              }
              autoComplete="address-line1"
              placeholder="Start typing your US address"
              required
            />

            <label htmlFor="shipping-city">City</label>
            <input
              id="shipping-city"
              name="address-level2"
              value={address.city}
              onChange={(event) =>
                handleFieldChange("city", event.target.value)
              }
              autoComplete="address-level2"
              required
            />

            <label htmlFor="shipping-state">State</label>
            <input
              id="shipping-state"
              name="address-level1"
              value={address.state}
              onChange={(event) =>
                handleFieldChange("state", event.target.value)
              }
              autoComplete="address-level1"
              required
            />

            <label htmlFor="shipping-postal">ZIP code</label>
            <input
              id="shipping-postal"
              name="postal-code"
              value={address.postalCode}
              onChange={(event) =>
                handleFieldChange("postalCode", event.target.value)
              }
              autoComplete="postal-code"
              required
            />
          </AddressAutofill>

          <label htmlFor="shipping-phone">Phone number</label>
<input
  id="shipping-phone"
  name="phone"
  type="tel"
  value={address.phone}
  onChange={(event) =>
    handleFieldChange("phone", event.target.value)
  }
  autoComplete="tel"
  placeholder="e.g. +1 555 123 4567"
  required
/>

          <label htmlFor="shipping-country">Country</label>
          <input
            id="shipping-country"
            name="country"
            value="United States"
            autoComplete="country-name"
            readOnly
          />

          {errorMessage && (
            <p className="shipping-error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="shipping-actions">
            {onBack && (
              <button type="button" onClick={onBack}>
                Back to order
              </button>
            )}

            <button type="submit" disabled={saving}>
              {saving ? "Saving address..." : "Save address and continue"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default ShippingAddressForm;
