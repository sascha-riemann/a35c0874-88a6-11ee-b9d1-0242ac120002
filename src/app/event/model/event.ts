export interface Event {
  _id: string;
  title: string;
  flyerFront: string;
  attending: number;
  date: string;
  startTime: string;
  endTime: string;
  contentUrl: string;
  venue: Venue;
  pick: {
    id: string;
    blurb: string;
  };
  artists: Artist[];
  city: string;
  country: string;
  private: boolean;
  __v: number;
}

export interface Venue {
  id: string;
  name: string;
  contentUrl: string;
  live: boolean;
  direction: string;
}

export interface Artist {
  id: string;
  name: string;
  _id: {
    $oid: string;
  };
}

export interface EventDate {
  date: Date;
  events: Event[];
}
