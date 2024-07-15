import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseDataLoja } from '../models/entidades';
import { map, Observable } from 'rxjs';
import { urlApi } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LojaService {

  private readonly API = urlApi;

  constructor(private http: HttpClient) {}

  carregarLojas(): Observable<ResponseDataLoja> {
    const endpoint = `${this.API}/loja/`;

    return this.http.get<ResponseDataLoja>(endpoint).pipe(
      map(response => response)
    );
  }
}
