import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Section from '../components/Sections/Section';
import HorizontalScroll from '../components/Sections/HorizontalScroll';
import PlaylistCard from '../components/Cards/PlaylistCard';
import ArtistCard from '../components/Cards/ArtistCard';
import SongListContainer from '../components/Sections/SongListContainer';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Home = () => {
  const navigate = useNavigate();
  const [homeSections, setHomeSections] = useState([]);
  const [requestState, setRequestState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const HOME_API_URL = import.meta.env.VITE_HOME_API_URL || '/api/vv1/home';
  const HOME_FALLBACK_URL = `${import.meta.env.BASE_URL}data.json`;

  const fetchJson = async (url, signal) => {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const text = await response.text();
    const trimmedText = text.trimStart();

    if (trimmedText.startsWith('<')) {
      throw new Error(`Expected JSON from ${url}, received HTML instead`);
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Invalid JSON from ${url}: ${parseError.message}`);
    }
  };

  const loadHomeData = useCallback(async (signal) => {
    setRequestState('loading');
    setErrorMessage('');

    try {
      let json;

      try {
        json = await fetchJson(HOME_API_URL, signal);
      } catch (primaryError) {
        console.warn('Primary home API failed, using fallback data:', primaryError);
        json = await fetchJson(HOME_FALLBACK_URL, signal);
      }

      if (json?.data?.status === false) {
        throw new Error(json?.data?.message || 'API returned an unsuccessful response');
      }

      const sections = json?.data?.data || [];
      setHomeSections(Array.isArray(sections) ? sections : []);
      setRequestState('success');
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Failed to load home data:', error);
      setHomeSections([]);
      setErrorMessage(error?.message || 'Failed to load home data');
      setRequestState('error');
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadHomeData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadHomeData]);

  const handleRetry = () => {
    const controller = new AbortController();
    loadHomeData(controller.signal);
  };

  const mapSongsForList = (songs = []) => {
    return songs.map((song) => ({
      id: song.id,
      title: song.title,
      image: song.thumbnail,
      artist: song.artist || 'Prime Music',
    }));
  };

  const handleItemClick = (item, section) => {
    const redirectType = item?.redirectType;
    const routeByType = {
      artist: '/explore',
      playlist: '/library',
      album: '/library',
      shorts: '/explore',
    };

    const targetPath = routeByType[redirectType] || '/explore';
    navigate(targetPath, {
      state: {
        redirectType,
        item,
        section,
      },
    });
  };

  const renderSectionContent = (section) => {
    const items = Array.isArray(section.items) ? section.items : [];

    if (items.length === 0) {
      return (
        <div className="px-4 text-white/60 text-sm">No items available</div>
      );
    }

    if (section.type === 'horizontal_artist_list') {
      return (
        <HorizontalScroll gapClassName="gap-3">
          {items.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onClick={() => handleItemClick(artist, section)}
            />
          ))}
        </HorizontalScroll>
      );
    }

    if (section.type === 'full_playlist_songs_horizontal_cards') {
      return (
        <HorizontalScroll showIndicator={true}>
          {items.map((playlist, index) => (
            <SongListContainer
              key={playlist.id || `${section.id}-${index}`}
              songs={mapSongsForList(playlist.songs || [])}
              title={playlist.title}
              theme={index % 3 === 0 ? 'gray' : index % 3 === 1 ? 'red' : 'purple'}
              onClick={() => handleItemClick(playlist, section)}
            />
          ))}
        </HorizontalScroll>
      );
    }

    return (
      <HorizontalScroll>
        {items.map((item) => (
          <PlaylistCard
            key={item.id}
            playlist={item}
            onClick={() => handleItemClick(item, section)}
          />
        ))}
      </HorizontalScroll>
    );
  };

  if (requestState === 'loading') {
    return (
      <div className="min-h-[60svh] pt-10 pb-36 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (requestState === 'error') {
    return (
      <div className="px-4 pb-36 text-white/80">
        <p className="mb-3">{errorMessage || 'Unable to load home data.'}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 rounded-full border border-white/30 text-sm hover:bg-white/10 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-36">
      {homeSections.map((section) => (
        <Section
          key={section.id}
          title={section.title}
          onViewAll={() => navigate('/explore', { state: { section } })}
          titleWeight={section.type === 'full_playlist_songs_horizontal_cards' ? 'light' : 'bold'}
          showDivider={section.type !== 'full_playlist_songs_horizontal_cards'}
        >
          {renderSectionContent(section)}
        </Section>
      ))}
    </div>
  );
};

export default Home;
