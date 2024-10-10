import Module from "@/components/interface/module";

import Searchfield from "./searchfield";

export default function Search({ searchTerm, onSearchChange }) {
  return (
    <Module label="Search">
      <Searchfield searchTerm={searchTerm} onSearchChange={onSearchChange} />
    </Module>
  );
}
