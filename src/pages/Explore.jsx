import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import CategoryCard from '../components/Cards/CategoryCard';
import PlaylistCard from '../components/Cards/PlaylistCard';
import PlaylistDetail from '../components/Common/PlaylistDetail';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Explore = () => {
  const { state } = useLocation();

  // State management
  const [categories, setCategories] = useState([]);
  const [browseItems, setBrowseItems] = useState([]);
  const [browseSections, setBrowseSections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [playlistDetail, setPlaylistDetail] = useState(null);
  const [requestState, setRequestState] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [playlistError, setPlaylistError] = useState(null);
  const [showPlaylistDetail, setShowPlaylistDetail] = useState(false);
  const [browseSectionEl, setBrowseSectionEl] = useState(null);

  // Configuration
  const CATEGORY_API_URL = import.meta.env.VITE_CATEGORY_API_URL || 'http://31.97.110.129:7001/api/vv1/category';
  const HOME_API_URL = import.meta.env.VITE_HOME_API_URL || 'http://31.97.110.129:7001/api/vv1/home';
  const PLAYLIST_DETAIL_API_URL = import.meta.env.VITE_PLAYLIST_DETAIL_API_URL || 'http://31.97.110.129:7001/api/vv1/category/collections/album-playlist-by-id';

  // Helper to fetch JSON
  const fetchJson = useCallback(async (url, signal) => {
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
      const error = new Error(`Invalid JSON from ${url}: ${parseError.message}`);
      error.cause = parseError;
      throw error;
    }
  }, []);

  // Load categories and browse items
  const loadCategoryData = useCallback(async (signal) => {
    setRequestState('loading');
    setErrorMessage('');

    try {
      const [categoryJson, homeJson] = await Promise.all([
        fetchJson(CATEGORY_API_URL, signal),
        fetchJson(HOME_API_URL, signal),
      ]);

      if (categoryJson?.data?.status === false) {
        throw new Error(categoryJson?.data?.message || 'API returned an unsuccessful response');
      }

      const categoryData = categoryJson?.data?.data;
      const categoryList = Array.isArray(categoryData?.categories) ? categoryData.categories : [];
      const itemsList = Array.isArray(categoryData?.items) ? categoryData.items : [];
      const sectionList = Array.isArray(homeJson?.data?.data) ? homeJson.data.data : [];

      setCategories(categoryList);
      setBrowseItems(itemsList);
      setBrowseSections(sectionList);
      setRequestState('success');
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Failed to load category data:', error);
      setBrowseItems([]);
      setErrorMessage(error?.message || 'Failed to load category data');
      setRequestState('error');
    }
  }, [fetchJson, CATEGORY_API_URL, HOME_API_URL]);

  // Load playlist/album details
  const loadPlaylistDetail = useCallback(async (playlistId, signal) => {
    setPlaylistLoading(true);
    setPlaylistError(null);

    try {
      const detailUrl = `${PLAYLIST_DETAIL_API_URL}/${playlistId}`;
      const json = await fetchJson(detailUrl, signal);

      if (!json?.data?.success && json?.data?.status !== false) {
        throw new Error(json?.data?.message || 'Failed to fetch playlist details');
      }

      const data = json?.data?.data || json?.data;
      setPlaylistDetail({
        collection: data.collection,
        songs: Array.isArray(data.songs) ? data.songs : [],
      });
      setShowPlaylistDetail(true);
      setPlaylistLoading(false);
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }

      console.error('Failed to load playlist detail:', error);
      setPlaylistError(error?.message || 'Failed to load playlist details');
      setPlaylistLoading(false);
      setShowPlaylistDetail(false);
    }
  }, [fetchJson, PLAYLIST_DETAIL_API_URL]);

  // Initialize - load categories ONCE on mount
  useEffect(() => {
    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        loadCategoryData(controller.signal);
      }
    });

    return () => {
      controller.abort();
    };
  }, [loadCategoryData]);

  // Handle navigation state from Home - load playlist if clicked from Home
  useEffect(() => {
    if (state?.item?.id && (state?.redirectType === 'playlist' || state?.redirectType === 'album')) {
      console.log('Loading playlist from Home click:', state.item.id);
      const controller = new AbortController();
      Promise.resolve().then(() => {
        if (!controller.signal.aborted) {
          loadPlaylistDetail(state.item.id, controller.signal);
        }
      });

      return () => {
        controller.abort();
      };
    }
  }, [state?.item?.id, state?.redirectType, loadPlaylistDetail]);

  // Handle category selection
  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category.name);
    setSelectedCategory(category);
    setShowPlaylistDetail(false);
    if (browseSectionEl) {
      browseSectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle back button from playlist detail
  const handleBackFromPlaylist = () => {
    console.log('Back from playlist');
    setShowPlaylistDetail(false);
    setPlaylistDetail(null);
    setSelectedCategory(null);
  };

  // Handle clicking a browse item
  const handleBrowseItemClick = (item) => {
    console.log('Browse item clicked:', item.name || item.title, item.type);
    // Check if item is a playlist or album using the 'type' field from API
    if (item.type === 'PLAYLIST' || item.type === 'ALBUM' || item.redirectType === 'playlist' || item.redirectType === 'album') {
      const controller = new AbortController();
      loadPlaylistDetail(item.id, controller.signal);
    } else {
      console.warn('Item is not a playlist or album:', item);
    }
  };

  const handleRetry = () => {
    const controller = new AbortController();
    loadCategoryData(controller.signal);
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
  };

  const visibleBrowseItems = (() => {
    if (!selectedCategory) {
      return browseItems;
    }

    const matchedSection = browseSections.find((section) => section.id === selectedCategory.id)
      || browseSections.find((section) => section.type === selectedCategory.type)
      || null;

    if (Array.isArray(matchedSection?.items) && matchedSection.items.length > 0) {
      return matchedSection.items;
    }

    return browseItems;
  })();

  const browseHeading = selectedCategory ? `${selectedCategory.name} Playlists` : 'Discover More';

  // VIEW 1: If a playlist/album detail is loaded and showing
  if (showPlaylistDetail && playlistDetail) {
    return (
      <PlaylistDetail
        collection={playlistDetail.collection}
        songs={playlistDetail.songs}
        onBack={handleBackFromPlaylist}
        loading={playlistLoading}
        error={playlistError}
      />
    );
  }

  // VIEW 2: Loading state
  if (requestState === 'loading') {
    return (
      <div className="min-h-[60svh] pt-10 pb-36 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // VIEW 3: Error state
  if (requestState === 'error') {
    return (
      <div className="px-4 pb-36 text-white/80">
        <p className="mb-3">{errorMessage || 'Unable to load explore data.'}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 rounded-full border border-white/30 text-sm hover:bg-white/10 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  // VIEW 4: Main explore view with categories and browse items
  return (
    <div className="pb-36">
      {/* Categories Grid */}
      <section className="px-4 mb-8">
        <h2 className="text-white text-2xl font-bold mb-6">Browse Categories</h2>
        
        {categories.length === 0 ? (
          <div className="text-white/60 py-8">No categories available</div>
        ) : (
          <div className="grid justify-center gap-3 grid-cols-3 sm:grid-cols-[repeat(auto-fit,minmax(245px,245px))]">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory?.id === category.id}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Browse Items / Playlists Section */}
      <section className="px-4" ref={setBrowseSectionEl}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-white text-2xl font-bold">
              {browseHeading}
            </h2>
            {selectedCategory?.description && (
              <p className="mt-2 text-white/60 text-sm leading-relaxed max-w-xl">
                {selectedCategory.description}
              </p>
            )}
          </div>

          {selectedCategory && (
            <button
              onClick={handleClearCategory}
              className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition"
            >
              <X size={14} />
              Show all
            </button>
          )}
        </div>

        {visibleBrowseItems.length === 0 ? (
          <div className="text-white/60 py-8">No items available</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {visibleBrowseItems.map((item) => (
              <PlaylistCard
                key={item.id}
                playlist={item}
                onClick={() => handleBrowseItemClick(item)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Explore;
