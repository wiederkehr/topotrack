import { Box, Flex, Spinner } from "@radix-ui/themes";

import Scrollarea from "@/components/interface/scrollarea";

import Canvas from "./canvas";
import Figure from "./figure";
import styles from "./output.module.css";

type OutputProps = {
  activity: any;
  activityData: any;
  activityError: boolean;
  activityLoading: boolean;
  figureRef: React.Ref<HTMLDivElement>;
  format: {
    height: number;
    width: number;
  };
  template: {
    Render: React.ComponentType<{
      activity: any;
      activityData: any;
      format: string;
      size: { height: number; width: number };
      variables: any;
    }>;
  };
  variables: any;
};

function Output({
  activity,
  activityData,
  activityError,
  activityLoading,
  figureRef,
  format,
  template,
  variables,
}: OutputProps) {
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

export default Output;
export type { OutputProps };
