import React from 'react';
import Section from '../components/Sections/Section';
import HorizontalScroll from '../components/Sections/HorizontalScroll';
import PlaylistCard from '../components/Cards/PlaylistCard';
import ArtistCard from '../components/Cards/ArtistCard';
import SongListContainer from '../components/Sections/SongListContainer';
import { sections, artists, songs } from '../data/mockData';

const Home = () => {
  return (
    <div className="pb-36">
      {/* Happy Section */}
      <Section title="Happy" onViewAll={() => console.log('View all Happy')}>
        <HorizontalScroll>
          {sections.happy.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </HorizontalScroll>
      </Section>

      {/* Artist Section */}
      <Section title="Artist" onViewAll={() => console.log('View all Artist')}>
        <HorizontalScroll gapClassName="gap-3">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </HorizontalScroll>
      </Section>

      {/* Sleep Section */}
      <Section title="Sleep">
        <div className="px-4">
          <PlaylistCard
            playlist={sections.sleep[0]}
            variant="large"
          />
        </div>
      </Section>

      {/* Just Arrived Section */}
      <Section title="Just Arrived" titleWeight="light">
        <HorizontalScroll showIndicator={false}>
          <SongListContainer songs={songs.slice(0, 8)} theme="gray" title="Feel Good Indie" />
          <SongListContainer songs={songs.slice(8, 16)} theme="red" title="Hot Hits" />
          <SongListContainer songs={songs.slice(16, 24)} theme="purple" title="New Vibes" />
        </HorizontalScroll>
      </Section>

      {/* Top Charts Section */}
      <Section title="Top Charts" onViewAll={() => console.log('View all Top Charts')}>
        <HorizontalScroll>
          {sections.topCharts.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </HorizontalScroll>
      </Section>

      {/* Timeline 2010s Section */}
      <Section title="Timeline 2010s" onViewAll={() => console.log('View all Timeline 2010s')}>
        <HorizontalScroll>
          {sections.timeline2010s.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </HorizontalScroll>
      </Section>

      {/* Trending Playlist Section */}
      <Section title="Trending Playlist" onViewAll={() => console.log('View all Trending Playlist')}>
        <HorizontalScroll>
          {sections.trendingPlaylist.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </HorizontalScroll>
      </Section>
    </div>
  );
};

export default Home;
