import { useParentSize } from "@cutting/use-get-parent-size";
import { forwardRef, Ref, RefObject } from "react";

import type {
  ActivityType,
  FormatType,
  SizeType,
  TemplateType,
  VariableType,
} from "@/types";

import styles from "./figure.module.css";

type FigureProps = {
  activity: ActivityType;
  activityData: ActivityType[] | null;
  format: FormatType;
  template: TemplateType;
  variables: VariableType[];
};

function Figure(
  { activity, activityData, format, template, variables }: FigureProps,
  ref: Ref<HTMLDivElement>,
) {
  const refObject = ref as RefObject<Element>;
  const initialSize: SizeType = { width: 0, height: 0 };
  const { width, height } = useParentSize(refObject, {
    initialValues: initialSize,
  });
  const size: SizeType = {
    width: width || initialSize.width,
    height: height || initialSize.height,
  };
  const { Render } = template;

  return (
    <div className={styles.figure} ref={ref}>
      <Render
        activity={activity}
        activityData={activityData}
        variables={variables}
        format={format}
        size={size}
      />
    </div>
  );
}

const ForwardedFigure = forwardRef(Figure);

export default ForwardedFigure;
export type { FigureProps };
