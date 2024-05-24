import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const targetDate = new Date("2024-05-23T05:18:59");

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const currentDate = new Date();
      const timeDifference = targetDate.getTime() - currentDate.getTime();
      const totalSeconds = Math.floor(timeDifference / 1000);

      const days =
        Math.floor(totalSeconds / 86400) <= 0
          ? 0
          : Math.floor(totalSeconds / 86400);
      const hours =
        Math.floor((totalSeconds % 86400) / 3600) <= 0
          ? 0
          : Math.floor((totalSeconds % 86400) / 3600);
      const minutes =
        Math.floor((totalSeconds % 3600) / 60) <= 0
          ? 0
          : Math.floor((totalSeconds % 3600) / 60);
      const seconds =
        Math.floor(totalSeconds % 60) <= 0 ? 0 : Math.floor(totalSeconds % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    const timer = setInterval(calculateTimeLeft, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <Flex direction="column" alignItems="center">
      <Box
        w="324px"
        h="82px"
        p="16px 48px"
        borderRadius="999px 999px 999px"
        bg="#FFFFFFCC"
        boxShadow="0px 0px 24px 0px #FFFFFF"
        display="flex"
        justifyContent="space-between"
      >
        <TimerUnit value={timeLeft.days} label="DAYS" />
        <TimerUnit value={timeLeft.hours} label="HOURS" />
        <TimerUnit value={timeLeft.minutes} label="MINUTES" />
        <TimerUnit value={timeLeft.seconds} label="SECONDS" />
      </Box>
    </Flex>
  );
};

// Timer unit component
const TimerUnit = ({ value, label }: { value: number; label: string }) => (
  <Box w="55px" h="50px">
    <Text
      fontWeight="400"
      fontSize="24px"
      lineHeight="31.99px"
      textAlign="center"
      color="#0A0A0A"
    >
      {value.toString().padStart(2, "0")}
    </Text>
    <Text
      fontFamily="Mona-Sans"
      fontWeight="300"
      fontSize="12px"
      lineHeight="18px"
      textAlign="center"
      color="var(--Gray-900, #0A0A0A)"
    >
      {label}
    </Text>
  </Box>
);

export default Timer;
