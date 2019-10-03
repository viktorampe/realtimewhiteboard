// These interfaces match with the objects used in the TimelineJS library

export interface TimelineConfig {
  title?: TimelineSlide;
  events: TimelineSlide[];
  eras: TimelineEra[];
  scale?: 'human' | 'cosmological';
  options: TimelineOptions;
}

export interface TimelineSlide {
  start_date?: TimelineDate; // Not required for title slide
  end_date?: TimelineDate;
  group?: string;
  text?: TimelineText;
  background?: TimelineBackground;
  media?: TimelineMedia;
  display_date?: string; // Override representation of start and end date
}

export interface TimelineEra {
  start_date: TimelineDate;
  end_date: TimelineDate;
  text?: TimelineText;
}

export interface TimelineDate {
  year: number;
  month?: number; // Note: 1 is January, not 0
  day?: number;
  hour?: number; // 0-23
  minute?: number; // 0-59
  second?: number; // 0-59
  millisecond?: number;
  display_date?: string; // Optional string representation of date
}

export interface TimelineText {
  headline?: string;
  text?: string; // Not used for era slides
}

export interface TimelineMedia {
  url: string;
  caption?: string;
  credit?: string;
  thumbnail?: string;
  alt?: string;
  title?: string;
  link?: string;
}

export interface TimelineOptions {
  relative?: boolean; // Defaults to false
  scale_factor?: number; // Amount of screen widths timeline takes up
}

export interface TimelineBackground {
  url?: string;
  color?: string;
}
