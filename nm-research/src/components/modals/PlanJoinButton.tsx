"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import PayModal from "@/components/modals/PayModal";

export default function PlanJoinButton({
  plan,
  amount,
  label,
}: {
  plan: string;
  amount: number;
  label?: string;
}) {
  const [pay, setPay] = useState(false);
  return (
    <>
      <button
        onClick={() => setPay(true)}
        className="btn btn-accent w-full group"
      >
        {label ?? `Join ${plan}`}
      </button>
      <AnimatePresence>
        {pay && (
          <PayModal
            open={pay}
            planName={plan}
            amount={amount}
            onClose={() => setPay(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
