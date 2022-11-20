import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import axios, { AxiosInstance } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';


@Injectable()
export class SeedService {

  // private readonly http=new HttpAdapter();
  private readonly axios:AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel:Model<Pokemon>
  ){}

  async executeSeed(){

    this.pokemonModel.deleteMany(); // Delete * From pokemons

    // const { data } = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=1');
    const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=60');

    let pokemonsToInsert:{name:string,no:number}[]=[];

    data.results.forEach( ({name, url }) =>{      
      const segments= url.split('/');
      const no:number = Number(segments[segments.length - 2]);
      pokemonsToInsert.push({name,no});
    });

    this.pokemonModel.insertMany(pokemonsToInsert);

    return 'DB seeded';
  }

}
