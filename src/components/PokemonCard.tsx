import React from "react";
import { Link } from "react-router-dom";

interface PokemonCardProps {
    name: string;
    image: string;
    height: number;
    weight: number;
    types: string[];
    isFavorite: boolean;
    toggleFavorite: (pokemon: string) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, image, height, weight, types, isFavorite, toggleFavorite }) => {
    return (
        <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-80 text-center border-2 border-gray-600">
            <h1 className="text-2xl font-bold mb-4 capitalize">{name}</h1>
            <img src={image} alt={name} className="mx-auto w-40 h-40 mb-4" />
            <p className="text-lg"><strong>Height:</strong> {height} M</p>
            <p className="text-lg"><strong>Weight:</strong> {weight} KG</p>
            <p className="text-lg"><strong>Types:</strong> {types.join(", ")}</p>

            <div className="flex items-center justify-between w-full mt-4">
                <button
                    onClick={() => toggleFavorite(name)}
                    className={`px-4 py-2 rounded ${isFavorite ? 'bg-red-500' : 'bg-gray-600'} text-white hover:bg-gray-700`}
                >
                    {isFavorite ? "Unfavorite" : "Favorite"}
                </button>

                <Link
                    to={`/`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Return
                </Link>
            </div>
        </div>
    );
};

export default PokemonCard;
