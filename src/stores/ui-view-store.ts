import { makeAutoObservable, runInAction } from "mobx";

export class UiViewStore {
  _sidebarOpen = false;
  _createRoomModalOpen = false;
  _roomSearchText: string = "";
  _showPublicOnly = false;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSidebar() {
    this._sidebarOpen = !this._sidebarOpen;
  }
  get CreateRoomModalOpen() {
    return this._createRoomModalOpen;
  }

  set CreateRoomModalOpen(value: boolean) {
    runInAction(() => {
      this._createRoomModalOpen = value;
    });
  }
}
