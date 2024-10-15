import { Box, Flex } from "@radix-ui/themes";

import Module from "@/components/interface/module";
import { formatDate } from "@/functions/format";

import Activity from "./activity";

export default function Activities({
  activities,
  activitiesError,
  activitiesLoading,
  selectedActivity,
  onActivityChange,
}) {
  if (!activities) return null;
  return (
    <Module label="Activities">
      <Flex direction="column" gap="2">
        {activities.map((activity, index) => (
          <Activity
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
