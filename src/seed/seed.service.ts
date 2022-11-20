import { Injectable } from '@nestjs/common';
import { HttpAdapter } from 'src/common/adapters/http.adapter';
import { PokeResponse } from './interfaces/poke-response.interface';
import axios, { AxiosInstance } from 'axios';


@Injectable()
export class SeedService {

  // private readonly http=new HttpAdapter();
  private readonly axios:AxiosInstance = axios;

  async executeSeed(){

    // const { data } = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1');
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=60');

    let pokemonSeeded = [];
    data.results.forEach( ({name, url }) =>{
      
      const segments= url.split('/');
      const no:number = Number(segments[segments.length - 2]);

      console.log({name,no});
      try{
        const resp= this.axios.post('http://localhost:3000/api/v2/pokemon/',{name,no});
      }catch(error){
        console.log(error);
      }
      pokemonSeeded.push({name,no});
    });

    return pokemonSeeded;
  }

}
