export const arrayBufferToUrl = (arrayBuffer: ArrayBuffer, type: string) => {
  const blob = new Blob([arrayBuffer], { type });
  return URL.createObjectURL(blob);
};
