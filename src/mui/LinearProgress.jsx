import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const BorderLinearProgress = styled(LinearProgress)(
  ({ theme, barcolor, trackcolor, height }) => ({
    height: height || 8,
    borderRadius: 5,

    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: trackcolor || theme.palette.grey[200],
    },

    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: barcolor || "#1a90ff",
    },
  })
);

export default function LinearProgressBar({
  value = 50,
  barColor,
  trackColor,
  height,
}) {
  return (
    <BorderLinearProgress
      variant="determinate"
      value={value}
      barcolor={barColor}
      trackcolor={trackColor}
      height={height}
    />
  );
}
