export interface LoopBackFilter {
  fields?: any;
  include?: any;
  limit?: any;
  order?: any;
  skip?: any;
  offset?: any;
  where?: any;
}
export interface AccessTokenInterface {
  id?: string;
  ttl?: number;
  scopes?: ['string'];
  created?: Date;
  userId?: string;
  user?: any;
}

/**
 * This GeoPoint represents both, LoopBack and MongoDB GeoPoint
 **/
export interface GeoPoint {
  lat?: number;
  lng?: number;
  type?: string;
  coordinates?: number[];
}
export interface StatFilter {
  range: string;
  custom?: {
    start: string;
    end: string;
  };
  where?: {};
  groupBy?: string;
}
