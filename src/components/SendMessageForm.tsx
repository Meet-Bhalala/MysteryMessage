'use client';

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";

type SendMessageFormProps = {
    username: string;
};

const DEFAULT_SUGGESTIONS = [
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?"
];

const FALLBACK_POOL = [
    "What's a hobby you've recently started?",
    "If you could have dinner with any historical figure, who would it be?",
    "What's a simple thing that makes you happy?",
    "What is the best piece of advice you have ever received?",
    "What is your dream travel destination and why?",
    "If you could have any superpower, what would it be?",
    "What is a book or movie that completely changed your perspective?",
    "What is something you are looking forward to in the next month?",
    "What is your favorite way to unwind after a long day?",
    "What is your favorite memory from childhood?",
    "If you could learn any language fluently, what would it be?",
    "What's the most adventurous thing you've ever done?"
];

export default function SendMessageForm({ username }: SendMessageFormProps) {
    const [messageContent, setMessageContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestedMessages, setSuggestedMessages] = useState<string[]>(DEFAULT_SUGGESTIONS);

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessageContent(e.target.value);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setMessageContent(suggestion);
        toast.info("Suggestion applied!");
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate with Zod schema
        const validation = messageSchema.safeParse({ content: messageContent });
        if (!validation.success) {
            const errorMessage = validation.error.issues[0]?.message || "Invalid message length";
            toast.error(errorMessage);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>("/api/send-message", {
                username,
                content: messageContent,
            });

            if (response.data.success) {
                toast.success("Message sent anonymously!");
                setMessageContent("");
            } else {
                toast.error(response.data.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message", error);
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data?.message || "Failed to send message. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        setIsSuggesting(true);
        try {
            const response = await fetch("/api/suggest-message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch suggestion stream");
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let rawText = "";

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    rawText += decoder.decode(value);
                }
            }

            // Parse Next.js AI SDK stream chunks (e.g., 0:"...", 0:"...")
            let cleanedText = "";
            const lines = rawText.split("\n");
            for (const line of lines) {
                if (line.startsWith("0:")) {
                    try {
                        const chunk = JSON.parse(line.substring(2));
                        cleanedText += chunk;
                    } catch (e) {
                        const trimmed = line.substring(2).trim();
                        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                            cleanedText += trimmed.slice(1, -1);
                        } else {
                            cleanedText += trimmed;
                        }
                    }
                } else if (!line.includes(":") && line.trim().length > 0) {
                    cleanedText += line;
                }
            }

            if (!cleanedText && rawText.includes("||")) {
                cleanedText = rawText;
            }

            if (cleanedText && cleanedText.includes("||")) {
                const questions = cleanedText
                    .split("||")
                    .map((q) => q.trim().replace(/^"|"$/g, ""))
                    .filter((q) => q.length > 0);
                
                if (questions.length > 0) {
                    setSuggestedMessages(questions);
                    toast.success("AI Suggestions refreshed!");
                    return;
                }
            }

            throw new Error("Parsed text did not contain separated questions");
        } catch (error) {
            console.warn("AI suggest-message API failed or key is missing. Using local suggestion pool.", error);
            
            // Randomly select 3 suggestions from our fallback pool
            const shuffled = [...FALLBACK_POOL].sort(() => 0.5 - Math.random());
            setSuggestedMessages(shuffled.slice(0, 3));
            toast.info("Suggestions updated!");
        } finally {
            setIsSuggesting(false);
        }
    };

    const isLengthValid = messageContent.length >= 10 && messageContent.length <= 300;
    const isTooShort = messageContent.length > 0 && messageContent.length < 10;
    const isTooLong = messageContent.length > 300;

    return (
        <div className="space-y-8">
            <Card className="border border-neutral-100 shadow-xl bg-white/80 backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold tracking-tight text-neutral-800">
                        Send Anonymous Message
                    </CardTitle>
                    <CardDescription className="text-neutral-500">
                        Type your message below. The user will not know who sent it!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="relative">
                            <textarea
                                value={messageContent}
                                onChange={handleTextareaChange}
                                placeholder="Write your anonymous message here..."
                                rows={5}
                                className={`w-full min-h-[120px] p-4 rounded-xl border bg-neutral-50 text-neutral-800 placeholder-neutral-400 transition-all duration-200 outline-none resize-y text-base focus:bg-white focus:ring-4 ${
                                    isTooShort
                                        ? "border-amber-400 focus:border-amber-400 focus:ring-amber-100"
                                        : isTooLong
                                        ? "border-rose-400 focus:border-rose-400 focus:ring-rose-100"
                                        : isLengthValid
                                        ? "border-emerald-400 focus:border-emerald-400 focus:ring-emerald-100"
                                        : "border-neutral-200 focus:border-neutral-400 focus:ring-neutral-100"
                                }`}
                            />
                            
                            <div className="absolute bottom-3 right-3 flex items-center gap-2 pointer-events-none select-none">
                                <span className={`text-xs font-semibold px-2 py-1 rounded-md transition-all duration-200 ${
                                    isTooShort
                                        ? "bg-amber-50 text-amber-600 border border-amber-200"
                                        : isTooLong
                                        ? "bg-rose-50 text-rose-600 border border-rose-200"
                                        : isLengthValid
                                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                        : "bg-neutral-100 text-neutral-500 border border-neutral-200"
                                }`}>
                                    {messageContent.length} / 300
                                </span>
                            </div>
                        </div>

                        {isTooShort && (
                            <p className="text-xs font-medium text-amber-600 flex items-center gap-1 animate-pulse">
                                ⚠ Message is too short. Minimum 10 characters required ({10 - messageContent.length} more).
                            </p>
                        )}
                        {isTooLong && (
                            <p className="text-xs font-medium text-rose-600 flex items-center gap-1 animate-pulse">
                                ⚠ Message exceeds the 300 character limit by {messageContent.length - 300} characters.
                            </p>
                        )}

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isLoading || !isLengthValid}
                                className={`px-6 py-2.5 rounded-xl font-semibold shadow-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                                    isLengthValid 
                                        ? "bg-gradient-to-r from-neutral-800 to-neutral-950 text-white hover:from-neutral-700 hover:to-neutral-900 active:scale-95" 
                                        : "bg-neutral-200 text-neutral-400 border border-neutral-100 cursor-not-allowed"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card className="border border-neutral-100 shadow-lg bg-neutral-50/50 backdrop-blur-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle className="text-lg font-bold text-neutral-800">
                            Need Inspiration?
                        </CardTitle>
                        <CardDescription className="text-neutral-500">
                            Click any suggestion below to fill your message box.
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isSuggesting}
                        onClick={fetchSuggestedMessages}
                        className="border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 flex items-center gap-1.5 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        {isSuggesting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                        ) : (
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        Suggest
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid gap-3">
                        {suggestedMessages.map((msg, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(msg)}
                                className="w-full text-left p-3.5 rounded-xl border border-neutral-100 bg-white hover:bg-neutral-50/80 hover:border-neutral-300 text-neutral-700 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer hover:translate-x-1 active:scale-99"
                            >
                                {msg}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
