'use client';
import Link from "next/link";
import { FiSearch, FiX } from 'react-icons/fi'; // Import the X icon
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import { useSearch } from "@/context/SearchContext";

const Header = () => {
  const { setSearchQuery, searchQuery, availableTags } = useSearch();

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery(''); // Reset search query
  };

  // Sort availableTags alphabetically and filter based on search query
  const filteredTags = availableTags
    .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort()
    .slice(0, 5);

  return (
    <header
      className="px-4 py-4 flex justify-between items-center w-full"
      style={{ boxShadow: '0px 1px 0px rgba(229, 231, 235, 0.5)' }}
    >
      <div className="flex-1">
        <Link href="/">
          <div className="cursor-pointer">
            <Image
              src="/räddit.png"
              alt="Räddit Logo"
              width={100}
              height={40}
            />
          </div>
        </Link>
      </div>
      <div className="flex-1 text-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search" 
            className="border rounded-full pl-10 pr-10 py-2 w-full text-sm text-white bg-gray-800"
            value={searchQuery} // Bind input value to search query
            onChange={handleSearchInputChange} 
          />
          {searchQuery && (
            <FiX 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white"
              onClick={handleClearSearch} // Clear the search input when X is clicked
            />
          )}
        </div>

        {/* Display matching tags */}
        {filteredTags.length > 0 && (
          <div className="mt-2">
            <div className="flex flex-wrap gap-2">
              {filteredTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)} // Set search query when tag is clicked
                  className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded mr-1 hover:bg-blue-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 text-right">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-red-600 text-white rounded-full hover:bg-red-700 px-4 py-2 text-sm">Log in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Header;
