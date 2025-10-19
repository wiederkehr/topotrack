import { InfoBlock } from "./infoBlock";

type HeaderProps = {
  children: React.ReactNode;
  padding: { bottom: number; left: number; right: number; top: number };
};

export function Header({ padding, children }: HeaderProps) {
  return (
    <InfoBlock position={"top"} padding={padding}>
      {children}
    </InfoBlock>
  );
}
