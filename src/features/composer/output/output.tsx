import { Box, Flex, Spinner } from "@radix-ui/themes";
import { AxiosError } from "axios";

import Scrollarea from "@/components/interface/scrollarea";
import {
  ActivityStreamsType,
  ActivityType,
  FormatType,
  TemplateType,
  VariableType,
} from "@/types";

import Canvas from "./canvas";
import Figure from "./figure";
import styles from "./output.module.css";

type OutputProps = {
  activity: ActivityType | undefined;
  activityData?: ActivityStreamsType | null;
  activityError?: AxiosError | null;
  activityLoading?: boolean;
  figureRef: React.Ref<HTMLDivElement>;
  format: FormatType;
  template: TemplateType;
  variables: VariableType[];
};

function Output({
  activity,
  activityData,
  figureRef,
  format,
  template,
  variables,
}: OutputProps) {
  const isReady = !!activity && !!activityData;
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
