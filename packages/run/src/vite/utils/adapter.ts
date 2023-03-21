export const resolveAdapter = async (adapter: string) => {
  return (await import(adapter)).default();
};
