"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "utils-visit-counted";

export function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const alreadyCounted = window.localStorage.getItem(STORAGE_KEY) === "1";

    fetch("/api/visits", {
      method: alreadyCounted ? "GET" : "POST",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    })
      .then((response) => response.json())
      .then((data: { count?: number }) => {
        if (typeof data.count === "number") {
          setCount(data.count);
          if (!alreadyCounted) {
            window.localStorage.setItem(STORAGE_KEY, "1");
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <p id="visit-count" className="visit-count" hidden aria-hidden="true">
      {count ?? ""}
    </p>
  );
}
