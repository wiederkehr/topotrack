"use client";

import { useEffect, useRef } from "react";

import { useGetAddress } from "@/hooks/useGetAddress";
import { useStravaActivities } from "@/hooks/useStravaActivities";
import { useStravaActivity } from "@/hooks/useStravaActivity";
import { useActivityStore, useExportStore } from "@/stores";

import styles from "./composer.module.css";
import Error from "./error";
import Input from "./input";
import Output from "./output";

type ComposerProps = {
  token: string;
};

function Composer({ token }: ComposerProps) {
  const {
    activity,
    visibleActivities,
    pageNumber,
    setActivity,
    addActivities,
    handleLoadMore,
  } = useActivityStore();
  const { setFigureRef } = useExportStore();

  // Activities
  // //////////////////////////////
  const {
    data: activitiesData,
    error: activitiesError,
    loading: activitiesLoading,
  } = useStravaActivities({ token: token ?? "", pageNumber });

  useEffect(() => {
    if (activitiesData && Array.isArray(activitiesData)) {
      addActivities(activitiesData);
    }
  }, [activitiesData, addActivities]);

  // Activity
  // //////////////////////////////
  useEffect(() => {
    if (visibleActivities && visibleActivities.length > 0 && !activity) {
      setActivity(visibleActivities[0] || undefined);
    }
  }, [visibleActivities, activity, setActivity]);

  // Activity Data
  // //////////////////////////////
  const {
    data: activityData,
    error: activityError,
    loading: activityLoading,
  } = useStravaActivity({ token: token ?? "", id: activity?.id ?? null });

  // Activity Address Data
  // //////////////////////////////
  const lat = activity?.start_latlng?.[0] || null;
  const lon = activity?.start_latlng?.[1] || null;
  const { data: activityAddress } = useGetAddress(lat, lon);

  useEffect(() => {
    if (activityData && activityAddress && activity && !activity.address) {
      setActivity({
        ...activity,
        address: {
          country: activityAddress.address?.country,
          state: activityAddress.address?.state,
        },
      });
    }
  }, [activityData, activityAddress, activity?.id, setActivity]);

  // Figure ref for export
  // //////////////////////////////
  const figureRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setFigureRef(figureRef as React.RefObject<HTMLDivElement>);
  }, [setFigureRef]);

  if (activitiesError && activitiesError.response?.status === 401) {
    return <Error />;
  }

  return (
    <div className={styles.composer}>
      <Output
        activity={activity}
        activityData={activityData}
        activityError={activityError}
        activityLoading={activityLoading}
        figureRef={figureRef}
      />
      <Input
        activitiesError={activitiesError}
        activitiesLoading={activitiesLoading}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}

export default Composer;
