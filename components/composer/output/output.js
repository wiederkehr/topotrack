import styles from "./output.module.css";

import Callout from "@/components/interface/callout";
import Scrollarea from "@/components/interface/scrollarea";
import Canvas from "./canvas";
import Figure from "./figure";

export default function Output({
  activity,
  activityData,
  activityDataError,
  activityDataLoading,
  figureRef,
  format,
  template,
  variables,
}) {
  return (
    <div className={styles.output}>
      <Scrollarea>
        <Canvas format={format}>
          {activityDataLoading && <Callout>Loading activity data…</Callout>}
          {activityDataError && <Callout>Error loading activity data.</Callout>}
          {activity && activityData && (
            <Figure
              activity={activity}
              activityData={activityData}
              ref={figureRef}
              template={template}
              variables={variables}
            />
          )}
        </Canvas>
      </Scrollarea>
    </div>
  );
}
