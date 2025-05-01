import { makeAutoObservable } from "mobx";

export class UiViewStore {
  sidebarOpen = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
