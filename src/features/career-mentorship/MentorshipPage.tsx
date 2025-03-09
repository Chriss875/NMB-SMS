import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, BookOpen, Calendar, Clock, ChevronLeft, Bookmark, GraduationCap, ImageOff } from 'lucide-react';
import { mentorshipService, MentorshipArticle } from '@/services/mentorshipService';
import { Badge } from '@/components/ui/badge';

// Helper function to format date
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Default placeholder images by category
const categoryPlaceholders: Record<string, string> = {
  'Internships': '/images/placeholders/internship.jpg',
  'Networking': '/images/placeholders/networking.jpg',
  'Interviews': '/images/placeholders/interview.jpg',
  'Job Search': '/images/placeholders/job-search.jpg',
  'default': '/images/placeholders/career-default.jpg'
};

// Default placeholder if no category match or file is missing
const DEFAULT_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjQwMCIgeT0iMjAwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Y2EzYWYiPkNhcmVlciBNZW50b3JzaGlwPC90ZXh0Pjwvc3ZnPg==';

// Banner placeholder image
const BANNER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzFkNGVkOCIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMjAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0idXJsKCNncmFkKSIvPjxwYXRoIGQ9Ik04MDAgMjAwIEw5MDAgMjUwIEw5MDAgMTUwIFoiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMiIvPjxjaXJjbGUgY3g9IjMwMCIgY3k9IjIwMCIgcj0iODAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMiIvPjx0ZXh0IHg9IjYwMCIgeT0iMjIwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNjQiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjZmZmZmZmIj5DYXJlZXIgRGV2ZWxvcG1lbnQ8L3RleHQ+PC9zdmc+';

const MentorshipPage: React.FC = () => {
  const [articles, setArticles] = useState<MentorshipArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<MentorshipArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const data = await mentorshipService.getAllArticles();
        setArticles(data);
        setError(null);
      } catch (err) {
        setError('Failed to load mentorship articles');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  const handleViewArticle = (article: MentorshipArticle) => {
    setSelectedArticle(article);
    // Scroll to top when viewing article
    window.scrollTo(0, 0);
  };
  
  const handleBackToList = () => {
    setSelectedArticle(null);
  };
  
  const handleImageError = (id: string) => {
    setImageErrors(prev => ({
      ...prev,
      [id]: true
    }));
  };
  
  // Function to get appropriate image based on category or fallback
  const getImage = (article: MentorshipArticle) => {
    if (imageErrors[article.id]) {
      // If image previously errored, use category placeholder or default
      return categoryPlaceholders[article.category] || DEFAULT_IMAGE;
    }
    return article.imageUrl;
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Career Mentorship</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="w-full h-48 bg-gray-200 animate-pulse" />
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </MainLayout>
    );
  }
  
  if (error) {
    return (
      <MainLayout>
        <h1 className="text-2xl font-semibold text-gray-700 mb-6">Career Mentorship</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-700">Career Mentorship</h1>
          {selectedArticle && (
            <Button 
              variant="outline" 
              onClick={handleBackToList}
              size="sm"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to articles
            </Button>
          )}
        </div>
      
        {!selectedArticle ? (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 md:p-8 rounded-lg mb-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">Career Development Resources</h2>
                  <p className="text-blue-100 mb-4 md:max-w-xl">
                    Access expert advice, industry insights, and professional development resources to help advance your career.
                  </p>
                  <div className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    <span>Updated regularly with new content</span>
                  </div>
                </div>
                <div className="w-full md:w-80 h-48 rounded-lg overflow-hidden">
                  <img 
                    src={BANNER_IMAGE} 
                    alt="Career Mentorship" 
                    className="w-full h-full object-cover shadow-lg" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {articles.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={getImage(article)} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={() => handleImageError(article.id)}
                    />
                    {imageErrors[article.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                        <div className="flex flex-col items-center text-gray-500">
                          <ImageOff className="h-8 w-8 mb-2" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-800 shadow-sm">
                        {article.category}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2 flex-grow">
                    <p className="text-gray-600 mb-4">{article.summary}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        By {article.author}
                      </span>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(article.date)}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-blue-600 hover:text-blue-800 p-0"
                      onClick={() => handleViewArticle(article)}
                    >
                      Read more <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6 mb-8">
            <Card className="overflow-hidden">
              <div className="w-full h-72 relative">
                <img 
                  src={getImage(selectedArticle)} 
                  alt={selectedArticle.title} 
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(selectedArticle.id)}
                />
                {imageErrors[selectedArticle.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
                    <div className="flex flex-col items-center text-gray-500">
                      <ImageOff className="h-12 w-12 mb-2" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right=0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <Badge variant="secondary" className="mb-2">
                    {selectedArticle.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedArticle.title}</h2>
                </div>
              </div>
              
              <CardContent className="pt-6">
                <div className="flex items-center mb-6 pb-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {selectedArticle.author.substring(0, 1)}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{selectedArticle.author}</div>
                    {selectedArticle.authorTitle && (
                      <div className="text-sm text-gray-500">{selectedArticle.authorTitle}</div>
                    )}
                  </div>
                  <div className="ml-auto flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(selectedArticle.date)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{selectedArticle.readTime} read</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button variant="outline" className="gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save Article
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5" /> Related Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">Career Development</h3>
                    <p className="text-sm text-gray-500 mb-2">Workshop schedule and registration</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600">Learn More</Button>
                  </div>
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">Resume Templates</h3>
                    <p className="text-sm text-gray-500 mb-2">Field-specific templates and examples</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600">Download</Button>
                  </div>
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">Industry Mentorship</h3>
                    <p className="text-sm text-gray-500 mb-2">Apply to be matched with a mentor</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600">Apply Now</Button>
                  </div>
                  <div className="border rounded-md p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium mb-1">Alumni Network</h3>
                    <p className="text-sm text-gray-500 mb-2">Connect with scholarship alumni</p>
                    <Button variant="link" className="p-0 h-auto text-blue-600">View Directory</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MentorshipPage;