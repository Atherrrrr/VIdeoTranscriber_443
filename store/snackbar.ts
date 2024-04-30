import React from "react";
import { atom, useAtom } from "jotai";

export const snackbarAtom = atom<boolean>(false);

type SnackbarSeverity = "error" | "warning" | "info" | "success";

export const snackbarSeverity = atom<SnackbarSeverity>("info");

export const snackbarMessage = atom<string>("");

// snackbar show hook
export const useSnackbar = () => {
  const [, setSnackbar] = useAtom(snackbarAtom);
  const [, setSeverity] = useAtom(snackbarSeverity);
  const [, setMessage] = useAtom(snackbarMessage);
  const showSnackbar = React.useCallback(
    (severity: SnackbarSeverity, message: string) => {
      setSnackbar(true);
      setSeverity(severity);
      setMessage(message);
    },
    [setSnackbar, setSeverity, setMessage]
  );
  return showSnackbar;
};
