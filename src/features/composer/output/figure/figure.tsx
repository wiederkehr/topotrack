import { useParentSize } from "@cutting/use-get-parent-size";
import { forwardRef, Ref, RefObject } from "react";

import { useTemplateStore } from "@/stores";
import { useUnitStore } from "@/stores/useUnitStore";
import type {
  ActivityStreamsType,
  ActivityType,
  FormatType,
  SizeType,
  TemplateType,
  VariableType,
} from "@/types";

import styles from "./figure.module.css";

type FigureProps = {
  activity: ActivityType;
  activityData: ActivityStreamsType | null;
  format: FormatType;
  template: TemplateType;
  variables: VariableType[];
};

function FigureComponent(
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
  const { Visual } = template;
  const units = useUnitStore((state) => state.units);
  const overrides = useTemplateStore((state) => state.overrides);

  return (
    <div className={styles.figure} ref={ref}>
      <Visual
        activity={activity}
        activityData={activityData}
        variables={variables}
        overrides={overrides}
        format={format}
        size={size}
        units={units}
      />
    </div>
  );
}

export const Figure = forwardRef(FigureComponent);
export type { FigureProps };
