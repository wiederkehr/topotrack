import { Box, Flex, Spinner } from "@radix-ui/themes";

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
  const isReady = activity && activityData?.length > 0;
  return (
    <div className={styles.output}>
      <Scrollarea>
        <Box p="var(--space-default)">
          <Canvas format={format}>
            {!isReady && (
              <Flex
                height="100%"
                direction="column"
                justify="center"
                align="center"
              >
                <Spinner />
              </Flex>
            )}
            {isReady && (
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
