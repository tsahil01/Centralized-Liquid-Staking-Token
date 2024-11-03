import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <div className="flex justify-center items-center min-h-screen w-full mx-auto">
      <Card className="w-[550px]">
      <CardHeader>
        <CardTitle className="text-4xl font-bold">Swap</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
      </div>
    </>
  );
}
