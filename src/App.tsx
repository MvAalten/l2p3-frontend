import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import PokemonDetail from "./components/PokemonDetail";

function App() {
    const [favorites, setFavorites] = useState<string[]>([]);

    const toggleFavorite = (pokemon: string) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(pokemon)
                ? prevFavorites.filter((fav) => fav !== pokemon)
                : [...prevFavorites, pokemon]
        );
    };

    return (
        <Router>
            <div className="bg-gray-900 min-h-screen text-white">
                <Routes>
                    <Route
                        path="/"
                        element={<HomePage favorites={favorites} toggleFavorite={toggleFavorite} />}
                    />
                    <Route
                        path="/pokemon/:name"
                        element={
                            <PokemonDetail
                                favorites={favorites}
                                toggleFavorite={toggleFavorite}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
