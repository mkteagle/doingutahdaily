import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/utils/blogHelpers";
import { CategoryBadge } from "./Blog/CategoryBadge";

export function CategoryBadgePreview() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Category Badges</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Small badges */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Small</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <CategoryBadge key={category} category={category} size="sm" />
            ))}
          </div>
        </div>

        {/* Medium badges */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Medium (Default)
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <CategoryBadge key={category} category={category} size="md" />
            ))}
          </div>
        </div>

        {/* Large badges */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Large</h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <CategoryBadge key={category} category={category} size="lg" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
