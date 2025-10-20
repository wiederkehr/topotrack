import styles from "./colorglyph.module.css";

type ColorGlyphProps = {
  colors: string[];
  size?: "small" | "medium";
};

/**
 * ColorGlyph - Visual representation of colors in a preset
 * Displays a small square divided into vertical bars, one for each color
 */
export function ColorGlyph({ colors, size = "small" }: ColorGlyphProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.colorGlyph} ${size === "medium" ? styles.medium : styles.small}`}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          className={styles.colorBar}
          style={{
            backgroundColor: color,
            width: `${100 / colors.length}%`,
          }}
        />
      ))}
    </div>
  );
}
