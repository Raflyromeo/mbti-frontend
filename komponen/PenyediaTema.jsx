"use client";

import { createContext, useContext, useEffect, useState } from "react";

const KonteksTema = createContext({
  tema: "light",
  setTema: () => null,
});

export function PenyediaTema({ children }) {
  const [tema, setTema] = useState("light");
  const [terpasang, setTerpasang] = useState(false);

  useEffect(() => {
    const temaTersimpan = localStorage.getItem("tema");
    const preferGelap = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const temaAwal = temaTersimpan || (preferGelap ? "dark" : "light");

    setTema(temaAwal);
    if (temaAwal === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setTerpasang(true);
  }, []);

  const ubahTema = (temaBaru) => {
    setTema(temaBaru);
    localStorage.setItem("tema", temaBaru);
    if (temaBaru === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!terpasang) return <>{children}</>;

  return (
    <KonteksTema.Provider value={{ tema, setTema: ubahTema }}>
      {children}
    </KonteksTema.Provider>
  );
}

export const gunakanTema = () => useContext(KonteksTema);
