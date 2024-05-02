import * as React from "react";

export function useEffectAfterMount(
  callback: () => void,
  dependencies: ReadonlyArray<unknown>
): void {
  const didMountRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (didMountRef.current) {
      console.log("no loading");
      callback();
    } else {
      console.log("on mount");
      didMountRef.current = true;
    }
  }, [dependencies, callback]);
}
