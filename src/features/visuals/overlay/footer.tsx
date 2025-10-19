import { InfoBlock } from "./infoBlock";

type FooterProps = {
  children: React.ReactNode;
  padding: { bottom: number; left: number; right: number; top: number };
};

export function Footer({ padding, children }: FooterProps) {
  return (
    <InfoBlock position={"bottom"} padding={padding}>
      {children}
    </InfoBlock>
  );
}
