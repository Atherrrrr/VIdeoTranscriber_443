import { atom } from 'jotai';
import { PaletteMode } from '@mui/material';

// Function to get the theme mode from localStorage
function getInitialThemeMode(): PaletteMode {
    // Default theme mode
    let savedMode: string | null = 'light';

    if (typeof window !== 'undefined') {
        // Retrieve the mode from localStorage, if available
        const localStorageMode = localStorage.getItem('themeMode');
        console.log("localStorage = ", localStorageMode);

        // If a valid mode is retrieved, use it; otherwise, stick with the default
        savedMode = (localStorageMode === 'light' || localStorageMode === 'dark') ? localStorageMode : 'light';
    } else {
        console.log("window is not defined");
    }

    return savedMode as PaletteMode;
}

// Define the atom with the initial value read from localStorage
export const themeModeAtom = atom<PaletteMode>(getInitialThemeMode());
