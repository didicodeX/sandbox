import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateProject() {
  return (
    <div className="flex flex-col items-center mt-20 h-screen">
      <h1 className="text-2xl font-bold">Create Project</h1>
      <form className="flex flex-col gap-4" action={async (formData) => {
        "use server";
        const name = formData.get("name");
        const description = formData.get("description");
        console.log(name, description);
      }}>
        <Input type="text" name="name" placeholder="Project Name" className="w-full" />
        <Textarea name="description" placeholder="Project Description" className="w-full"/>
        <Button type="submit">Create Project</Button>
      </form>
    </div>
  );
}
