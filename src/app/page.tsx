import Link from 'next/link'
import { PageLayout, Container, Section, Grid, Flex } from "@/components/ui/layout"
import { Heading1, Heading2, Heading3, Text, Lead } from "@/components/ui/Typography"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, FeatureCard } from "@/components/ui/Card"
import { LibraryIcon, BookOpenIcon, PlusIcon, SearchIcon } from "@/components/ui/Icon"

export default function HomePage() {
  return (
    <PageLayout>
      <Container>
        {/* Hero Section */}
        <Section spacing="xl">
          <div className="text-center">
            <Flex justify="center" align="center" gap="sm" className="mb-6">
              <LibraryIcon size="xl" className="text-amber-600" />
              <Heading1>TBR Manager</Heading1>
            </Flex>
            <Lead className="max-w-2xl mx-auto mb-8">
              A visual, interactive book management system designed to organize and track your
              reading lists with a beautiful cork board aesthetic.
            </Lead>
            <Flex justify="center" gap="md" className="flex-col sm:flex-row">
              <Link href="/dashboard">
                <Button variant="primary" size="lg">
                  <BookOpenIcon size="md" />
                  Get Started
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </Flex>
          </div>
        </Section>

        {/* Features Section */}
        <Section spacing="lg">
          <Grid cols={3} gap="lg">
            <FeatureCard>
              <Flex justify="center" className="mb-4">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <LibraryIcon size="md" className="text-amber-600" />
                </div>
              </Flex>
              <Heading3 className="text-center mb-2">Cork Board Interface</Heading3>
              <Text className="text-center">
                Organize your books visually with a beautiful cork board aesthetic where book covers
                are pinned like notes.
              </Text>
            </FeatureCard>
            
            <FeatureCard>
              <Flex justify="center" className="mb-4">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <PlusIcon size="md" className="text-amber-600" />
                </div>
              </Flex>
              <Heading3 className="text-center mb-2">Easy Book Management</Heading3>
              <Text className="text-center">
                Add books quickly with search, ISBN scanning, or bulk import. Organize into custom
                shelves and categories.
              </Text>
            </FeatureCard>
            
            <FeatureCard>
              <Flex justify="center" className="mb-4">
                <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <SearchIcon size="md" className="text-amber-600" />
                </div>
              </Flex>
              <Heading3 className="text-center mb-2">Smart Organization</Heading3>
              <Text className="text-center">
                Drag-and-drop reordering, multiple view modes, and intelligent filtering to keep your
                TBR list perfectly organized.
              </Text>
            </FeatureCard>
          </Grid>
        </Section>

        {/* Preview Section */}
        <Section spacing="lg">
          <div className="text-center">
            <Heading2 className="mb-8">
              Manage Your Books Like Never Before
            </Heading2>
            <Card variant="elevated" className="max-w-4xl mx-auto p-8">
              <Grid cols={4} gap="md">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="aspect-[2/3] bg-gradient-to-br from-amber-200 to-amber-300 rounded-lg shadow-md transform rotate-1 hover:rotate-0 transition-transform cursor-pointer"
                    style={{ transform: `rotate(${Math.random() * 6 - 3}deg)` }}
                  >
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center relative">
                      <BookOpenIcon size="lg" className="text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                    </div>
                  </div>
                ))}
              </Grid>
              <Text className="mt-6">
                Visual cork board interface with drag-and-drop organization
              </Text>
            </Card>
          </div>
        </Section>
      </Container>
    </PageLayout>
  )
}