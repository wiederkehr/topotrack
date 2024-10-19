import { useParentSize } from "@cutting/use-get-parent-size";
import { forwardRef } from "react";

import styles from "./figure.module.css";

export default forwardRef(function Figure(
  { activity, activityData, format, template, variables },
  ref,
) {
  const size = useParentSize(ref, { width: 0, height: 0 });
  const isReady =
    activity && activityData?.length > 0 && size?.width > 0 && size?.height > 0;
  const { Render } = template;

  return (
    <div className={styles.figure} ref={ref}>
      {isReady && (
        <Render
          activity={activity}
          activityData={activityData}
          variables={variables}
          format={format}
          size={size}
        />
      )}
    </div>
  );
});
