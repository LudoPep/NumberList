import { effect, Injectable, signal } from '@angular/core';
import { Item } from '../interfaces/item';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private nextId = 1;
  private readonly storageKey = 'boardData';
  columns = signal<Item[][]>(this.loadDataFromStorage());
  newValues = signal<string[]>(['', '', '']);

  constructor() {
    effect(() => {
      localStorage.setItem(this.storageKey, JSON.stringify(this.columns()))
    })
  }

  addItem(colIndex: number, value?: number) {
    const val = Number(value ?? this.newValues()[colIndex]);
    if (!isNaN(val)) {
      this.updateColumn(colIndex, [
        ...this.columns()[colIndex],
        { id: this.nextId++, value: val }
      ]);
      this.updateNewValue(colIndex, '');
    }
  }

  deleteItem(colIndex: number, itemId: number) {
    this.updateColumn(
      colIndex,
      this.columns()[colIndex].filter(item => item.id !== itemId)
    );
  }

  editItem(item: Item, editing: boolean) {
    const updated = this.columns().map(col =>
      col.map(it => it.id === item.id ? { ...it, editing } : it)
    );
    this.columns.set(updated);
  }

  saveItem(item: Item, newValue: number) {
    if (!isNaN(newValue)) {
      const updatedColumns = this.columns().map(col =>
        col.map(it => it.id === item.id ? { ...it, value: newValue, editing: false } : it)
      );
      this.columns.set(updatedColumns);
    }
  }

  private updateColumn(index: number, newItems: Item[]) {
    const updated = [...this.columns()];
    updated[index] = newItems;
    this.columns.set(updated);
  }

  private updateNewValue(index: number, val: string) {
    const nv = [...this.newValues()];
    nv[index] = val;
    this.newValues.set(nv);
  }

  // Data persistence
  private loadDataFromStorage(): Item[][] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [[], [], []];
  }
}
