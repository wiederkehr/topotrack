import styles from "./output.module.css";

import Canvas from "./canvas";
import Figure from "./figure";
import Scrollarea from "@/components/interface/scrollarea";

export default function Output({
  activity,
  activityData,
  activityError,
  figureRef,
  format,
  template,
  variables,
}) {
  if (activityError) return <div className={styles.error}>Error!</div>;
  if (!activityData) return <div className={styles.loading}>Loading…</div>;
  return (
    <div className={styles.output}>
      <Scrollarea>
        <Canvas format={format}>
          <Figure
            activity={activity}
            activityData={activityData}
            ref={figureRef}
            template={template}
            variables={variables}
          />
        </Canvas>
      </Scrollarea>
    </div>
  );
}
