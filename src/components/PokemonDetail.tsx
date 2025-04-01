import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface Pokemon {
    name: string;
    image: string;
    height: number;
    weight: number;
    types: string[];
    stats: { name: string; value: number }[];
}

interface PokemonDetailProps {
    favorites: string[];
    toggleFavorite: (pokemon: string) => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ favorites, toggleFavorite }) => {
    const { name } = useParams<{ name: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                if (!response.ok) {
                    throw new Error("Pokémon not found");
                }
                const data = await response.json();
                setPokemon({
                    name: data.name,
                    image: data.sprites.front_default,
                    height: data.height / 10,
                    weight: data.weight / 10,
                    types: data.types.map((t: any) => t.type.name),
                    stats: data.stats.map((s: any) => ({
                        name: s.stat.name,
                        value: s.base_stat
                    })),
                });
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemonDetail();
    }, [name]);

    if (loading) return <p className="text-center text-white">Loading Pokémon details...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;

    const isFavorite = favorites.includes(pokemon?.name || "");

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-between p-14 px-40">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96 text-center border-2 border-gray-600">
                <h1 className="text-2xl font-bold mb-4">{pokemon?.name}</h1>
                <img src={pokemon?.image} alt={pokemon?.name} className="mx-auto w-40 h-40 mb-4" />
                <p className="text-lg"><strong>Height:</strong> {pokemon?.height} M</p>
                <p className="text-lg"><strong>Weight:</strong> {pokemon?.weight} KG</p>
                <p className="text-lg"><strong>Types:</strong> {pokemon?.types.join(", ")}</p>
                <div className="flex items-center justify-between w-full">
                    <button
                        onClick={() => toggleFavorite(pokemon?.name || "")}
                        className={`mt-4 inline-block px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-700`}
                    >
                        {isFavorite ? "Unfavorite" : "Add to Favorites"}
                    </button>

                    <Link to="/" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Back to List
                    </Link>
                </div>
            </div>
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg text-center border-2 h-96 border-gray-600 w-1/2">
                <h2 className="text-xl font-bold mb-4">Stats</h2>
                <ResponsiveContainer width="100%" height="80%">
                    <BarChart data={pokemon?.stats}>
                        <XAxis dataKey="name" stroke="#ffffff" />
                        <YAxis stroke="#ffffff" />
                        <Bar dataKey="value" fill="#38bdf8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PokemonDetail;