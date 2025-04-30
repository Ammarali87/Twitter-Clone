export interface Category {
    _id: string;
    name: string;
    image: string;
    slug: string;
  }
  
 export interface SearchBarProps {
    onSearch: (query: string) => void;
    // fun: (var:stirng)=> void
  } 