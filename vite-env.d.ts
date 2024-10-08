/// <reference types="vite/client" />

interface ImportMeta {
  hot: {
    accept: Function;
    dispose: Function;
    data: any;
  };
}