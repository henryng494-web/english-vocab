import { CoachDog } from "@/components/mascot/CoachDog";

type CoachDogBubbleProps = {
  message: string;
  pose?: "neutral" | "happy" | "wink" | "sad" | "smirk" | "peek" | "wave";
  className?: string;
};

/** Dog avatar + speech bubble — matches design board screen headers. */
export function CoachDogBubble({
  message,
  pose = "happy",
  className = "",
}: CoachDogBubbleProps) {
  return (
    <div className={`coach-dog-bubble ${className}`.trim()}>
      <CoachDog pose={pose} size={36} className="coach-dog-bubble__avatar shrink-0" />
      <p className="coach-dog-bubble__text">{message}</p>
    </div>
  );
}
