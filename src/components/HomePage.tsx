import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import Header from './Header';
import Footer from './Footer';

interface Pokemon {
    name: string;
    image: string;
    types: string[];
}

interface HomePageProps {
    favorites: string[];
    toggleFavorite: (name: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ favorites, toggleFavorite }) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [search, setSearch] = useState('');
    const [allPokemonTypes, setAllPokemonTypes] = useState<string[]>([]);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100');
                const data = await response.json();

                const pokemonDetails = await Promise.all(
                    data.results.map(async (pokemon: { name: string; url: string }) => {
                        const pokemonResponse = await fetch(pokemon.url);
                        const pokemonData = await pokemonResponse.json();

                        return {
                            name: pokemon.name,
                            image: pokemonData.sprites.front_default,
                            types: pokemonData.types.map((t: any) => t.type.name),
                        };
                    })
                );

                setPokemons(pokemonDetails);
                const allTypes = pokemonDetails.flatMap(pokemon => pokemon.types);
                setAllPokemonTypes(allTypes);
            } catch (error) {
                console.error('Pokemon data not fetched', error);
            }
        };

        fetchPokemon();
    }, []);

    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <Header />

            <SearchBar value={search} onChange={setSearch} />

            {/* Pokémon grid list */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPokemons.map((pokemon) => (
                    <li key={pokemon.name} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <img src={pokemon.image} alt={pokemon.name} className="mx-auto w-32 h-32 mb-4" />
                        <h3 className="text-xl font-semibold text-center text-white">{pokemon.name}</h3>
                        <button
                            onClick={() => toggleFavorite(pokemon.name)}
                            className={`mt-4 w-full py-2 rounded-md text-white ${
                                favorites.includes(pokemon.name) ? 'bg-red-500' : 'bg-gray-600'
                            } hover:bg-gray-700`}
                        >
                            {favorites.includes(pokemon.name) ? 'Unfavorite' : 'Favorite'}
                        </button>
                        <Link
                            to={`/pokemon/${pokemon.name}`}
                            className="mt-4 inline-block w-full py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            More Details
                        </Link>
                    </li>
                ))}
            </ul>

            <Footer />
        </div>
    );
};

export default HomePage;
