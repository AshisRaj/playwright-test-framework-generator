/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from 'ejs';
export const render = (tpl: string, data: any) =>
  ejs.render(tpl, data, { async: false, rmWhitespace: false });
