import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import StatsChart from "./StatsChart";
import PokemonCard from "./PokemonCard";

// Define the Pokémon data shape
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

    useEffect(() => {
        const fetchPokemonDetail = async () => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const data = await response.json();

            setPokemon({
                name: data.name,
                image: data.sprites.front_default,
                height: data.height / 10,
                weight: data.weight / 10,
                types: data.types.map((t: any) => t.type.name), // Extract types
                stats: data.stats.map((s: any) => ({
                    name: s.stat.name,
                    value: s.base_stat
                })),
            });
        };

        fetchPokemonDetail();
    }, [name]);

    const isFavorite = favorites.includes(pokemon?.name || "");

    const handleToggleFavorite = () => {
        if (pokemon) {
            toggleFavorite(pokemon.name);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 p-14 px-40">
            <Header />

            <div className="flex items-center justify-between mt-10">
                {pokemon && (
                    <PokemonCard
                        name={pokemon.name}
                        image={pokemon.image}
                        height={pokemon.height}
                        weight={pokemon.weight}
                        types={pokemon.types}
                        isFavorite={isFavorite}
                        toggleFavorite={handleToggleFavorite}
                    />
                )}

                {pokemon?.stats && <StatsChart stats={pokemon.stats} />}
            </div>

            <Footer />
        </div>
    );
};

export default PokemonDetail;
