import { useEffect, useState } from "react";
import { AlertTriangleIcon, XIcon } from "lucide-react";

function CancelOrderModal({
  open,
  onClose,
  onConfirm,
  loading,
  paid,
  esewaNumber = "",
}) {
  const [refundNumber, setRefundNumber] = useState(esewaNumber);

  useEffect(() => {
    if (open) {
      setRefundNumber(esewaNumber);
    }
  }, [open, esewaNumber]);

  if (!open) return null;

  const isValidEsewaNumber = /^\d{10}$/.test(refundNumber);

  async function handleConfirm() {
    await onConfirm(paid ? refundNumber : undefined);
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box relative max-w-md">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="btn btn-ghost btn-sm btn-circle absolute right-3 top-3"
          aria-label="Close"
        >
          <XIcon className="size-4" aria-hidden />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 pr-8">
          <div className="rounded-full bg-error/10 p-2 text-error">
            <AlertTriangleIcon className="size-5" aria-hidden />
          </div>

          <div>
            <h3 className="text-lg font-bold text-base-content">
              Cancel order?
            </h3>

            <p className="mt-1 text-sm leading-6 text-base-content/65">
              Are you sure you want to cancel this order?
            </p>
          </div>
        </div>

        {/* Paid order */}
        {paid ? (
          <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4">
            <p className="font-semibold text-base-content">Refund required</p>

            <p className="mt-1 text-sm leading-6 text-base-content/70">
              This order has already been paid. Your refund will be processed
              manually through eSewa.
            </p>

            <div className="mt-4">
              <label htmlFor="refund-esewa-number" className="label px-0">
                <span className="label-text font-medium">
                  eSewa refund number
                </span>
              </label>

              <input
                id="refund-esewa-number"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="98XXXXXXXX"
                value={refundNumber}
                disabled={loading}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);

                  setRefundNumber(value);
                }}
                className="input input-bordered w-full"
              />

              <p className="mt-1.5 text-xs text-base-content/50">
                Your refund will be sent to this eSewa account.
              </p>

              {refundNumber && !isValidEsewaNumber ? (
                <p className="mt-1 text-xs text-error">
                  Enter a valid 10-digit eSewa number.
                </p>
              ) : null}
            </div>
          </div>
        ) : (
          /* COD order */
          <div className="mt-5 rounded-xl border border-base-300 bg-base-200/50 p-4">
            <p className="text-sm leading-6 text-base-content/70">
              This is a Cash on Delivery order. No payment has been made, so no
              refund is required.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={loading}
            onClick={onClose}
          >
            Keep order
          </button>

          <button
            type="button"
            className="btn btn-error"
            disabled={loading || (paid && !isValidEsewaNumber)}
            onClick={handleConfirm}
          >
            {loading ? (
              <span
                className="loading loading-spinner loading-sm"
                aria-hidden
              />
            ) : null}

            {paid ? "Cancel & Request Refund" : "Cancel Order"}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        disabled={loading}
        aria-label="Close"
      />
    </div>
  );
}

export default CancelOrderModal;
