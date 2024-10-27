import { VariableType } from "@/types";

function findVariableByName(variables: VariableType[], name: string) {
  return variables.find((variable) => variable.name === name);
}

export { findVariableByName };
