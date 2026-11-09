"use client";

import React from "react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export function PayPalProvider({ children }: { children: React.ReactNode }) {
  const clientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID &&
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID !== "your_paypal_sandbox_client_id_here"
      ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
      : "test";

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
        components: "buttons",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}

