import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { BoardService } from '../../services/board-service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getColor } from '../../utils/helper';
import { Item } from '../../interfaces/item';

@Component({
  selector: 'app-card-component',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './card-component.html',
  styleUrl: './card-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

  boardForm: FormGroup;
  showInput = signal<boolean[]>([false, false, false]);
  columns = computed(() => {
    return this.boardService.columns()
  });

  constructor(
    public boardService: BoardService,
    private readonly fb: FormBuilder
  ) {
    this.boardForm = this.fb.group({
      values: this.fb.array(
        this.boardService.columns().map(() =>
          this.fb.control('', Validators.required)
        )
      )
    });
  }

  get values(): FormArray {
    return this.boardForm.get('values') as FormArray;
  }

  addItem(index: number) {
    const raw = this.values.at(index).value;
    const val = Number(raw);
    if (!isNaN(val)) {
      this.boardService.addItem(index, val);
      this.values.at(index).setValue('');
    }

    // To hide the input after item is added
    this.showInput.update(v => {
      const copy = [...v];
      copy[index] = false;
      return copy;
    });
  }

  // To show the input when the button '+ New' is clicked
  toggleInput(index: number) {
    const updated = [...this.showInput()];
    updated[index] = !updated[index];
    this.showInput.set(updated);
  }

  editItem(item: Item, editing: boolean) {
    this.boardService.editItem(item, editing);
  }

  deleteItem(index: number, id: number) {
    this.boardService.deleteItem(index, id);
  }

  saveItem(item: Item, newValue: number) {
    this.boardService.saveItem(item, newValue);
  }

  colorFor(value: number) {
    return getColor(value);
  }
}
