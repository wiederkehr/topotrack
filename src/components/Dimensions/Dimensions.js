import styles from "./Dimensions.module.css";

export default function Dimensions({ ratios, dimensions, onDimensionChange, onRatioChange }) (
  <div className={styles.dimensions}>
    <input
      type="number"
      name="width"
      min="0"
      value={dimensions.width}
      onChange={onDimensionChange}
      readOnly={dimensions.ratio !== "Custom"}
    />
    <span>×</span>
    <input
      type="number"
      name="height"
      min="0"
      value={dimensions.height}
      onChange={onDimensionChange}
      readOnly={dimensions.ratio !== "Custom"}
    />
    <select name="ratio" value={dimensions.ratio} onChange={onRatioChange}>
      {ratios.map((preset, index) => (
        <option key={index} value={preset.name}>
          {preset.name}
        </option>
      ))}
    </select>
  </div>
);
