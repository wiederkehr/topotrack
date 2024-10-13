import { Flex } from "@radix-ui/themes";

import Module from "@/components/interface/module";
import { formatDate } from "@/functions/format";

import Recent from "./recent";

export default function Recents({
  activities,
  activitiesError,
  activitiesLoading,
  selectedActivity,
  onActivityChange,
}) {
  if (!activities) return null;
  return (
    <Module label="Recent">
      <Flex direction="column" gap="2" align="stretch">
        {activities.map((activity, index) => (
          <Recent
            key={index}
            name={activity.name}
            date={formatDate(activity.start_date_local)}
            active={activity.id === selectedActivity?.id}
            onClick={() => onActivityChange(activity.id)}
          />
        ))}
      </Flex>
    </Module>
  );
}
