export enum TIMELINE_SLIDE_TYPES {
  ERA = 2,
  SLIDE = 3,
  TITLE = 1
}

export interface TimelineViewSlideInterface {
  type: TIMELINE_SLIDE_TYPES;
  viewSlide: TimelineSlideInterface | TimelineEraInterface;
  label: string;
}

export interface TimelineSettingsInterface {
  title?: TimelineSlideInterface;
  scale?: 'human' | 'cosmological';
  options: TimelineOptionsInterface;
}

// These interfaces match with the objects used in the TimelineJS library
export interface TimelineConfigInterface extends TimelineSettingsInterface {
  events: TimelineSlideInterface[];
  eras: TimelineEraInterface[];
}

export interface TimelineSlideInterface {
  start_date?: TimelineDateInterface; // Not required for title slide
  end_date?: TimelineDateInterface;
  group?: string;
  text?: TimelineTextInterface;
  background?: TimelineBackgroundInterface;
  media?: TimelineMediaInterface;
  display_date?: string; // Override representation of start and end date
}

export interface TimelineEraInterface {
  start_date: TimelineDateInterface;
  end_date: TimelineDateInterface;
  text?: TimelineTextInterface;
}

export interface TimelineDateInterface {
  year: number;
  month?: number; // Note: 1 is January, not 0
  day?: number;
  hour?: number; // 0-23
  minute?: number; // 0-59
  second?: number; // 0-59
  millisecond?: number;
  display_date?: string; // Optional string representation of date
}

export interface TimelineTextInterface {
  headline?: string;
  text?: string; // Not used for era slides
}

export interface TimelineMediaInterface {
  url?: string; // if omitted, it should be added by the wrapper (see eduFileId)
  caption?: string;
  credit?: string;
  thumbnail?: string;
  alt?: string;
  title?: string;
  link?: string;
  eduFileId?: number; // checked to replace the url field with a signed url
}

export interface TimelineOptionsInterface {
  relative?: boolean; // Defaults to false
  scale_factor?: number; // Amount of screen widths timeline takes up
}

export interface TimelineBackgroundInterface {
  url?: string;
  color?: string;
  eduFileId?: number; // checked to replace the url field with a signed url
}
