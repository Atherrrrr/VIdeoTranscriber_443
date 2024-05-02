import React, { useState } from "react";
import Image from "next/image";
import { CircularProgress } from "@mui/material";
import { styled } from "@mui/system"; // Ensure correct import for styled

interface DomainImageStyles {
  background?: string;
  border?: string;
}

export interface DomainImageProps extends DomainImageStyles {
  src: string;
  alt: string;
  progressSize?: number;
  progressThickness?: number;
  circle?: boolean;
}

const StyledImage = styled(Image, {
  shouldForwardProp: (prop) => !["circle", "background", "border"].includes(prop as string),
})<DomainImageProps>(({ circle, background, border }) => ({
  width: "100%",
  height: "100%",
  borderRadius: circle ? "50%" : "none",
  background,
  border,
}));

export const DomainImage: React.FC<DomainImageProps> = ({
  src,
  alt,
  progressSize = 80,
  progressThickness = 3,
  circle,
  background,
  border,
}) => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <div style={{ position: "relative" }}>
      <StyledImage
        alt={alt}
        src={src}
        width={0} // This might need to be set to actual image dimensions or use layout="fill" if you want it to expand
        height={0} // Same as width comment above
        sizes="100vw"
        onLoadingComplete={() => setImgLoaded(true)}
        circle={circle}
        background={background}
        border={border}
      />
      {!imgLoaded && (
        <CircularProgress
          size={progressSize}
          thickness={progressThickness}
          color="secondary"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};
