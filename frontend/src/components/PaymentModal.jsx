import { useState } from "react";
import { CreditCardIcon, Coins, WalletIcon, XIcon } from "lucide-react";

const METHODS = [
  {
    id: "polar",
    label: "Pay online",
    description: "Card, wallet, or bank transfer via Polar",
    icon: CreditCardIcon,
  },
  {
    id: "esewa",
    label: "eSewa",
    description: "Pay instantly with your eSewa balance",
    icon: WalletIcon,
  },
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order arrives",
    icon: Coins,
  },
];

function PaymentModal({
  open,
  onClose,
  onConfirm,
  loading,
  shippingAddress,
  setShippingAddress,
}) {
  const [method, setMethod] = useState("polar");

  if (!open) return null;

  const requiresAddress = true;
  const addressComplete =
    shippingAddress.name &&
    shippingAddress.phone &&
    shippingAddress.address &&
    shippingAddress.city &&
    shippingAddress.postalCode;

  const canConfirm = requiresAddress ? Boolean(addressComplete) : true;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3"
          aria-label="Close"
        >
          <XIcon className="size-4" aria-hidden />
        </button>

        <h3 className="text-lg font-bold text-base-content">
          Choose payment method
        </h3>

        <div className="mt-4 space-y-2">
          {METHODS.map(({ id, label, description, icon: Icon }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-start gap-3 rounded-box border p-3 transition-colors ${
                method === id
                  ? "border-primary bg-primary/5"
                  : "border-base-300 hover:border-base-content/30"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                className="radio radio-primary radio-sm mt-0.5"
                checked={method === id}
                onChange={() => setMethod(id)}
              />
              <Icon
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="font-medium text-base-content">{label}</p>
                <p className="text-sm text-base-content/60">{description}</p>
              </div>
            </label>
          ))}
        </div>

        {requiresAddress ? (
          <div className="mt-4 space-y-3 rounded-box border border-base-300 bg-base-200/50 p-4">
            <p className="text-sm font-semibold text-base-content">
              Shipping details
            </p>
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Full name"
              value={shippingAddress.name}
              onChange={(e) =>
                setShippingAddress((c) => ({ ...c, name: e.target.value }))
              }
            />
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Phone number"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress((c) => ({ ...c, phone: e.target.value }))
              }
            />
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Address"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress((c) => ({ ...c, address: e.target.value }))
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input input-bordered input-sm w-full"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress((c) => ({ ...c, city: e.target.value }))
                }
              />
              <input
                className="input input-bordered input-sm w-full"
                placeholder="Postal code"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress((c) => ({
                    ...c,
                    postalCode: e.target.value,
                  }))
                }
              />
            </div>
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Region"
              value={shippingAddress.region}
              onChange={(e) =>
                setShippingAddress((c) => ({ ...c, region: e.target.value }))
              }
            />
            <input
              className="input input-bordered input-sm w-full"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress((c) => ({ ...c, country: e.target.value }))
              }
            />
            <textarea
              className="textarea textarea-bordered textarea-sm w-full"
              placeholder="Delivery notes"
              value={shippingAddress.notes}
              onChange={(e) =>
                setShippingAddress((c) => ({ ...c, notes: e.target.value }))
              }
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onConfirm(method)}
          disabled={loading || !canConfirm}
          aria-busy={loading}
          className="btn btn-primary mt-6 w-full gap-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" aria-hidden />
          ) : null}
          {loading
            ? "Processing…"
            : `Continue with ${METHODS.find((m) => m.id === method)?.label}`}
        </button>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Close"
      />
    </div>
  );
}

export default PaymentModal;
