import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="p-6 max-w-sm w-full space-y-4">
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">shadcn + Tailwind ✅</h1>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="you@example.com" />
          </div>
          <Button className="w-full mt-4">Submit</Button>
        </CardContent>
      </Card>
    </main>
  );
}
