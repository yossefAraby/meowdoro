
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const BusinessCanvas = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Meowdoro Business Model Canvas</h1>
      <p className="text-muted-foreground mb-8">
        A comprehensive business model canvas for the Meowdoro productivity platform
      </p>

      <div className="grid grid-cols-1 gap-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="offering">Value Offering</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Meowdoro Business Model Canvas Overview</CardTitle>
                <CardDescription>
                  A productivity platform that combines the Pomodoro technique with a playful cat companion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold text-primary">The Meowdoro Project</h2>
                      <p className="text-muted-foreground">
                        Enhancing productivity with a feline touch
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Key Partnerships</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Productivity app integrations</li>
                          <li>Educational institutions</li>
                          <li>Remote work companies</li>
                          <li>AI technology providers</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Key Activities</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Platform development</li>
                          <li>AI companion enhancement</li>
                          <li>User experience refinement</li>
                          <li>Content creation for productivity</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Value Propositions</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Engaging Pomodoro technique</li>
                          <li>Personalized productivity insights</li>
                          <li>AI-enhanced companion for motivation</li>
                          <li>Simplified task management</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Customer Relationships</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Self-service platform</li>
                          <li>Community engagement</li>
                          <li>Personalized recommendations</li>
                          <li>Regular feature updates</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Customer Segments</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Students</li>
                          <li>Remote workers</li>
                          <li>Freelancers</li>
                          <li>Knowledge workers</li>
                          <li>Cat enthusiasts</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Key Resources</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Development team</li>
                          <li>AI technology integration</li>
                          <li>User data</li>
                          <li>Cat-themed design assets</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Channels</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Web application</li>
                          <li>Mobile apps (future)</li>
                          <li>Social media</li>
                          <li>Productivity blogs & forums</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Cost Structure</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Development costs</li>
                          <li>AI technology integration</li>
                          <li>Server infrastructure</li>
                          <li>Marketing expenses</li>
                        </ul>
                      </div>

                      <div className="bg-accent p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Revenue Streams</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Freemium model</li>
                          <li>Premium subscriptions</li>
                          <li>Team/enterprise licenses</li>
                          <li>Partnerships & integrations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Customer Tab */}
          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Elements</CardTitle>
                <CardDescription>
                  Understanding our customers, relationships, and segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <div className="space-y-8">
                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Customer Segments</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Students</h4>
                          <p className="text-muted-foreground">High school, college, and graduate students balancing coursework, projects, and exams who need structured study methods.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Remote Workers</h4>
                          <p className="text-muted-foreground">Professionals working from home who face distractions and need to maintain focus throughout their workday.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Freelancers</h4>
                          <p className="text-muted-foreground">Self-employed individuals managing multiple projects who need to optimize their billable hours and productivity.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Knowledge Workers</h4>
                          <p className="text-muted-foreground">Professionals in fields requiring deep focus and cognitive work who need to manage mental fatigue.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Cat Enthusiasts</h4>
                          <p className="text-muted-foreground">People who appreciate cat-themed applications and find joy in the gamified feline companion aspect.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Customer Relationships</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Self-Service Platform</h4>
                          <p className="text-muted-foreground">Users can access all features independently without requiring assistance, enhancing accessibility and user autonomy.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Community Engagement</h4>
                          <p className="text-muted-foreground">Building an active community of users who share productivity tips, experiences, and suggestions for platform improvement.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Personalized Experience</h4>
                          <p className="text-muted-foreground">The AI-powered cat companion will learn user patterns and provide customized productivity recommendations.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Regular Updates</h4>
                          <p className="text-muted-foreground">Continuous improvement based on user feedback, with transparent communication about new features and enhancements.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Channels</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Web Application</h4>
                          <p className="text-muted-foreground">Primary platform delivery through an accessible, responsive web application that works across devices.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Mobile Applications (Future)</h4>
                          <p className="text-muted-foreground">Planned expansion to native mobile apps to enhance accessibility and provide offline capabilities.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Social Media Presence</h4>
                          <p className="text-muted-foreground">Active engagement on platforms where our target audience seeks productivity content and solutions.</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Productivity Communities</h4>
                          <p className="text-muted-foreground">Participation in forums, blogs, and communities focused on productivity, time management, and work habits.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Value Offering Tab */}
          <TabsContent value="offering">
            <Card>
              <CardHeader>
                <CardTitle>Value Propositions</CardTitle>
                <CardDescription>
                  Our unique value offerings and differentiators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <div className="space-y-6">
                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Core Value Propositions</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Engaging Pomodoro Technique Implementation</h4>
                          <p className="text-muted-foreground">Meowdoro transforms the standard Pomodoro technique into an engaging experience with visual feedback, sound cues, and a companion that responds to your work patterns.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">AI-Enhanced Cat Companion</h4>
                          <p className="text-muted-foreground">Unlike standard productivity tools, Meowdoro features an intelligent cat companion that provides motivation, personalized productivity tips, and emotional support during work sessions.</p>
                          <p className="text-muted-foreground mt-2">The upcoming AI enhancement will allow the cat to learn from user habits, offer more contextual advice, and provide increasingly personalized productivity suggestions.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Simplified Task Management</h4>
                          <p className="text-muted-foreground">A minimalist, distraction-free approach to task management that focuses on what matters most without overwhelming users with excessive features.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Productivity Insights and Analytics</h4>
                          <p className="text-muted-foreground">Data-driven insights into work patterns, focus periods, and productivity trends, helping users optimize their work habits over time.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Problem-Solution Fit</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Problem: Maintaining Focus in Distracting Environments</h4>
                          <p className="text-muted-foreground">Solution: Structured time blocks with visual and audio cues that create a rhythm for deep work, complemented by an engaging companion that encourages staying on task.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Problem: Productivity Fatigue and Burnout</h4>
                          <p className="text-muted-foreground">Solution: Enforced break periods, gentle reminders from the cat companion, and a system designed to balance productivity with wellbeing.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Problem: Task Management Overwhelm</h4>
                          <p className="text-muted-foreground">Solution: A simplified, visual approach to task organization that reduces cognitive load while maintaining functionality.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Problem: Lack of Motivation and Accountability</h4>
                          <p className="text-muted-foreground">Solution: The cat companion provides emotional engagement and accountability, with future AI enhancements bringing even more personalized motivation.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Competitive Advantages</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Emotional Connection</h4>
                          <p className="text-muted-foreground">The cat companion creates an emotional bond that standard productivity apps lack, increasing user retention and satisfaction.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Balance of Playfulness and Productivity</h4>
                          <p className="text-muted-foreground">While serious about productivity outcomes, Meowdoro's approach incorporates elements of play and delight that reduce resistance to productivity systems.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Future-Oriented AI Integration</h4>
                          <p className="text-muted-foreground">The planned AI enhancements will create increasingly personalized experiences that adapt to individual work styles, learning patterns, and preferences.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Design-Forward Approach</h4>
                          <p className="text-muted-foreground">Beautiful, accessible interface that prioritizes user experience and visual appeal above feature bloat.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Components</CardTitle>
                <CardDescription>
                  The backbone of our operations: resources, activities, and partnerships
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <div className="space-y-8">
                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Key Resources</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Development Team</h4>
                          <p className="text-muted-foreground">Software engineers, UI/UX designers, and product managers who build and maintain the Meowdoro platform.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">AI Technology</h4>
                          <p className="text-muted-foreground">For the upcoming AI-enhanced cat companion, machine learning models and natural language processing capabilities to provide personalized guidance.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">User Data and Analytics</h4>
                          <p className="text-muted-foreground">Secure storage and processing of user productivity data to drive insights and feature development.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Digital Infrastructure</h4>
                          <p className="text-muted-foreground">Cloud servers, databases, and web services that power the application across devices and user scenarios.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Cat-Themed Design Assets</h4>
                          <p className="text-muted-foreground">Unique and engaging visual elements that establish brand identity and create emotional connection.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Key Activities</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Platform Development and Maintenance</h4>
                          <p className="text-muted-foreground">Continuous improvement of the core platform features, performance optimization, and bug fixes.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">AI Companion Enhancement</h4>
                          <p className="text-muted-foreground">Development and training of machine learning models to power the intelligent cat companion, creating increasingly personalized interactions.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">User Experience Research</h4>
                          <p className="text-muted-foreground">Gathering and analyzing user feedback to identify pain points and opportunities for platform improvement.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Content Creation for Productivity</h4>
                          <p className="text-muted-foreground">Developing helpful productivity tips, guides, and resources that the cat companion can deliver to users.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Community Building</h4>
                          <p className="text-muted-foreground">Fostering a supportive user community that shares experiences, tips, and creates network effects for platform growth.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Key Partnerships</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Productivity App Integrations</h4>
                          <p className="text-muted-foreground">Partnerships with complementary productivity tools to create seamless workflows for users across platforms.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Educational Institutions</h4>
                          <p className="text-muted-foreground">Collaborations with schools and universities to introduce the Pomodoro technique and Meowdoro to students.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Remote Work Companies</h4>
                          <p className="text-muted-foreground">Partnerships with organizations that support remote workers to provide productivity solutions for distributed teams.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">AI Technology Providers</h4>
                          <p className="text-muted-foreground">Collaborations with AI platforms and researchers to enhance the capabilities of the cat companion.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Productivity Content Creators</h4>
                          <p className="text-muted-foreground">Partnerships with bloggers, YouTubers, and influencers in the productivity space to reach relevant audiences.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Elements</CardTitle>
                <CardDescription>
                  Understanding our revenue streams and cost structure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh] rounded-md border p-4">
                  <div className="space-y-8">
                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Revenue Streams</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Freemium Model</h4>
                          <p className="text-muted-foreground">Basic features available for free to all users, creating a large user base and platform awareness.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Premium Subscriptions</h4>
                          <p className="text-muted-foreground">Monthly and annual subscription tiers offering enhanced features, additional customization options, and advanced productivity analytics.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Team and Enterprise Licenses</h4>
                          <p className="text-muted-foreground">Multi-user packages for teams and organizations with additional collaboration features and administrative controls.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">AI Companion Enhancements</h4>
                          <p className="text-muted-foreground">Specialized premium features for the AI-powered cat companion offering deeper personalization and advanced support.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Strategic Partnerships</h4>
                          <p className="text-muted-foreground">Revenue through integration with complementary productivity platforms and co-marketing opportunities.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Cost Structure</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Development Expenses</h4>
                          <p className="text-muted-foreground">Costs associated with software development, including engineering talent, design resources, and quality assurance.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">AI Technology Integration</h4>
                          <p className="text-muted-foreground">Investment in machine learning infrastructure, model training, and ongoing AI capabilities enhancement for the cat companion.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Server and Cloud Infrastructure</h4>
                          <p className="text-muted-foreground">Costs of hosting, data storage, processing, and scaling platform capabilities as user base grows.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Marketing and User Acquisition</h4>
                          <p className="text-muted-foreground">Expenses related to reaching new users through various channels, content creation, and community building.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Customer Support</h4>
                          <p className="text-muted-foreground">Resources required to maintain high-quality user support, feedback processing, and issue resolution.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Administrative Overhead</h4>
                          <p className="text-muted-foreground">General business operations costs including legal, accounting, and management expenses.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold text-primary mb-4">Financial Strategy</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Growth-Oriented Investment</h4>
                          <p className="text-muted-foreground">Initial focus on user acquisition and platform development with longer-term monetization strategy.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Value-Based Pricing</h4>
                          <p className="text-muted-foreground">Premium features priced according to the demonstrable productivity improvements they deliver to users.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Strategic AI Investment</h4>
                          <p className="text-muted-foreground">Focused allocation of resources to develop the AI cat companion as a key differentiator and value driver.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Scalable Infrastructure</h4>
                          <p className="text-muted-foreground">Cloud-based approach that allows costs to scale in alignment with user growth and revenue.</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium">Lean Operations</h4>
                          <p className="text-muted-foreground">Maintaining efficiency in overhead and focusing resources on product development and user experience.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Upcoming AI-Powered Cat Companion Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-medium">Personalized Coaching</h4>
              <p className="text-sm text-muted-foreground">The AI-powered cat companion will learn user habits and provide tailored productivity advice based on individual patterns.</p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-medium">Contextual Assistance</h4>
              <p className="text-sm text-muted-foreground">Intelligent suggestions based on current tasks, time of day, and historical productivity patterns.</p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-medium">Emotional Support</h4>
              <p className="text-sm text-muted-foreground">Recognition of user frustration or fatigue with appropriate encouragement and break suggestions.</p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <h4 className="font-medium">Advanced Analytics</h4>
              <p className="text-sm text-muted-foreground">AI-driven insights that identify optimal work periods, task completion patterns, and productivity opportunities.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BusinessCanvas;
