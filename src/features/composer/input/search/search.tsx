import { Module } from "@/components/interface/module";

import Searchfield from "./searchfield";

type SearchProps = {
  onSearchChange: (value: string) => void;
  searchTerm: string;
};

function Search({ searchTerm, onSearchChange }: SearchProps) {
  return (
    <Module label="Search">
      <Searchfield searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </Module>
  );
}

export default Search;
export type { SearchProps };
