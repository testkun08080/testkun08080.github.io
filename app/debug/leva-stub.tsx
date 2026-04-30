type ControlLeaf =
  | { value: unknown }
  | {
      [key: string]: unknown;
    };

type ControlGroup = Record<string, ControlLeaf>;
type ControlsSchema = Record<string, ControlGroup | ControlLeaf>;

function readLeafValue(leaf: ControlLeaf): unknown {
  if (leaf && typeof leaf === "object" && "value" in leaf) {
    return (leaf as { value: unknown }).value;
  }
  return undefined;
}

function flattenControls(schema: ControlsSchema): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  Object.values(schema).forEach((entry) => {
    if (!entry || typeof entry !== "object") return;
    if ("value" in entry) return;
    Object.entries(entry).forEach(([key, leaf]) => {
      result[key] = readLeafValue(leaf);
    });
  });
  return result;
}

export function folder<T>(value: T): T {
  return value;
}

export function useControls(_name: string, schema: ControlsSchema): any {
  return flattenControls(schema);
}

export function Leva(_props: Record<string, unknown>) {
  return null;
}
