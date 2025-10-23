import React, { createContext, useContext, useState } from "react";

const MenuDrawerContext = createContext();

export const useMenuDrawer = () => useContext(MenuDrawerContext);

export const MenuDrawerProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const openMenu = () => setOpen(true);
  const closeMenu = () => setOpen(false);

  return (
    <MenuDrawerContext.Provider value={{ open, setOpen, openMenu, closeMenu }}>
      {children}
    </MenuDrawerContext.Provider>
  );
};
