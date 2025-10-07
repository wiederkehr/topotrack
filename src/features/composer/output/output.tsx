import { Box, Flex, Spinner } from "@radix-ui/themes";
import { AxiosError } from "axios";

import { useExportStore, useTemplateStore } from "@/stores";
import { ActivityStreamsType, ActivityType } from "@/types";

import Canvas from "./canvas";
import Figure from "./figure";
import styles from "./output.module.css";

type OutputProps = {
  activity: ActivityType | undefined;
  activityData?: ActivityStreamsType | null;
  activityError?: AxiosError | null;
  activityLoading?: boolean;
  figureRef: React.Ref<HTMLDivElement>;
};

function Output({ activity, activityData, figureRef }: OutputProps) {
  const { format } = useExportStore();
  const { template, variables } = useTemplateStore();

  const isReady = !!activity && !!activityData;
  return (
    <div className={styles.output}>
      <div>
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
      </div>
    </div>
  );
}

export default Output;
export type { OutputProps };
