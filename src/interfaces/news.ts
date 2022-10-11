export interface INews {
  id: number;
  imgUrl?: string;
  title: string;
  link: string;
  source: ISource;
  category: string;
  publishTime: string;
  symbolList: string[];
}

interface ISource {
  id: number;
  name: string;
  logoUrl?: string;
}

export interface INewsListData {
  next?: boolean;
  data?: INews[];
  lastSequence?: string;
  publishTime?: string;
  symbolCode?: string;
  hasMore?: boolean;
}
