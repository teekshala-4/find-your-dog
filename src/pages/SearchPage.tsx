import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { getBreeds, searchDogs, getDogs, logout, matchDog } from '../api';
import { Dog } from '../types';
import DogCard from '../components/DogCard';
import SearchFilters from '../components/SearchFilters';

export default function SearchPage() {
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState<string[]>([]);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [ageRange, setAgeRange] = useState<{ min?: number; max?: number }>({});
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const breedList = await getBreeds();
        setBreeds(breedList);
      } catch (error) {
        toast.error('Failed to load breeds');
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    fetchDogs();
  }, [selectedBreeds, sortOrder, ageRange, currentPage]);

  const fetchDogs = async () => {
    setIsLoading(true);
    try {
      const searchParams = {
        breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined,
        ageMin: ageRange.min,
        ageMax: ageRange.max,
        sort: `breed:${sortOrder}`,
        size: 20,
        from: (currentPage - 1) * 20,
      };

      const searchResponse = await searchDogs(searchParams);
      const dogList = await getDogs(searchResponse.resultIds);
      setDogs(dogList);
      setTotalPages(Math.ceil(searchResponse.total / 20));
    } catch (error) {
      toast.error('Failed to load dogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleMatch = async () => {
    if (favorites.size === 0) {
      toast.error('Please select at least one dog to match');
      return;
    }

    try {
      const match = await matchDog(Array.from(favorites));
      const matchedDog = await getDogs([match.match]);
      toast.success(`You've been matched with ${matchedDog[0].name}!`);
    } catch (error) {
      toast.error('Failed to generate match');
    }
  };

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(dogId)) {
        next.delete(dogId);
      } else {
        next.add(dogId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Find Your Perfect Dog</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleMatch}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Generate Match ({favorites.size})
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SearchFilters
              breeds={breeds}
              selectedBreeds={selectedBreeds}
              onBreedsChange={setSelectedBreeds}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              ageRange={ageRange}
              onAgeRangeChange={setAgeRange}
            />
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dogs.map((dog) => (
                    <DogCard
                      key={dog.id}
                      dog={dog}
                      isFavorite={favorites.has(dog.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                <div className="mt-8 flex justify-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === i + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}