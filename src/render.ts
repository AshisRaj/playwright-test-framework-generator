/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from 'ejs';

/**
 * Render a template string with provided data
 * @param tpl The template string
 * @param data The data to use for rendering
 * @returns The rendered string
 */
export const render = (tpl: string, data: any) =>
  ejs.render(tpl, data, { async: false, rmWhitespace: false });
