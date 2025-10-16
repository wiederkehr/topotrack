import { Box } from "@radix-ui/themes";

type MetaDividerProps = {
  color: string;
};

export function MetaDivider({ color }: MetaDividerProps) {
  return <Box flexGrow="1" height="1px" style={{ backgroundColor: color }} />;
}
