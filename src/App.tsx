import React, { useEffect, useState } from "react";
import { Box, Text } from "./Library";

function App() {
  const [test, setTest] = useState(false);
  const [pos, setPos] = useState<[number, number, boolean]>([0, 0, true]);

  useEffect(() => {
    const handle = setInterval(() => {
      setPos((pos) => {
        let dir = pos[2];
        if (pos[0] > 500 || pos[0] < 0) dir = !pos[2];

        return [pos[0] + (dir ? 1 : -1), pos[1] + (dir ? 1 : -1), dir];
      });
    }, 3);

    return () => {
      clearInterval(handle);
    };
  });

  return (
    <>
      <Box
        w="100px"
        h="100px"
        bg="gray"
        position="absolute"
        top="0"
        transform={`translateX(${pos[0]}px) translateY(${pos[1]}px)`}
      >
        Testing
      </Box>
      <Text c={test ? "blue" : "black"} style={{ borderStyle: "dotted" }}>
        Testing
      </Text>
      <button onClick={() => setTest(!test)}>Toggle</button>
    </>
  );
}

export default App;
