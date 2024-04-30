import Image from "next/image";
import React, { useState } from "react";

import { CircularProgress, useTheme } from "@mui/material";
import { styled } from "@mui/material";
import { IThemeMode } from "@/theme/types";

const StyledImage = styled(Image)(() => ({
  width: "100%",
  height: "100%",
}));

export function LogoImage() {
  const theme = useTheme();
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <>
      <StyledImage
        alt={"WePrep"}
        src={theme.palette.mode === IThemeMode.LIGHT ? "/app-logo-light.png" : "/app-logo-dark.png"}
        width={0}
        height={0}
        sizes="100vw"
        onLoadingComplete={() => setImgLoaded(true)}
      />
      {!imgLoaded && <CircularProgress size={80} thickness={3} color="secondary" />}
    </>
  );
}
