import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import MoodInput from "@/components/ui/MoodInput";
import LoadingState from "@/components/ui/LoadingState";
import PlaylistDisplay from "@/components/ui/PlaylistDisplay";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { apiRequest } from "@/lib/queryClient";
import { Playlist } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type LoadingStage = 'analyzing' | 'searching' | 'generating';

export default function Home() {
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>('analyzing');
  const { toast } = useToast();

  const generatePlaylistMutation = useMutation({
    mutationFn: async (mood: string): Promise<Playlist> => {
      // Simulate the different stages of playlist generation
      setLoadingStage('analyzing');
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      setLoadingStage('searching');
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      setLoadingStage('generating');
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));

      const response = await apiRequest('POST', '/api/generate-playlist', { mood });
      const playlist = await response.json();
      return playlist as Playlist;
    },
    onSuccess: (data: Playlist) => {
      setPlaylist(data);
      toast({
        title: "Playlist Generated!",
        description: `Created "${data.name}" with ${data.tracks.length} tracks`,
      });
    },
    onError: (error) => {
      console.error('Playlist generation error:', error);
      toast({
        title: "Error",
        description: "Failed to generate playlist. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleGeneratePlaylist = (mood: string) => {
    setPlaylist(null);
    generatePlaylistMutation.mutate(mood);
  };

  const handlePlayPause = (trackId: string) => {
    if (currentTrackId === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(trackId);
      setIsPlaying(true);
    }
    // In a real implementation, this would integrate with Spotify Web Player SDK
    console.log(`${isPlaying && currentTrackId === trackId ? 'Pausing' : 'Playing'} track:`, trackId);
  };

  const handleSharePlaylist = () => {
    if (playlist) {
      // In a real implementation, this would generate a shareable link
      navigator.clipboard.writeText(`Check out this playlist: ${playlist.name} - Generated from: "${playlist.moodPrompt}"`);
      toast({
        title: "Copied to clipboard!",
        description: "Playlist details copied. Share with your friends!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-end mb-8">
          <ThemeToggle />
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!generatePlaylistMutation.isPending && !playlist && (
            <MoodInput 
              onSubmit={handleGeneratePlaylist}
              isLoading={generatePlaylistMutation.isPending}
            />
          )}

          {generatePlaylistMutation.isPending && (
            <LoadingState stage={loadingStage} />
          )}

          {playlist && (
            <div className="space-y-6">
              <PlaylistDisplay
                playlist={playlist}
                currentTrackId={currentTrackId}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onSharePlaylist={handleSharePlaylist}
              />
              
              {/* Generate Another Button */}
              <div className="text-center">
                <MoodInput 
                  onSubmit={handleGeneratePlaylist}
                  isLoading={generatePlaylistMutation.isPending}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}