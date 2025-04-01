import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface Pokemon {
    name: string;
    image: string;
    types: string[];
}

interface HomePageProps {
    favorites: string[];
    toggleFavorite: (pokemon: string) => void;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF69B4', '#8A2BE2']; // Sample colors for Pie chart

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
                // Collect all types across the fetched Pokémon
                const allTypes = pokemonDetails.flatMap(pokemon => pokemon.types);
                setAllPokemonTypes(allTypes);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        };

        fetchPokemon();
    }, []);

    const filteredPokemons = pokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
    );

    // Aggregate the types and calculate their percentages
    const typeCounts = allPokemonTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalTypes = allPokemonTypes.length;

    const typePercentages = Object.entries(typeCounts).map(([type, count]) => ({
        name: type,
        value: (count / totalTypes) * 100,
    }));

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold text-center text-white mb-6">Pokémon List</h1>

            {/* Type Distribution Pie Chart */}
            <div className="bg-gray-800 text-white rounded-lg shadow-lg text-center border-2 h-96 border-gray-600 mb-8">
                <h2 className="text-xl font-bold mb-4">Type Distribution</h2>

                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={typePercentages}
                            dataKey="value"
                        >
                            {typePercentages.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <input
                type="text"
                placeholder="Search a Pokémon"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-6 w-full p-3 bg-gray-800 text-white rounded-md"
            />

            {/* Pokémon List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPokemons.map((pokemon) => (
                    <li key={pokemon.name} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                        <img src={pokemon.image} alt={pokemon.name} className="mx-auto w-32 h-32 mb-4" />
                        <h3 className="text-xl font-semibold text-center text-white">{pokemon.name}</h3>
                        <button
                            onClick={() => toggleFavorite(pokemon.name)}
                            className={`mt-4 w-full py-2 rounded-md text-white ${favorites.includes(pokemon.name) ? 'bg-red-500' : 'bg-gray-600'} hover:bg-gray-700`}
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
        </div>
    );
};

export default HomePage;
