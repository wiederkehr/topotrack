import { forwardRef } from "react";
import ContainerDimensions from "react-container-dimensions";

import styles from "./figure.module.css";

export default forwardRef(function Figure(
  { activity, activityData, format, template, variables },
  ref,
) {
  return (
    <ContainerDimensions>
      {(size) => (
        <div className={styles.figure} ref={ref}>
          {template.render({
            activity,
            activityData,
            variables,
            format,
            size,
          })}
        </div>
      )}
    </ContainerDimensions>
  );
});
