import { popstateChange, routePages } from './utility';

let path = window.location.search;

export function load () {
  routePages(path)
  popstateChange()
}
