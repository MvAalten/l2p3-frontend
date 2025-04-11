import React from 'react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (

        <input
            type="text"
            placeholder="Search a Pokémon"
            value={value}
            onChange={(e) => onChange(e.target.value)}

            className="mb-6 w-full p-3 bg-gray-800 text-white rounded-md"
        />
    );
};

export default SearchBar;
