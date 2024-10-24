import { useParentSize } from "@cutting/use-get-parent-size";
import { forwardRef } from "react";

import styles from "./figure.module.css";

type FigureProps = {
  activity: any;
  activityData: any;
  format: string;
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

function Figure(
  { activity, activityData, format, template, variables }: FigureProps,
  ref: React.Ref<HTMLDivElement>,
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
}

const ForwardedFigure = forwardRef(Figure);

export default ForwardedFigure;
export type { FigureProps };
