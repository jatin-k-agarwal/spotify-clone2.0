import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Error, Loader, SongCard } from '../components';
import { selectGenreListId } from '../redux/features/playerSlice';
import { useGetSongsByGenreQuery } from '../redux/services/shazamCore';
import { genres } from '../assets/constants';

const Discover = () => {
  const dispatch = useDispatch();
  const { genreListId, activeSong, isPlaying } = useSelector((state) => state.player);

  const validGenre = genres.find((g) => g.value === genreListId);
const selectedGenre = validGenre ? validGenre.value : 'POP';


  const {
    data: songs,
    isFetching,
    error,
  } = useGetSongsByGenreQuery(selectedGenre);

  const genreTitle = genres.find(({ value }) => value === selectedGenre)?.title || 'Pop';

  if (isFetching) return <Loader title="Loading songs..." />;

  if (error) {
    console.error('Discover → error:', error);

    const statusCode = error?.status || 500;
    const message =
      error?.data?.message || error?.error || 'Too many requests or unknown error.';

    return (
      <div className="text-white p-4">
        <p className="text-xl font-bold">Oops! Something went wrong.</p>
        <p className="mt-2 text-sm text-red-400">
          Error {statusCode}: {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">
          Discover <span className="text-yellow-400">{genreTitle}</span>
        </h2>

        <select
          onChange={(e) => dispatch(selectGenreListId(e.target.value))}
          value={selectedGenre}
          className="bg-zinc-800 text-gray-200 p-3 text-sm rounded-lg outline-none sm:mt-0 mt-5 cursor-pointer"
        >
          {genres.map((genre) => (
            <option key={genre.value} value={genre.value}>
              {genre.title}
            </option>
          ))}
        </select>
      </div>

      {/* Songs Grid */}
      <div className="flex flex-wrap sm:justify-start justify-center gap-8">
        {songs?.map((song, i) => (
          <SongCard
            key={song.key || `${song.title}-${i}`}
            song={song}
            isPlaying={isPlaying}
            activeSong={activeSong}
            data={songs}
            i={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Discover;
