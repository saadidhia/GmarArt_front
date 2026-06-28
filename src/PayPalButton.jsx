import React, { useEffect, useRef, useState } from 'react';
import { instance } from './api/axiosInstance';

let scriptPromise = null;

const loadPaypalScript = (clientId, currency) => {
  if (window.paypal) return Promise.resolve(window.paypal);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}&intent=capture`;
    script.onload = () => resolve(window.paypal);
    script.onerror = () => reject(new Error('Failed to load PayPal. Please try again.'));
    document.body.appendChild(script);
  });
  return scriptPromise;
};

/**
 * Renders the PayPal Smart Buttons. The order amount/items are only ever decided by the
 * backend (createOrder/capture-order) so the client can't tamper with the price being charged.
 */
const PayPalButton = ({ buildOrderPayload, onSuccess, onError }) => {
  const containerRef = useRef(null);
  const payloadRef = useRef(buildOrderPayload);
  const successRef = useRef(onSuccess);
  const errorRef = useRef(onError);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    payloadRef.current = buildOrderPayload;
    successRef.current = onSuccess;
    errorRef.current = onError;
  }, [buildOrderPayload, onSuccess, onError]);

  useEffect(() => {
    let cancelled = false;
    instance
      .get('/api/payments/paypal/client-id')
      .then(({ data }) => loadPaypalScript(data.clientId, data.currency || 'EUR'))
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.response?.data?.error || err.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !window.paypal || !containerRef.current) return;

    const buttons = window.paypal.Buttons({
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      createOrder: async () => {
        try {
          const payload = payloadRef.current();
          const { data } = await instance.post('/api/payments/paypal/create-order', payload);
          return data.paypalOrderId;
        } catch (err) {
          errorRef.current(err.response?.data?.error || err.message);
          throw err;
        }
      },
      onApprove: async (data) => {
        try {
          const { data: order } = await instance.post(`/api/payments/paypal/capture-order/${data.orderID}`);
          successRef.current(order);
        } catch (err) {
          errorRef.current(err.response?.data?.error || err.message);
        }
      },
      onCancel: () => errorRef.current('Payment was cancelled.'),
      onError: () => errorRef.current('PayPal payment failed. Please try again.'),
    });

    buttons.render(containerRef.current);
    return () => buttons.close?.();
  }, [ready]);

  if (loadError) {
    return <div className="cart-error">{loadError}</div>;
  }

  return (
    <div className="paypal-button-wrapper">
      {!ready && <p className="paypal-loading">Loading PayPal...</p>}
      <div ref={containerRef} />
    </div>
  );
};

export default PayPalButton;
