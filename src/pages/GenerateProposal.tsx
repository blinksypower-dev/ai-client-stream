import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Save, Sparkles } from "lucide-react";

const GenerateProposal = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("professional");
  const [generatedProposal, setGeneratedProposal] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const generateMockProposal = (description: string, selectedTone: string) => {
    const toneStyles = {
      professional: "I am writing to express my strong interest in your project",
      friendly: "Hi there! I'm really excited about the opportunity to work on your project",
      persuasive: "Your project caught my attention because it aligns perfectly with my expertise",
    };

    const intro = toneStyles[selectedTone as keyof typeof toneStyles];

    return `${intro}. Based on your requirements:\n\n${description}\n\nI bring extensive experience in delivering high-quality solutions that exceed client expectations. My approach combines technical excellence with clear communication, ensuring your project succeeds.\n\nKey deliverables:\n• Complete project implementation\n• Regular progress updates\n• Quality assurance and testing\n• Post-delivery support\n\nI'm confident I can deliver exceptional results for your project. Let's discuss how we can work together to bring your vision to life.\n\nBest regards`;
  };

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation with a delay
    setTimeout(() => {
      const proposal = generateMockProposal(jobDescription, tone);
      setGeneratedProposal(proposal);
      setIsGenerating(false);
      toast.success("Proposal generated successfully!");
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProposal);
    toast.success("Proposal copied to clipboard!");
  };

  const handleSave = async () => {
    if (!generatedProposal) {
      toast.error("No proposal to save");
      return;
    }

    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to save proposals");
      setIsSaving(false);
      return;
    }

    const { error } = await supabase.from("proposals").insert({
      user_id: user.id,
      content: generatedProposal,
      tone,
      job_description: jobDescription,
    });

    setIsSaving(false);

    if (error) {
      toast.error("Error saving proposal");
    } else {
      toast.success("Proposal saved successfully!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">Generate Proposal</h1>
        <p className="text-muted-foreground">Create AI-powered proposals tailored to your clients</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>Provide the job description and select your tone</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="persuasive">Persuasive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              variant="gradient"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate Proposal"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Proposal</CardTitle>
            <CardDescription>Review and save your AI-generated proposal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedProposal}
              onChange={(e) => setGeneratedProposal(e.target.value)}
              placeholder="Your generated proposal will appear here..."
              rows={10}
              className="resize-none"
            />

            <div className="flex gap-2">
              <Button
                onClick={handleCopy}
                disabled={!generatedProposal}
                variant="outline"
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={handleSave}
                disabled={!generatedProposal || isSaving}
                variant="gradient"
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GenerateProposal;
