export const genTreeMap = (
  {
    level,
    num,
    childrenKey,
  }: {
    level: number;
    num: number;
    childrenKey: string;
  },
  cb: (data: any) => any
) => {
  const map: any = {};
  const fn = (parentId?: string, childrenIndex: number, level: number) => {
    if (level === 0) {
      return;
    }
    const id = parentId
      ? `${parentId}-${childrenIndex + 1}`
      : `${childrenIndex + 1}`;
    const node = {
      id,
      label: id,
      parentId,
      leaf: level === 1,
      [childrenKey]: [],
    };
    const parent = map[parentId];
    if (parent) {
      parent[childrenKey].push(node);
    }
    map[id] = node;

    const _level = level - 1;
    for (let i = 0; i < num; i++) {
      fn(node.id, i, _level);
    }
  };
  for (let i = 0; i < num; i++) {
    fn(null, i, level);
  }
  return map;
};

export function page(data: any[], pageIndex: number, pageSize: number) {
  if (pageSize === -1) {
    return data.slice(0);
  }
  return data.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
}
