import React from 'react';
import { Heart } from 'lucide-react';
import { Dog } from '../types';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dogId: string) => void;
}

export default function DogCard({ dog, isFavorite, onToggleFavorite }: DogCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={dog.img}
          alt={dog.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => onToggleFavorite(dog.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={`w-6 h-6 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{dog.name}</h3>
        <div className="mt-2 space-y-1">
          <p className="text-gray-600">
            <span className="font-medium">Breed:</span> {dog.breed}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Age:</span> {dog.age} years
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {dog.zip_code}
          </p>
        </div>
      </div>
    </div>
  );
}