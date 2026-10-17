import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pokemon } from '../pokemon';
import am from '@angular/common/locales/am';

@Component({
  selector: 'app-pokemon-form',
  imports: [ReactiveFormsModule],
  styleUrl: './pokemon-form.css',
  templateUrl: './pokemon-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  protected pokemonService = inject(Pokemon);

  editingId = signal<string | null>(null);

  protected pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  });

  ngOnInit() {
    this.pokemonService.fetchPokemon();
  }

  addLevel(amount: number) {
    const currentLvl = this.pokemonForm.controls.level.value || 1;
    const newLvl = Math.max(1, currentLvl + amount);
    this.pokemonForm.controls.level.setValue(newLvl);
  }

  onEdit(pokemon: any) {
    // 1. Set the editing ID
    this.editingId.set(pokemon._id);

    // 2. Populate form fields
    this.pokemonForm.patchValue({
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      nature: pokemon.nature
    });

    // 3. Smooth scroll up to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCancelEdit() {
    this.editingId.set(null);
    this.pokemonForm.reset({ name: '', type: '', nature: '', level: 1 });
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this Pokemon?')) {
      this.pokemonService.deletePokemon(id).subscribe(() => {
        this.pokemonService.fetchPokemon();
      });
    }
  }
  
  onSubmit() {
    if (!this.pokemonForm.valid) return;

    const currentId = this.editingId();
    const formValues = this.pokemonForm.getRawValue();

    if (currentId) {
      // EDIT MODE -> Call PUT endpoint
      this.pokemonService.updatePokemon(currentId, formValues).subscribe(() => {
        this.pokemonService.fetchPokemon();
        this.onCancelEdit(); // Clear form & reset editingId
        console.log("Pokemon updated successfully!");
      });
    } else {
      // ADD MODE -> Call POST endpoint
      this.pokemonService.savePokemon(formValues).subscribe(() => {
        this.pokemonService.fetchPokemon();
        this.pokemonForm.reset({ name: '', type: '', nature: '', level: 1 });
        console.log("Pokemon added successfully!");
      });
    }
  }
}