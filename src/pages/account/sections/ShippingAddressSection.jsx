import { AddressAutofill } from "@mapbox/search-js-react";
import "./ShippingAddressSection.css";

const ShippingAddressSection = ({
  addressLoading,
  addressError,
  isEditingAddress,
  shippingAddress,
  addressSaving,
  addressDraft,
  mapboxToken,
  onToggleEditAddress,
  onAddressFieldChange,
  onAddressRetrieve,
  onSuggestError,
  onSaveAddress,
}) => {
  return (
    <section className="account-shipping-address">
      <div className="account-section-heading">
        <div>
          <p className="account-eyebrow">DELIVERY DETAILS</p>
          <h2>Shipping Address</h2>
        </div>

        {!addressLoading && !addressError && (
          <button
            type="button"
            className="account-secondary-button"
            onClick={onToggleEditAddress}
          >
            {isEditingAddress ? "Cancel" : "Edit Address"}
          </button>
        )}
      </div>

      {addressLoading ? (
        <p className="account-orders-message">
          Loading shipping address...
        </p>
      ) : addressError ? (
        <div className="account-orders-message">
          <p>{addressError}</p>
        </div>
      ) : isEditingAddress ? (
        <form
          className="account-address-form"
          onSubmit={onSaveAddress}
        >
          <label htmlFor="account-shipping-phone">
            Phone
            <input
              id="account-shipping-phone"
              type="tel"
              name="phone"
              value={addressDraft.phone}
              onChange={onAddressFieldChange}
              autoComplete="tel"
              required
            />
          </label>

          <AddressAutofill
            accessToken={mapboxToken}
            options={{
              country: "us",
              language: "en",
              limit: 8,
              streets: true,
            }}
            browserAutofillEnabled={false}
            onRetrieve={onAddressRetrieve}
            onSuggestError={onSuggestError}
          >
            <label htmlFor="account-shipping-address">
              Street Address
              <input
                id="account-shipping-address"
                type="text"
                name="address"
                value={addressDraft.address}
                onChange={onAddressFieldChange}
                autoComplete="address-line1"
                placeholder="Start typing your US address"
                required
              />
            </label>

            <label htmlFor="account-shipping-city">
              City
              <input
                id="account-shipping-city"
                type="text"
                name="city"
                value={addressDraft.city}
                onChange={onAddressFieldChange}
                autoComplete="address-level2"
                required
              />
            </label>

            <label htmlFor="account-shipping-state">
              State
              <input
                id="account-shipping-state"
                type="text"
                name="state"
                value={addressDraft.state}
                onChange={onAddressFieldChange}
                autoComplete="address-level1"
                required
              />
            </label>

            <label htmlFor="account-shipping-postal">
              ZIP Code
              <input
                id="account-shipping-postal"
                type="text"
                name="postalCode"
                value={addressDraft.postalCode}
                onChange={onAddressFieldChange}
                autoComplete="postal-code"
                required
              />
            </label>
          </AddressAutofill>

          <label htmlFor="account-shipping-country">
            Country
            <input
              id="account-shipping-country"
              type="text"
              name="country"
              value={addressDraft.country}
              onChange={onAddressFieldChange}
              autoComplete="country-name"
              required
            />
          </label>

          <button
            type="submit"
            className="account-primary-button"
            disabled={addressSaving}
          >
            {addressSaving ? "Saving..." : "Save Address"}
          </button>
        </form>
      ) : shippingAddress ? (
        <div className="account-address-details">
          <p>{shippingAddress.address}</p>
          <p>
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postalCode}
          </p>
          <p>{shippingAddress.country}</p>
          <p>{shippingAddress.phone}</p>
        </div>
      ) : (
        <div className="account-orders-message">
          <p>No shipping address saved yet.</p>
        </div>
      )}
    </section>
  );
};

export default ShippingAddressSection;