import { ReactNode } from "react";

export interface ButtonProps {
  content: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
}

export interface CardProps {
  icon?: ReactNode;
  mainHeading: string;
  secondaryHeading: string;
  className?: string;
  note: string;
  trend: string;
}

export interface TweetProps {
  image: string;
  link: string;
  username: string;
  review: string;
  app_icon: string;
}

export interface BlogTypes {
  id: string;
  title: string;
  subtitle: string;
  blog_content?: string[];
  read_time: string;
  created_at: string;
  image: string;
  tags: string[];
}

export interface SideBarItem {
  tab_name: string;
  title: string;
  slug: string;
}

export type SidebarTab = {
  path: string;
  tabName: string;
};

export type SidebarSection = {
  category: string;
  items: SidebarTab[];
};

export type Props = {
  tabsData: SidebarSection[];
  caption: string;
  head: string;
};
