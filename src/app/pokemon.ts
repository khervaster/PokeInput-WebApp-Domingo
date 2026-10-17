import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
    providedIn: 'root'
})

export class Pokemon {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:5000/api/pokemon';

    // reactive state management 
    pokemonList = signal<any[]>([]);

    fetchPokemon(){
        this.http.get<any[]>(this.apiUrl).subscribe(data => this.pokemonList.set(data));


    }

    savePokemon(data: any){
        return this.http.post(this.apiUrl, data);

    }

    updatePokemon(id: string, data: any) {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    deletePokemon(id: string) {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
