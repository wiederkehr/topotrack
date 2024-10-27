import { VariableType } from "@/types";

type DestructuredVariables = {
  [key: string]: string;
};

function destructureVariables(
  variables: VariableType[],
): DestructuredVariables {
  return variables.reduce((acc, variable) => {
    acc[variable.name] = variable.value || "";
    return acc;
  }, {} as DestructuredVariables);
}

export { destructureVariables };
