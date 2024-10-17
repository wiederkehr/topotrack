import { Box } from "@radix-ui/themes";

import Callout from "@/components/interface/callout";
import Scrollarea from "@/components/interface/scrollarea";

import Canvas from "./canvas";
import Figure from "./figure";
import styles from "./output.module.css";

export default function Output({
  activity,
  activityData,
  activityError,
  activityLoading,
  figureRef,
  format,
  template,
  variables,
}) {
  return (
    <div className={styles.output}>
      <Scrollarea>
        <Box p="var(--space-default)">
          <Canvas format={format}>
            {activityLoading && <Callout m="5">Loading activity…</Callout>}
            {activityError && <Callout m="5">Error loading activity.</Callout>}
            {activity && activityData && (
              <Figure
                activity={activity}
                activityData={activityData}
                format={format}
                ref={figureRef}
                template={template}
                variables={variables}
              />
            )}
          </Canvas>
        </Box>
      </Scrollarea>
    </div>
  );
}
