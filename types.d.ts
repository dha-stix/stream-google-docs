type DocumentState = {
  created_by: {
    name: string;
    id: string;
    date: string;
  };
  last_modified: {
    id: string;
    name: string;
    date: string;
  };
  content: string;
  title: string;
  slug: string;
};

type EncodedSlugData  ={
  slug: string;
  editor: boolean;
}