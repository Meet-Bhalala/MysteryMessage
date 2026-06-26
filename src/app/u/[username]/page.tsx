import { notFound } from "next/navigation";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import SendMessageForm from "@/components/SendMessageForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PublicProfilePageProps = {
    params: Promise<{ username: string }>;
}

const Page = async ({ params }: PublicProfilePageProps) => {
    const { username } = await params;

    let user;

    try {
        await dbConnect();
        user = await UserModel.findOne({ username, isVerified: true });
    } catch (error) {
        console.error("Failed to load public profile", error);
        notFound();
    }

    if (!user) {
        notFound();
    }

    // Sort messages to show latest first
    const messages = [...(user.messages || [])].reverse();

    return (
        <div className="min-h-screen bg-linear-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            {/* Top decorative glass navbar element */}
            <div className="sticky top-0 z-40 w-full border-b border-neutral-100/80 bg-white/70 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/70">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-8">
                    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-neutral-800 dark:text-neutral-100">
                        <MessageSquare className="h-5 w-5 text-neutral-900 dark:text-neutral-50" />
                        <span>MysteryMessage</span>
                    </Link>
                    <Link href="/sign-up">
                        <Button variant="outline" size="sm" className="rounded-full shadow-sm hover:scale-102 active:scale-98 cursor-pointer">
                            Create Board
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-12 md:px-8">
                {/* Hero profile header */}
                <div className="mb-10 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 text-white shadow-md dark:bg-neutral-100 dark:text-neutral-950">
                        <span className="text-2xl font-bold uppercase">{username.slice(0, 2)}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Anonymous Profile
                    </span>
                    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                        @{user.username}
                    </h1>
                    <p className="mt-3 text-base text-neutral-500 dark:text-neutral-400">
                        Send a private, completely anonymous message to this user.
                    </p>
                </div>

                {/* Render the dynamic interactive form */}
                <SendMessageForm username={username} />

                {/* CTA to invite others */}
                <Card className="mt-8 border border-neutral-100 bg-neutral-900 text-white shadow-xl dark:border-neutral-800 dark:bg-white dark:text-neutral-900 overflow-hidden relative">
                    {/* Background glows */}
                    <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-neutral-700/50 blur-3xl dark:bg-neutral-200/50"></div>
                    <CardContent className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2 max-w-md">
                            <h3 className="text-lg font-bold tracking-tight">Create Your Own Message Board</h3>
                            <p className="text-sm text-neutral-300 dark:text-neutral-600">
                                Get anonymous messages and feedback from your friends, fans, or coworkers today!
                            </p>
                        </div>
                        <Link href="/sign-up" className="self-start md:self-auto">
                            <Button className="bg-white text-neutral-950 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 rounded-xl px-5 py-5 font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all duration-200 cursor-pointer">
                                Get Started
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Separator className="my-10" />

                {/* Recent messages board */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight text-neutral-800 dark:text-white">
                            Recent Messages
                        </h2>
                        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            {messages.length}
                        </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        {messages.length > 0 ? (
                            messages.map((message) => (
                                <Card 
                                    key={String(message._id)}
                                    className="border border-neutral-100 shadow-sm bg-white hover:shadow-md transition-all duration-200 hover:border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900/50"
                                >
                                    <CardContent className="p-5 flex flex-col justify-between h-full min-h-[100px]">
                                        <p className="text-sm leading-6 text-neutral-700 dark:text-neutral-300 break-words">
                                            "{message.content}"
                                        </p>
                                        <span className="mt-4 block text-[10px] font-medium tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
                                            {message.createdAt ? new Date(message.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }) : 'Anonymous'}
                                        </span>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10">
                                <MessageSquare className="mx-auto h-8 w-8 text-neutral-400 dark:text-neutral-600 mb-3 stroke-[1.5]" />
                                <h3 className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">No messages yet</h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Be the first one to send a message!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;