import { Box } from "@radix-ui/themes";
import { LucideProps } from "lucide-react";

import {
  Footer,
  GradientMask,
  Header,
  MetaList,
  Profile,
  Title,
} from "@/features/visuals/overlay";
import { FormatNameType } from "@/types";

import { getPadding } from "../padding";
import { footerHeight, headerHeight, profileHeight } from "./dimensions";

type ItemType = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  value: string;
};
type ItemsType = ItemType[];

type OverlayProps = {
  background: string;
  footerItems: ItemsType;
  format: FormatNameType;
  headerItems: ItemsType;
  middleground: string;
  profileData: number[];
  title: string;
  width: number;
};

export function Overlay({
  background,
  middleground,
  format,
  title,
  footerItems,
  headerItems,
  width,
  profileData,
}: OverlayProps) {
  const padding = getPadding(format);
  const profileWidth = width - padding.left - padding.right;
  return (
    <>
      <GradientMask height={headerHeight} position="top" color={background} />
      <GradientMask
        height={footerHeight}
        position="bottom"
        color={background}
      />
      <Header padding={padding}>
        <Title>{title}</Title>
        <MetaList color={middleground} items={headerItems} />
      </Header>
      <Footer padding={padding}>
        <Box mb="-14px">
          <Profile
            color={middleground}
            width={profileWidth}
            height={profileHeight}
            data={profileData}
          />
        </Box>
        <MetaList color={middleground} items={footerItems} />
      </Footer>
    </>
  );
}
