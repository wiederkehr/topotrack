import { UpdateIcon } from "@radix-ui/react-icons";
import { Button, Flex, Skeleton, Spinner } from "@radix-ui/themes";
import { useEffect, useRef } from "react";

import Callout from "@/components/interface/callout";
import { Module } from "@/components/interface/module";
import { formatDate } from "@/functions/format";
import type { ActivityType } from "@/types";

import Activity from "./activity";

type ActivitiesProps = {
  activities: ActivityType[];
  activitiesError: boolean;
  activitiesLoading: boolean;
  disableLoadMore: boolean;
  onActivityChange: (id: number) => void;
  onLoadMore: () => void;
  selectedActivity: ActivityType | null;
};

function Activities({
  activities,
  activitiesError,
  activitiesLoading,
  selectedActivity,
  onActivityChange,
  onLoadMore,
  disableLoadMore,
}: ActivitiesProps) {
  const loaderRef = useRef<HTMLButtonElement>(null);
  if (!activities) return null;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target?.isIntersecting && !disableLoadMore) {
        onLoadMore();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [onLoadMore, disableLoadMore]);

  const isReady = activities.length > 0;
  const isError = !activitiesLoading && activitiesError;

  return (
    <Module label="Activities">
      <Flex direction="column" gap="2">
        {!isReady &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height="40px" width="100%" />
          ))}
        {isError && <Callout>Error loading activities.</Callout>}
        {isReady &&
          activities.map((activity, index) => (
            <Activity
              key={index}
              name={activity.name}
              date={formatDate(activity.start_date_local)}
              active={activity.id === selectedActivity?.id}
              onClick={() => onActivityChange(activity.id)}
            />
          ))}
        {isReady && (
          <Button
            ref={loaderRef}
            onClick={onLoadMore}
            disabled={disableLoadMore}
          >
            <Spinner loading={disableLoadMore}>
              <UpdateIcon />
            </Spinner>
            Load More
          </Button>
        )}
      </Flex>
    </Module>
  );
}

export default Activities;
