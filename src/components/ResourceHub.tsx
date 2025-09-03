import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Play, 
  Headphones, 
  BookOpen, 
  Globe, 
  Download,
  Search,
  Star,
  Clock,
  Heart,
  X
} from "lucide-react";

interface ResourceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'guide' | 'article';
  duration?: string;
  rating: number;
  language: string;
  category: string;
  url?: string;
}

const ResourceHub = ({ isOpen, onClose }: ResourceProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Mindful Breathing for Anxiety',
      description: 'Learn deep breathing techniques to manage anxiety and panic attacks.',
      type: 'video',
      duration: '8 mins',
      rating: 4.8,
      language: 'English',
      category: 'Anxiety',
      url: 'https://www.youtube.com/embed/YRPh_GaiL8s'
    },
    {
      id: '2',
      title: 'Sleep Meditation: Body Scan',
      description: 'Guided body scan meditation to help you fall asleep naturally.',
      type: 'audio',
      duration: '15 mins',
      rating: 4.9,
      language: 'English',
      category: 'Sleep'
    },
    {
      id: '3',
      title: 'Managing Academic Stress',
      description: 'Practical strategies for handling academic pressure and deadlines.',
      type: 'guide',
      duration: '5 min read',
      rating: 4.7,
      language: 'English',
      category: 'Academic'
    },
    {
      id: '4',
      title: 'मानसिक स्वास्थ्य की देखभाल',
      description: 'मानसिक स्वास्थ्य की मूल बातें और दैनिक अभ्यास',
      type: 'article',
      duration: '7 min read',
      rating: 4.6,
      language: 'Hindi',
      category: 'General'
    },
    {
      id: '5',
      title: 'Progressive Muscle Relaxation',
      description: 'Step-by-step guide to releasing physical tension and stress.',
      type: 'audio',
      duration: '12 mins',
      rating: 4.8,
      language: 'English',
      category: 'Relaxation'
    },
    {
      id: '6',
      title: 'Building Healthy Relationships',
      description: 'Communication skills and boundary setting for better relationships.',
      type: 'video',
      duration: '12 mins',
      rating: 4.5,
      language: 'English',
      category: 'Relationships'
    },
    {
      id: '7',
      title: 'Depression Self-Help Toolkit',
      description: 'Evidence-based strategies for managing depressive symptoms.',
      type: 'guide',
      duration: '10 min read',
      rating: 4.9,
      language: 'English',
      category: 'Depression'
    },
    {
      id: '8',
      title: 'মানসিক চাপ কমানোর উপায়',
      description: 'মানসিক চাপ কমানোর জন্য সহজ কৌশল এবং ব্যায়াম',
      type: 'article',
      duration: '6 min read',
      rating: 4.4,
      language: 'Bengali',
      category: 'Stress'
    }
  ];

  const categories = ['all', 'Anxiety', 'Sleep', 'Academic', 'Depression', 'Stress', 'Relaxation', 'Relationships'];
  const languages = ['All', 'English', 'Hindi', 'Bengali', 'Spanish', 'French'];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'audio': return <Headphones className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'article': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'audio': return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'guide': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'article': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-glow">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-calm rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Psychoeducational Resource Hub</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  <span>Multilingual Resources & Guides</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="audio">Audio</TabsTrigger>
              <TabsTrigger value="guides">Guides</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="p-6 hover:shadow-card transition-shadow">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge className={`${getTypeColor(resource.type)} flex items-center gap-1`}>
                          {getIcon(resource.type)}
                          {resource.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          {resource.rating}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground line-clamp-2">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">{resource.description}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {resource.language}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          {resource.type === 'video' || resource.type === 'audio' ? (
                            <>
                              <Play className="h-3 w-3 mr-1" />
                              Play
                            </>
                          ) : (
                            <>
                              <BookOpen className="h-3 w-3 mr-1" />
                              Read
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="video" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.filter(r => r.type === 'video').map((resource) => (
                  <Card key={resource.id} className="p-6">
                    <div className="space-y-4">
                      {resource.url && (
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <iframe 
                            src={resource.url}
                            className="w-full h-full rounded-lg"
                            title={resource.title}
                            allowFullScreen
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="audio" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredResources.filter(r => r.type === 'audio').map((resource) => (
                  <Card key={resource.id} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                          <Headphones className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{resource.title}</h4>
                          <p className="text-sm text-muted-foreground">{resource.duration}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                      <Button size="sm" className="w-full">
                        <Play className="h-3 w-3 mr-2" />
                        Play Audio
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-4">
              <div className="space-y-4">
                {filteredResources.filter(r => r.type === 'guide' || r.type === 'article').map((resource) => (
                  <Card key={resource.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold text-foreground">{resource.title}</h4>
                          <Badge variant="outline" className="ml-2">
                            {resource.language}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{resource.duration}</span>
                          <div className="flex gap-2">
                            <Button size="sm">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Read Guide
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-primary-soft/20 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-primary" />
              <span>All resources are curated by mental health professionals and regularly updated.</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResourceHub;