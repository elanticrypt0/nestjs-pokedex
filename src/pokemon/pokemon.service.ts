import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel:Model<Pokemon>
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name=createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);      
      return createPokemonDto;
    } catch (error) {
      this.duplicatePokemonException(error);
    }

  }

  findAll(PaginationDto:PaginationDto) {
    const { limit=10, offset=0} = PaginationDto;
    return this.pokemonModel.find()
                .limit(limit)
                .skip(offset)
                .sort({
                  no:1
                })
                .select('-__v');

  }

  async findOne(term: string) {


    let pokemon:Pokemon;

    if( !isNaN( +term ) ){
      pokemon= await this.pokemonModel.findOne({no:term});
    }

    if( isValidObjectId(term) ){
      pokemon= await this.pokemonModel.findById(term);
    }

    if(!pokemon){
      pokemon= await this.pokemonModel.findOne({name:term.toLocaleLowerCase().trim()});
    }

    if(!pokemon) throw new NotFoundException(`The pokemon '${term}' dosen't exist`);

    return pokemon;
  
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if( updatePokemonDto.name ){
      updatePokemonDto.name=updatePokemonDto.name.toLocaleLowerCase().trim();
    }
    
    try {
      await pokemon.updateOne(updatePokemonDto, {new:true});
    } catch (error) {
      this.duplicatePokemonException(error);
    }
    
    return {...pokemon.toJSON(),...updatePokemonDto};
  }

  async remove(id:string) {
    // const result= await this.pokemonModel.findByIdAndDelete(id);
    const { deletedCount } = await this.pokemonModel.deleteOne({_id:id});
    if(deletedCount === 0){
      throw new BadRequestException(`There is no pokemon with id '${id}'`);
    }
    return;
  }

  private duplicatePokemonException(error:any){
    if (error.code === 11000){
      throw new BadRequestException(`Pokemon already exist in DB. ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create the register in DB`);
  }
}
